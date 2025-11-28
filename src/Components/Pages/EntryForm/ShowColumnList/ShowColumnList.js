import React, { forwardRef, useEffect, useState } from "react";
import "./ShowColumnList.scss";
import {
  IconButton,
  Typography,
  Checkbox,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  Snackbar,
  Alert,
  TextField,
  Grid,
  Drawer,
  Slide,
  Modal,
  Box,
} from "@mui/material";
import { ArrowLeftFromLine, CheckCircle } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import CustomizeColum from "../CustomizeColum/CustomizeColum";
import CustomizeMaster from "../CustomizeMaster/CustomizeMaster";
import { CallApi } from "../../../../API/CallApi/CallApi";
import LoadingBackdrop from "../../../../Utils/LoadingBackdrop";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="right" ref={ref} {...props} timeout={500} />;
});

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "95%",
  bgcolor: "background.paper",
  border: "none",
  boxShadow: 24,
  borderRadius: 1,
  p: 4,
};

const ShowColumnList = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [spData, setSpData] = useState(null);
  const [selectedCols, setSelectedCols] = useState(["Master Setting"]);
  const [allDateOptions, setAllDateOptions] = useState([]);
  const [allDateOptionsShow, setAllDateOptionsShow] = useState(false);
  const [selectedDateOptions, setSelectedDateOptions] = useState([]); // selected frames
  const [editorOpen, setEditorOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(null);
  const [customizedStatus, setCustomizedStatus] = useState({});
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [otherSettingSnackbarOpen, setOtherSettingSnackbarOpen] =
    useState(false);
  const [snackbarError, setSnackbarError] = useState(false);
  const [largestLength, setLargestLength] = useState("");
  const [spliterMonthCont, setSpliterMonthCont] = useState("");
  const [largeDataColum, setLargeDataColum] = useState();
  const [spliterReportColum, setSpliterReportColum] = useState();
  const [loading, setLoading] = useState(false);
  const [spliterFirst, setSpliterFirst] = useState(null);
  const [spliterSecond, setSpliterSecond] = useState(null);
  const [otherSpliterSideData1, setOtherSpliterSideData1] = useState();
  const [otherSpliterSideData2, setOtherSpliterSideData2] = useState();
  const [iframeMaster, setIframeMaster] = useState();

  useEffect(() => {
    let AllData = JSON.parse(sessionStorage.getItem("reportVarible"));
    const getLargeColumData = async () => {
      const body = {
        con: JSON.stringify({
          mode: "getOtherSettings",
          appuserid: AllData?.LUId,
        }),
        p: JSON.stringify({ ReportId: location.state.ReportId }),
        f: "DynamicReport (get Largedata data)",
      };
      try {
        const response = await CallApi(body);
        if (response) {
          setAllDateOptions(response?.rd || []);
          setLargeDataColum(response?.rd1);
          const activeIds = response.rd2
            .filter((item) => item.IsOn)
            .map((item) => item.DateFrameId);
          setSelectedDateOptions(activeIds);
          setSpliterReportColum(response?.rd3);
        }
      } catch (err) {
        console.error("Failed fetching report settings", err);
      }
    };

    const getIframeMaster = async () => {
      const body = {
        con: JSON.stringify({
          mode: "getRedirectMaster",
          appuserid: AllData?.LUId,
        }),
        p: JSON.stringify({ ReportId: location.state.ReportId }),
        f: "DynamicReport (get Largedata data)",
      };
      try {
        const response = await CallApi(body);
        if (response) {
          setIframeMaster(response);
          console.log("response: ", response);
        }
      } catch (err) {
        console.error("Failed fetching report settings", err);
      }
    };

    const fetchData = async () => {
      setLoading(true);
      if (!location.state?.ReportId) return;

      const body = {
        con: JSON.stringify({
          mode: "getReportAndColumnSettings",
          appuserid: AllData?.LUId,
        }),
        p: JSON.stringify({ ReportId: location.state.ReportId }),
        f: "DynamicReport (get colum data)",
      };

      try {
        const response = await CallApi(body);
        if (response?.rd && response.rd.length > 0) {
          const rdData = response.rd[0];

          setSpData({
            ...rdData,
            master: response?.rd2,
            result: response.rd1 || [],
          });
          setSpliterFirst(rdData?.SpliterFirstPanel || null);
          setSpliterSecond(rdData?.SpliterSecondPanel || null);
          setOtherSpliterSideData1(
            JSON.parse(rdData?.otherSpliterSideData1) || null
          );
          setOtherSpliterSideData2(
            JSON.parse(rdData?.otherSpliterSideData2) || null
          );
        }

        if (response?.rd1 && response.rd1.length > 0) {
          const sortedRd1 = [...response.rd1].sort(
            (a, b) => (a.DisplayOrder || 0) - (b.DisplayOrder || 0)
          );
          setSpData((prev) => ({ ...prev, result: sortedRd1 }));
          const visibleCols = sortedRd1.filter((c) => c.IsVisible === true);

          let initialSelected = [
            "Master Setting",
            ...visibleCols.map((c) => c.HeaderName),
          ];

          if (response?.rd[0]?.IsLargeDataReport) {
            initialSelected.push("Largest Data Report");
            if (response?.rd[0]?.LargeDataCount) {
              setLargestLength(response.rd[0].LargeDataCount.toString());
            }
          }

          if (response?.rd[0]?.IsSpliterReport) {
            initialSelected.push("Spliter Report");
            if (response?.rd[0]?.DateMonthRestriction) {
              setSpliterMonthCont(
                response.rd[0].DateMonthRestriction.toString()
              );
            }
          }

          setAllDateOptionsShow(response?.rd[0]?.ServerSideDateWiseFilter);
          setSelectedCols(initialSelected);

          let statusMap = { "Master Setting": false };
          visibleCols.forEach((c) => {
            statusMap[c.HeaderName] = true;
          });
          setCustomizedStatus(statusMap);
        }

        setLoading(false);
      } catch (err) {
        console.error("Failed fetching report settings", err);
      }
    };

    getIframeMaster();
    getLargeColumData();
    fetchData();
  }, [location.state?.ReportId]);

  const handleToggleFilterOption = async () => {
    const newVal = !allDateOptionsShow;
    setAllDateOptionsShow(newVal);

    try {
      const body = {
        con: JSON.stringify({ mode: "updateDateFrameSettingsReportWise" }),
        p: JSON.stringify({
          ReportId: location.state.ReportId,
          ServerSideDateWiseFilter: newVal,
        }),
        f: "DynamicReport ( get sp list )",
      };
      await CallApi(body);
    } catch (err) {
      console.error("Failed to update filter setting", err);
    }
  };

  const handleDateOptionChange = (dateFrameId) => {
    setSelectedDateOptions((prev) =>
      prev.includes(dateFrameId)
        ? prev.filter((id) => id !== dateFrameId)
        : [...prev, dateFrameId]
    );
  };

  const handleFirstSelect = (colId) => {
    setSpliterFirst((prev) => (prev === colId ? null : colId));
  };

  const handleSecondSelect = (colId) => {
    setSpliterSecond((prev) => (prev === colId ? null : colId));
  };

  const handleCheckboxChange = (label) => {
    setSelectedCols((prev) =>
      prev.includes(label) ? prev.filter((x) => x !== label) : [...prev, label]
    );
  };

  const handleSaveAll = async () => {
    if (!spData?.ReportId || !spData?.result) return;
    try {
      const updatedCols = spData.result.map((col) => ({
        ColId: col.ColId,
        IsVisible: selectedCols.includes(col.HeaderName) ? 1 : 0,
      }));

      const visibilityBody = {
        con: JSON.stringify({ mode: "updateColumnVisibility" }),
        p: JSON.stringify({
          ReportId: spData.ReportId,
          IsLargeDataReport: selectedCols.includes("Largest Data Report"),
          Columns: updatedCols,
        }),
        f: "DynamicReport ( bulk update column visibility )",
      };
      const payload = {
        ReportId: location.state.ReportId,
        Columns: allDateOptions.map((item) => ({
          DateFrameId: item.DateFrameId,
          IsOn: selectedDateOptions.includes(item.DateFrameId),
        })),
      };
      const body = {
        con: JSON.stringify({ mode: "saveDateFrameSettings" }),
        p: JSON.stringify(payload),
        f: "DynamicReport ( saveDateFrameSettings )",
      };

      await CallApi(visibilityBody);
      await CallApi(body);
      if (selectedCols.includes("Largest Data Report")) {
        if (!largestLength || Number(largestLength) <= 0) {
          alert(
            "Please enter a valid length before saving Largest Data Report."
          );
          return;
        }

        const largeDataBody = {
          con: JSON.stringify({ mode: "updateLargeDataSettings" }),
          p: JSON.stringify({
            ReportId: spData?.ReportId,
            LargeDataCount: Number(largestLength),
            Columns: largeDataColum.map((col) => ({
              ColId: col.ColId,
              IsLargeDataGroup: col.IsLargeDataGroup ? 1 : 0,
              DateTimeFrame: col.DateTimeFrame || 0,
            })),
          }),
          f: "DynamicReport ( update large data settings )",
        };

        await CallApi(largeDataBody);
      }

      if (selectedCols.includes("Spliter Report")) {
        if (!spliterMonthCont || Number(spliterMonthCont) <= 0) {
          alert("Please Enter Month Restiction Before Saving Spliter Report.");
          return;
        }
      }

      const spliterDataBody = {
        con: JSON.stringify({ mode: "updateSpliterReportSettings" }),
        p: JSON.stringify({
          ReportId: spData?.ReportId,
          IsSpliterReport: selectedCols.includes("Spliter Report") ? 1 : 0,
          SpliterFirstPanel: spliterFirst || "",
          SpliterSecondPanel: spliterSecond || "",
          DateMonthRestriction: spliterMonthCont,
        }),
        f: "DynamicReport ( update large data settings )",
      };

      await CallApi(spliterDataBody);
      setSnackbarOpen(true);
      // setTimeout(() => {
      //   navigate(`/${location.search}`);
      // }, 1500);
      setTimeout(() => {
        setSnackbarOpen(false);
      }, 3000);
    } catch (err) {
      console.error("❌ Failed to save settings", err);
      setSnackbarError(true);
    }
  };

  const mapSpColToInitial = (col) => ({
    colid: col.id?.toString() || "",
    headerName: col.headerName || "",
    field: col.fieldName || "",
    Width: col.length ? String(col.length) : "",
    dataType: col.dataType || "",
    regex: col.regex || "",
    master: col.master || "",
    __original: col,
  });

  const openMasterCustomize = () => {
    setActiveItem({
      kind: "master",
      title: "Master Setting",
      initialData: spData,
      spId: spData?.ReportId,
    });
    setEditorOpen(true);
  };

  const openColCustomize = (col) => {
    setActiveItem({
      kind: "column",
      title: col.HeaderName || "Column",
      initialData: mapSpColToInitial(col),
      spId: spData?.ReportId,
    });
    setEditorOpen(true);
  };

  const closeEditor = () => {
    setEditorOpen(false);
    setTimeout(() => {
      setActiveItem(null);
    }, 1000);
  };

  const fieldErrors = selectedCols?.filter((col) => !customizedStatus[col]);

  const handleDragEnd = async (result) => {
    if (!result.destination) return;

    const reordered = Array.from(spData.result);
    const [movedItem] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, movedItem);

    // Update DisplayOrder based on new index
    reordered.forEach((col, index) => {
      col.DisplayOrder = index + 1;
    });

    // Update the state properly so UI re-renders
    setSpData((prev) => ({ ...prev, result: reordered }));

    // Prepare payload for API
    const payload = {
      ReportId: spData?.ReportId,
      Columns: reordered.map((col) => ({
        ColId: col.ColId,
        IsVisible: col.IsVisible ? 1 : 0,
        DisplayOrder: col.DisplayOrder,
      })),
    };

    const body = {
      con: JSON.stringify({ mode: "updateDisplayOrderSettings" }),
      p: JSON.stringify(payload),
      f: "DynamicReport (update display order test)",
    };

    try {
      await CallApi(body);
    } catch (err) {
      console.error("Failed to save display order", err);
    }
  };

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [firstSlideValues, setFirstSlideValues] = useState({
    1: {},
    2: {},
    3: {},
    4: {},
  });
  const [secondSlideValues, setSecondSlideValues] = useState({
    1: {},
    2: {},
    3: {},
    4: {},
  });

  const [firstSlideSelected, setFirstSlideSelected] = useState({
    1: "",
    2: "",
    3: "",
    4: "",
  });
  const [secondSlideSelected, setSecondSlideSelected] = useState({
    1: "",
    2: "",
    3: "",
    4: "",
  });

  const [errors, setErrors] = useState({});
  const handleSave = async () => {
    setLoading(true);
    let newErrors = {};
    Object.entries(firstSlideValues).forEach(([block, val]) => {
      if (firstSlideSelected[block] && !val.Title?.trim()) {
        newErrors[`F-${block}`] = "Title is required";
      }
    });
    Object.entries(secondSlideValues).forEach(([block, val]) => {
      if (secondSlideSelected[block] && !val.Title?.trim()) {
        newErrors[`S-${block}`] = "Title is required";
      }
    });
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      setLoading(false);
      return;
    }
    const spliterData = [];
    Object.entries(firstSlideValues).forEach(([block, val]) => {
      if (firstSlideSelected[block]) {
        spliterData.push({
          SideNumber: 1,
          BlockNumber: Number(block),
          SelectedField: firstSlideSelected[block],
          Title: val.Title || "",
          Unit: val.Unit || "",
          Formula: val.Formula || "",
          DecimalValue: val.DecimalValue || "0",
        });
      }
    });
    Object.entries(secondSlideValues).forEach(([block, val]) => {
      if (secondSlideSelected[block]) {
        spliterData.push({
          SideNumber: 2,
          BlockNumber: Number(block),
          SelectedField: secondSlideSelected[block],
          Title: val.Title || "",
          Unit: val.Unit || "",
          Formula: val.Formula || "",
          DecimalValue: val.DecimalValue || "0",
        });
      }
    });

    const sliderDataBody = {
      con: JSON.stringify({ mode: "saveSpliterData" }),
      p: JSON.stringify({
        ReportId: spData?.ReportId,
        SpliterData: spliterData,
      }),
      f: "DynamicReport ( saveSpliterData )",
    };
    console.log("API Payload:", sliderDataBody);
    try {
      const response = await CallApi(sliderDataBody);
      if (response?.rd[0]?.stat == 1) {
        setOtherSettingSnackbarOpen(true);
        setTimeout(() => {
          setOtherSettingSnackbarOpen(false);
        }, 4000);
      }
      setLoading(false);
    } catch (err) {
      console.error(err);
    }
  };

  const SlideValueSelector = ({
    title,
    blockNumber,
    sideNumber,
    selectedField,
    onSelect,
    columns,
    values,
    setValues,
    errors,
    setErrors,
  }) => {
    const handleCheckboxChange = (fieldName) => {
      if (selectedField === fieldName) {
        onSelect(""); // unselect
        setValues((prev) => ({
          ...prev,
          [blockNumber]: { ...prev[blockNumber], SelectedField: "" },
        }));
      } else {
        onSelect(fieldName);
        setValues((prev) => ({
          ...prev,
          [blockNumber]: { ...prev[blockNumber], SelectedField: fieldName },
        }));
      }
    };

    const handleInputChange = (key, value) => {
      setValues((prev) => ({
        ...prev,
        [blockNumber]: { ...prev[blockNumber], [key]: value },
      }));
    };

    return (
      <div style={{ width: "22%" }}>
        <p className="sliper_top_title">{title}</p>

        <div className="sliter_option_main_div">
          <div className="spliter_optios_main_div">
            {columns?.map((col) => (
              <div
                key={`col-${col.ColId}`}
                className="column_row sub_row"
                style={{ display: "flex", alignItems: "center" }}
              >
                <Checkbox
                  checked={selectedField === col.FieldName}
                  onChange={() => handleCheckboxChange(col.FieldName)}
                  className="spliter_chekbox_optins"
                />
                <Typography className="column_label">
                  {col.HeaderName}
                </Typography>
              </div>
            ))}
          </div>

          <div className="spliter_add_deatil_main">
            <div className="slpiter_add_deatil_sub_div">
              <TextField
                type="text"
                label="Enter title"
                size="small"
                fullWidth
                value={values[blockNumber]?.Title || ""}
                onChange={(e) => handleInputChange("Title", e.target.value)}
                error={!!errors[blockNumber]}
                helperText={errors[blockNumber]}
              />
              <TextField
                type="text"
                label="Enter formula"
                size="small"
                fullWidth
                value={values[blockNumber]?.Formula || ""}
                onChange={(e) => handleInputChange("Formula", e.target.value)}
              />
            </div>

            <div className="slpiter_add_deatil_sub_div">
              <TextField
                type="text"
                label="Enter Unit"
                size="small"
                fullWidth
                value={values[blockNumber]?.Unit || ""}
                onChange={(e) => handleInputChange("Unit", e.target.value)}
              />
              <TextField
                type="number"
                label="Enter Decimal"
                size="small"
                fullWidth
                value={values[blockNumber]?.DecimalValue || ""}
                onChange={(e) =>
                  handleInputChange("DecimalValue", e.target.value)
                }
              />
            </div>
          </div>
        </div>
      </div>
    );
  };

  useEffect(() => {
    if (!otherSpliterSideData1) return;

    const mapSlideData = (data, setSelected, setValues) => {
      const newSelected = {};
      const newValues = {};

      Object.entries(data).forEach(([key, value]) => {
        if (value?.length > 0) {
          let blockNumber = 0;

          if (key === "firstSlideFirstData") blockNumber = 1;
          if (key === "firstSlideSecondData") blockNumber = 2;
          if (key === "firstSlideThirdData") blockNumber = 3;
          if (key === "firstSlideFourthData") blockNumber = 4;

          const row = value[0];

          newSelected[blockNumber] = row.selectedField;
          newValues[blockNumber] = {
            Title: row.title || "",
            Unit: row.unit || "",
            Formula: row.formula || "",
            DecimalValue: row.decimal || "",
          };
        }
      });

      // Merge with defaults (to keep other blocks empty)
      setSelected((prev) => ({ ...prev, ...newSelected }));
      setValues((prev) => ({ ...prev, ...newValues }));
    };

    // Fill FIRST SLIDE
    mapSlideData(
      otherSpliterSideData1,
      setFirstSlideSelected,
      setFirstSlideValues
    );

    // Fill SECOND SLIDE
    if (otherSpliterSideData2)
      mapSlideData(
        otherSpliterSideData2,
        setSecondSlideSelected,
        setSecondSlideValues
      );
  }, [otherSpliterSideData1, otherSpliterSideData2]);

  return (
    <div>
      <LoadingBackdrop isLoading={loading} />
      <div className="colum_customize_main">
        <div className="spList_header">
          <Typography variant="h6" className="spList_title">
            {spData?.ReportName}
            {/* <Typography variant="subtitle1" className="sp_subtitle">
              {spData?.spDescription}
            </Typography> */}
          </Typography>
          <IconButton onClick={() => navigate(`/${location.search}`)}>
            <ArrowLeftFromLine style={{ color: "white" }} />
          </IconButton>
        </div>
        {!loading && (
          <div style={{ display: "flex" }}>
            <div className="customize_body">
              {spData?.result?.length !== 0 ? (
                <>
                  <div className="column_list">
                    <div className="column_row master_row">
                      <Checkbox
                        checked={selectedCols.includes("Master Setting")}
                        disabled
                      />

                      <Typography className="column_label">
                        Report Options
                      </Typography>

                      <>
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={openMasterCustomize}
                          style={{
                            marginLeft: "auto",
                            color: "rgb(86, 74, 252)",
                            borderColor: "rgb(86, 74, 252)",
                          }}
                          className="Btn_Customize"
                        >
                          Customize
                        </Button>
                        {/* {customizedStatus["Master Setting"] && (
                          <CheckCircle
                            style={{
                              color: "green",
                              marginLeft: "8px",
                              fontSize: "20px",
                            }}
                          />
                        )} */}
                      </>
                    </div>

                    <DragDropContext onDragEnd={handleDragEnd}>
                      <Droppable droppableId="droppableColumns">
                        {(provided) => {
                          return (
                            <div
                              ref={provided.innerRef}
                              {...provided.droppableProps}
                              className="droppable-columns"
                            >
                              {spData?.result?.map((col, index) => {
                                const label = col.HeaderName;
                                const isChecked = selectedCols.includes(label);
                                const displayNumber =
                                  col.DisplayOrder ?? index + 1;

                                return (
                                  <Draggable
                                    key={col.ColId}
                                    draggableId={col.ColId.toString()}
                                    index={index}
                                  >
                                    {(provided, snapshot) => (
                                      <div
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                        className={`column_row ${
                                          snapshot.isDragging ? "dragging" : ""
                                        }`}
                                        style={{
                                          display: "flex",
                                          alignItems: "center",
                                          background: snapshot.isDragging
                                            ? "#f1f1ff"
                                            : "white",
                                          border: "1px solid #ddd",
                                          borderRadius: "6px",
                                          padding: "6px 10px",
                                          marginBottom: "6px",
                                          ...provided.draggableProps.style,
                                        }}
                                      >
                                        <Checkbox
                                          checked={isChecked}
                                          onChange={() =>
                                            handleCheckboxChange(label)
                                          }
                                        />
                                        <Typography className="column_label">
                                          {col.HeaderName}
                                        </Typography>
                                        {isChecked && (
                                          <>
                                            <Button
                                              variant="outlined"
                                              size="small"
                                              onClick={() =>
                                                openColCustomize(col)
                                              }
                                              style={{
                                                marginLeft: "auto",
                                                color: "rgb(86, 74, 252)",
                                                borderColor: "rgb(86, 74, 252)",
                                              }}
                                              className="Btn_Customize"
                                            >
                                              Customize
                                            </Button>
                                          </>
                                        )}
                                      </div>
                                    )}
                                  </Draggable>
                                );
                              })}
                              {provided.placeholder}
                            </div>
                          );
                        }}
                      </Droppable>
                    </DragDropContext>
                  </div>
                </>
              ) : (
                <Typography
                  variant="body1"
                  style={{ margin: "20px", color: "gray" }}
                >
                  No SP Data Found
                </Typography>
              )}
            </div>
            <div className="showList_LargeMain">
              <div
                className={
                  selectedCols?.includes("Spliter Report")
                    ? "spliterReport_allView"
                    : "LargeData_Report"
                }
              >
                {!selectedCols?.includes("Spliter Report") && (
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <Checkbox
                      checked={selectedCols.includes("Largest Data Report")}
                      onChange={() =>
                        handleCheckboxChange("Largest Data Report")
                      }
                    />
                    <Typography className="column_label">
                      Largest Data Report
                    </Typography>

                    {selectedCols?.includes("Largest Data Report") && (
                      <Grid item xs={12} md={6}>
                        <TextField
                          type="number"
                          label="Enter Length"
                          fullWidth
                          size="small"
                          value={largestLength}
                          onChange={(e) => setLargestLength(e.target.value)}
                          style={{ margin: "0px 15px" }}
                        />
                      </Grid>
                    )}
                  </div>
                )}
                {!selectedCols?.includes("Largest Data Report") && (
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <Checkbox
                      checked={selectedCols.includes("Spliter Report")}
                      onChange={() => handleCheckboxChange("Spliter Report")}
                    />
                    <Typography className="column_label">
                      Spliter Report
                    </Typography>
                    {selectedCols?.includes("Spliter Report") && (
                      <Grid item xs={12} md={6}>
                        <TextField
                          type="number"
                          label="Enter Month Restriction"
                          fullWidth
                          size="small"
                          value={spliterMonthCont}
                          onChange={(e) => setSpliterMonthCont(e.target.value)}
                          style={{ margin: "0px 15px" }}
                        />
                      </Grid>
                    )}
                  </div>
                )}

                {selectedCols?.includes("Largest Data Report") && (
                  <div>
                    <p
                      style={{
                        margin: "10px 0px 0px 13px",
                        fontWeight: 600,
                      }}
                      className="descLine_showColum"
                    >
                      Select For Master Selectin
                    </p>
                    <div className="largest_columns_group">
                      {largeDataColum?.map((col) => (
                        <div
                          key={`ldr-${col.ColId}`}
                          className="column_row sub_row"
                          style={{ display: "flex", alignItems: "center" }}
                        >
                          <Checkbox
                            checked={col.IsLargeDataGroup}
                            onChange={(e) => {
                              setLargeDataColum((prev) =>
                                prev.map((c) =>
                                  c.ColId === col.ColId
                                    ? {
                                        ...c,
                                        IsLargeDataGroup: e.target.checked,
                                      }
                                    : c
                                )
                              );
                            }}
                          />
                          <Typography className="column_label">
                            {col.HeaderName}
                          </Typography>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedCols?.includes("Spliter Report") && (
                  <div>
                    <div className="spliter_optionshow">
                      <div>
                        <p
                          style={{
                            margin: "10px 0px 0px 13px",
                            fontWeight: 600,
                          }}
                          className="descLine_showColum"
                        >
                          Select For First Slide
                        </p>
                        <div className="largest_columns_group">
                          {largeDataColum?.map((col) => (
                            <div
                              key={`ldr1-${col.ColId}`}
                              className="column_row sub_row"
                              style={{ display: "flex", alignItems: "center" }}
                            >
                              <Checkbox
                                checked={spliterFirst === col.FieldName}
                                onChange={() =>
                                  handleFirstSelect(col.FieldName)
                                }
                              />
                              <Typography className="column_label">
                                {col.HeaderName}
                              </Typography>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <p
                          style={{
                            margin: "10px 0px 0px 13px",
                            fontWeight: 600,
                          }}
                          className="descLine_showColum"
                        >
                          Select For Second Slide
                        </p>
                        <div className="largest_columns_group">
                          {largeDataColum?.map((col) => (
                            <div
                              key={`ldr2-${col.ColId}`}
                              className="column_row sub_row"
                              style={{ display: "flex", alignItems: "center" }}
                            >
                              <Checkbox
                                checked={spliterSecond === col.FieldName}
                                onChange={() =>
                                  handleSecondSelect(col.FieldName)
                                }
                              />
                              <Typography className="column_label">
                                {col.HeaderName}
                              </Typography>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <Button
                      style={{
                        color: "blue",
                        textDecoration: "underline",
                        cursor: "pointer",
                        marginTop: "20px",
                      }}
                      onClick={handleOpen}
                    >
                      ADD OTHER DETAIL ON SPLITER VIEW
                    </Button>
                  </div>
                )}
              </div>

              {selectedCols?.includes("Largest Data Report") && (
                <div className="LargeData_Report_DateSection">
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <Checkbox
                      checked={allDateOptionsShow}
                      onChange={handleToggleFilterOption}
                    />
                    <Typography className="column_label">
                      Filter Page Date Option
                    </Typography>
                  </div>
                  {allDateOptionsShow && (
                    <div>
                      <p
                        style={{
                          margin: "10px 0px 0px 13px",
                          fontWeight: 600,
                        }}
                        className="descLine_showColum"
                      >
                        Select For Date Selectin
                      </p>
                      <div className="largest_columns_group">
                        {allDateOptions?.map((col) => (
                          <div
                            key={`ldr-${col.DateFrameId}`}
                            className="column_row sub_row"
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            <Checkbox
                              checked={selectedDateOptions.includes(
                                col.DateFrameId
                              )}
                              onChange={() =>
                                handleDateOptionChange(col.DateFrameId)
                              }
                            />
                            <Typography className="column_label">
                              {col.DateFrame}
                            </Typography>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
        {!loading && (
          <div className="save_section">
            <Button
              variant="contained"
              onClick={handleSaveAll}
              style={{ backgroundColor: "rgb(86, 74, 252)", color: "white" }}
              className="Btn_saveColumList"
            >
              Save
            </Button>
          </div>
        )}
        <Drawer
          anchor="left"
          open={editorOpen}
          onClose={closeEditor}
          keepMounted
          TransitionComponent={Transition}
          PaperProps={{
            sx: {
              width: activeItem?.kind === "master" ? 400 : "80vw",
            },
          }}
        >
          <DialogTitle className="customize_model_title">
            {activeItem?.kind === "master"
              ? "Customize: Report Options"
              : `Customize: ${activeItem?.title || ""}`}
          </DialogTitle>

          <DialogContent dividers>
            {activeItem?.kind === "master" ? (
              <CustomizeMaster
                initialData={spData.master}
                spId={activeItem.spId}
                onClose={closeEditor}
              />
            ) : activeItem?.kind === "column" ? (
              <CustomizeColum
                selectedColumn={activeItem.initialData}
                spId={activeItem.spId}
                onClose={closeEditor}
                allColumData={spData?.result}
                redirectionMaster={iframeMaster}
              />
            ) : null}
          </DialogContent>
        </Drawer>
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={1200}
          onClose={() => setSnackbarOpen(false)}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert severity="success" sx={{ width: "100%" }}>
            Column setting saved successfully. Redirecting to SP List...
          </Alert>
        </Snackbar>

        <Snackbar
          open={otherSettingSnackbarOpen}
          autoHideDuration={1200}
          onClose={() => setOtherSettingSnackbarOpen(false)}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert severity="success" sx={{ width: "100%" }}>
            Other Spliter Setting Saved Successfully.
          </Alert>
        </Snackbar>
        <Snackbar
          open={snackbarError}
          autoHideDuration={3000}
          onClose={() => setSnackbarError(false)}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert severity="error" sx={{ width: "100%" }}>
            {"Please Edit Compulsory Fields Before Saving:\n" +
              fieldErrors?.join(", ")}
          </Alert>
        </Snackbar>
        <Modal open={open} onClose={handleClose}>
          <Box sx={style}>
            <LoadingBackdrop isLoading={loading} />
            <div>
              <div style={{ display: "flex", gap: "20px" }}>
                {[1, 2, 3, 4].map((block) => (
                  <SlideValueSelector
                    key={`F-${block}`}
                    title={`First Slide - Value ${block}`}
                    blockNumber={block}
                    sideNumber={1}
                    selectedField={firstSlideSelected[block]}
                    onSelect={(val) =>
                      setFirstSlideSelected((prev) => ({
                        ...prev,
                        [block]: val,
                      }))
                    }
                    columns={spliterReportColum}
                    values={firstSlideValues}
                    setValues={setFirstSlideValues}
                    errors={
                      errors[`F-${block}`]
                        ? { [block]: errors[`F-${block}`] }
                        : {}
                    }
                    setErrors={setErrors}
                  />
                ))}
              </div>

              <div style={{ display: "flex", gap: "20px" }}>
                {[1, 2, 3, 4].map((block) => (
                  <SlideValueSelector
                    key={`S-${block}`}
                    title={`Second Slide - Value ${block}`}
                    blockNumber={block}
                    sideNumber={2}
                    selectedField={secondSlideSelected[block]}
                    onSelect={(val) =>
                      setSecondSlideSelected((prev) => ({
                        ...prev,
                        [block]: val,
                      }))
                    }
                    columns={spliterReportColum}
                    values={secondSlideValues}
                    setValues={setSecondSlideValues}
                    errors={
                      errors[`S-${block}`]
                        ? { [block]: errors[`S-${block}`] }
                        : {}
                    }
                    setErrors={setErrors}
                  />
                ))}
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: "15px",
                }}
              >
                <Button
                  onClick={() => setOpen(false)}
                  variant="contained"
                  sx={{ mt: 2 }}
                  style={{ backgroundColor: "#f03d3d" }}
                >
                  Close
                </Button>

                <Button
                  onClick={handleSave}
                  variant="contained"
                  sx={{ mt: 2 }}
                  style={{ backgroundColor: "rgb(86, 74, 252)" }}
                >
                  Save
                </Button>
              </div>
            </div>
          </Box>
        </Modal>
      </div>
    </div>
  );
};

export default ShowColumnList;
