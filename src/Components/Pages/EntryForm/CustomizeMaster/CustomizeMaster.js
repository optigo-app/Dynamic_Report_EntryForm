import React, { useState, useEffect, forwardRef } from "react";
import {
  Box, Button, Checkbox,
  Modal,
  Drawer,
  Slide,
  Divider
} from "@mui/material";
import "./CustomizeMaster.scss";
import { CallApi } from "../../../../API/CallApi/CallApi";
import AreaChartImg from '../../../images/ChartView/AreaChartImg.png';
import BarChart1img from '../../../images/ChartView/BarChart1.png';
import BarChart2Img from '../../../images/ChartView/BarChart2.png';
import PieChartImg from '../../../images/ChartView/PieChart.png';
import ChartViewDrawer from "./ChartViewDrawer/ChartViewDrawer";
import ImageViewDrawer from "./ImageViewDrawer/ImageViewDrawer";

const SlideRight = forwardRef(function SlideRight(props, ref) {
  return <Slide direction="left" ref={ref} {...props} timeout={400} />;
});

const masterSettingsOrder = [
  "ChartView", "ImageView", "MainDateFilter", "AllDataButton", "MultiDateFilter", "ColumnSettingModel",
  "FullScreenGridButton", "CheckBoxSelection", "GroupCheckBox", "PriorityMaster",
  "CurrencyMaster", "ExcelExport", "MailButton", "PrintButton",
  "MakeNewReport","deafultShowAllData"
];

const DEFAULT_CHART_VIEW = [
  { type: "AreaChart", enabled: false, xAxisColumn: "", yAxisColumn: "" },
  { type: "PieChart", enabled: false, PieDataColumn: "" },
  { type: "BarChart", enabled: false, xAxisColumn: "", yAxisColumn: "" },
  { type: "BarChart2", enabled: false, xAxisColumn: "", yAxisColumn: "" },
];

const modalStyle = {
  position: 'absolute', top: '50%', left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper', border: 'none', outline: 'none',
  boxShadow: 0, p: 4, borderRadius: 5,
};

const clientIpAddress = sessionStorage.getItem("clientIpAddress");

const parseChartViewData = (raw) => {
  try {
    const arr = typeof raw === "string" ? JSON.parse(raw) : raw;
    if (!Array.isArray(arr)) return DEFAULT_CHART_VIEW;
    return DEFAULT_CHART_VIEW.map((def, i) => {
      const saved = arr[i] || {};
      const rawEnabled = saved[def.type];
      const enabled = rawEnabled === true || rawEnabled === 1 || rawEnabled === "true" || rawEnabled === "1";
      if (def.type === "PieChart") {
        return { ...def, enabled, PieDataColumn: saved.PieDataColumn || saved.PieDataColum || "" };
      }
      return { ...def, enabled, xAxisColumn: saved.xAxisColumn || "", yAxisColumn: saved.yAxisColumn || saved.yAxiosColumn || "" };
    });
  } catch {
    return DEFAULT_CHART_VIEW;
  }
};

const buildChartPayload = (chartViewData) => {
  const payload = {};
  chartViewData.forEach((chart) => {
    const enabled = chart.enabled ? 1 : 0;
    if (chart.type === "PieChart") {
      payload["PieChart"] = enabled;
      payload["PieChart_DataColumn"] = chart.enabled ? (chart.PieDataColumn || "") : "";
    } else if (chart.type === "AreaChart") {
      payload["AreaChart"] = enabled;
      payload["AreaChart_xAxisColumn"] = chart.enabled ? (chart.xAxisColumn || "") : "";
      payload["AreaChart_yAxisColumn"] = chart.enabled ? (chart.yAxisColumn || "") : "";
    } else if (chart.type === "BarChart") {
      payload["BarChart"] = enabled;
      payload["BarChart_xAxisColumn"] = chart.enabled ? (chart.xAxisColumn || "") : "";
      payload["BarChart_yAxisColumn"] = chart.enabled ? (chart.yAxisColumn || "") : "";
    } else if (chart.type === "BarChart2") {
      payload["BarChart2"] = enabled;
      payload["BarChart2_xAxisColumn"] = chart.enabled ? (chart.xAxisColumn || "") : "";
      payload["BarChart2_yAxisColumn"] = chart.enabled ? (chart.yAxisColumn || "") : "";
    }
  });
  return payload;
};

const serializeChartViewData = (chartViewData) => {
  return JSON.stringify(
    chartViewData.map((chart) => {
      if (chart.type === "PieChart") {
        return { PieChart: chart.enabled, PieDataColum: chart.PieDataColumn };
      }
      return { [chart.type]: chart.enabled, xAxisColumn: chart.xAxisColumn, yAxisColumn: chart.yAxisColumn };
    })
  );
};

const CustomizeMaster = ({ initialData, spId, onClose, spData }) => {
  console.log('spData: ', spData);
  const [masterSettings, setMasterSettings] = useState({});
  const [chartViewData, setChartViewData] = useState(DEFAULT_CHART_VIEW);
  const [imageViewData, setImageViewData] = useState([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [openChartType, setOpenChartType] = useState("");
  const [activeDrawer, setActiveDrawer] = useState(null);

  useEffect(() => {
    let settings = {};
    const savedRaw = sessionStorage.getItem("masterSetting");
    if (savedRaw) {
      settings = JSON.parse(savedRaw);
    } else if (initialData?.[0]) {
      settings = { ...initialData[0] };
    }
    setMasterSettings(settings);

    if (settings.chartViewData) {
      setChartViewData(parseChartViewData(settings.chartViewData));
    } else if (spData?.chartViewData) {
      setChartViewData(parseChartViewData(spData.chartViewData));
    } else {
      setChartViewData(DEFAULT_CHART_VIEW);
    }

    if (settings.imageViewData) {
      try {
        const parsed = typeof settings.imageViewData === "string"
          ? JSON.parse(settings.imageViewData)
          : settings.imageViewData;
        if (Array.isArray(parsed)) setImageViewData(parsed);
      } catch {
      }
    }

    if (settings.imageViewData) {
      try {
        const parsed =
          typeof settings.imageViewData === "string"
            ? JSON.parse(settings.imageViewData)
            : settings.imageViewData;

        if (Array.isArray(parsed)) setImageViewData(parsed);
      } catch { }
    }
    else if (spData?.ImageDataArray) {
      try {
        const parsed =
          typeof spData.ImageDataArray === "string"
            ? JSON.parse(spData.ImageDataArray)
            : spData.ImageDataArray;

        if (Array.isArray(parsed)) setImageViewData(parsed);
      } catch {
        setImageViewData([]);
      }
    }
  }, [initialData, spId, spData]);

  const handleCheckboxChange = (key) => {
    setMasterSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleAddDataClick = (e, key) => {
    e.preventDefault();
    if (key === "ChartView") setActiveDrawer("chart");
    if (key === "ImageView") setActiveDrawer("image");
  };

  const buildImagePayload = (imageViewData) => {
    if (!Array.isArray(imageViewData)) return [];

    return imageViewData.map((row) => ({
      FieldName: row.value || "",
      lable: row.lable || "",
      value: row.value || "",
      fontsizel: row.fontsizel || "",
      fontsizev: row.fontsizev || "",
      fontweightl: row.fontweightl || "",
      fontweightv: row.fontweightv || "",
      displayorder: row.displayorder || ""
    }));
  };

  const handleSave = async () => {
    const AllData = JSON.parse(sessionStorage.getItem("reportVarible"));
    const masterFields = Object.keys(masterSettings).reduce((acc, key) => {
      if (key === "chartViewData" || key === "imageViewData") return acc;
      acc[key] = masterSettings[key] ? 1 : 0;
      return acc;
    }, {});

    const chartFields = masterSettings.ChartView ? buildChartPayload(chartViewData) : {};
    const imageFields = masterSettings.ImageView
      ? { ImageDataArray: buildImagePayload(imageViewData) }
      : {};

    const p = {
      ReportId: spId,
      ...masterFields,
      ...chartFields,
      ...imageFields
    };

    const payload = {
      con: JSON.stringify({ mode: "updateReportMasterSettings", appuserid: AllData?.LUId, IPAddress: clientIpAddress }),
      p: JSON.stringify(p),
      f: "DynamicReport ( Update report master setting )",
    };

    try {
      await CallApi(payload);
      const toSave = {
        ...masterSettings,
        chartViewData: serializeChartViewData(chartViewData),
        imageViewData: JSON.stringify(imageViewData),
      };
      sessionStorage.setItem("masterSetting", JSON.stringify(toSave));
      if (onClose) onClose();
    } catch (err) {
      console.error("❌ Failed saving master settings", err);
      alert("Failed to save master settings");
    }
  };

  const previewImage =
    openChartType === "AreaChart" ? AreaChartImg :
      openChartType === "PieChart" ? PieChartImg :
        openChartType === "BarChart" ? BarChart1img :
          BarChart2Img;

  // Keys that get an "Add Data" button (only when checked)
  const ADD_DATA_KEYS = ["ChartView", "ImageView"];

  return (
    <div className="Customize_Master_Colum_main" style={{ position: "relative", overflow: "hidden" }}>

      <Modal open={previewOpen} onClose={() => setPreviewOpen(false)}>
        <Box sx={modalStyle}>
          <img src={previewImage} style={{ width: "1500px" }} alt={openChartType} />
        </Box>
      </Modal>

      <div className="left-form">
        <div style={{ display: "flex", flexWrap: "wrap" }}>
          {masterSettingsOrder
            .filter((key) => key in masterSettings)
            .map((key) => {
              const isChecked = Boolean(masterSettings[key]);
              const hasAddData = ADD_DATA_KEYS.includes(key);

              return (
                <div key={key} style={{ width: "50%", marginBottom: "6px" }}>
                  <label
                    style={{
                      width: "fit-content",
                      display: "flex",
                      alignItems: "center",
                      cursor: "pointer",
                    }}
                  >
                    {hasAddData ? (
                      <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                        <span className="chekbox_title_value">{key}</span>
                        {/* Show "Add Data" button only when checked */}
                        {isChecked && (
                          <Button
                            size="small"
                            variant="outlined"
                            onClick={(e) => handleAddDataClick(e, key)}
                            style={{
                              minWidth: "90px",
                              width: "fit-content",
                              fontSize: "11px",
                              padding: "2px 8px",
                              color: "rgb(86, 74, 252)",
                              borderColor: "rgb(86, 74, 252)",
                              textTransform: "none",
                              lineHeight: 1.4,
                            }}
                          >
                            Add Data
                          </Button>
                        )}
                      </div>
                    ) : (
                      <span className="chekbox_title_value">{key}</span>
                    )}

                    <Checkbox
                      checked={isChecked}
                      onChange={() => handleCheckboxChange(key)}
                      style={{ margin: "0px", padding: "4px 4px 4px 8px" }}
                    />
                  </label>
                </div>
              );
            })}
        </div>

        <Divider style={{ margin: "16px 0 12px" }} />

        <div className="button-group" style={{ display: "flex", gap: "12px" }}>
          <Button onClick={onClose} className="Btn_CustomizeMaster_Model_Cancel">
            Cancel
          </Button>
          <Button onClick={handleSave} className="Btn_Customize_Model_Save">
            Save
          </Button>
        </div>
      </div>

      {/* ── Chart View Drawer ── */}
      <Drawer
        anchor="right"
        open={activeDrawer === "chart"}
        onClose={() => setActiveDrawer(null)}
        TransitionComponent={SlideRight}
        keepMounted
        variant="persistent"
        ModalProps={{
          keepMounted: true,
          disablePortal: true,
          hideBackdrop: true,
          style: { position: "absolute" },
        }}
        PaperProps={{
          sx: {
            position: "absolute",
            width: "420px",
            height: "100%",
            top: 0,
            right: 0,
            display: "flex",
            flexDirection: "column",
            boxShadow: "-4px 0 20px rgba(0,0,0,0.15)",
            zIndex: 1300,
          },
        }}
      >
        <ChartViewDrawer
          spData={spData}
          setChartViewData={setChartViewData}
          setChartDrawerOpen={() => setActiveDrawer(null)}
          chartViewData={chartViewData}
          setPreviewOpen={setPreviewOpen}
          setOpenChartType={setOpenChartType}
        />
      </Drawer>

      {/* ── Image View Drawer ── */}
      <Drawer
        anchor="right"
        open={activeDrawer === "image"}
        onClose={() => setActiveDrawer(null)}
        TransitionComponent={SlideRight}
        keepMounted
        variant="persistent"
        ModalProps={{
          keepMounted: true,
          disablePortal: true,
          hideBackdrop: true,
          style: { position: "absolute" },
        }}
        PaperProps={{
          sx: {
            position: "absolute",
            width: "460px",
            height: "100%",
            top: 0,
            right: 0,
            display: "flex",
            flexDirection: "column",
            boxShadow: "-4px 0 20px rgba(0,0,0,0.15)",
            zIndex: 1300,
          },
        }}
      >
        <ImageViewDrawer
          imageViewData={imageViewData}
          setImageViewData={setImageViewData}
          spData={spData}
          onClose={() => setActiveDrawer(null)}
        />
      </Drawer>
    </div>
  );
};

export default CustomizeMaster;