import React, { useState, useEffect } from "react";
import {
  Button,
  Checkbox,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Tooltip,
} from "@mui/material";
import "./CustomizeColum.scss";
import { CallApi } from "../../../../API/CallApi/CallApi";
import { MessageCircle, NotebookPen, Printer } from "lucide-react";
import ColorPickerPanel from "./ColorPickerPanel/ColorPickerPanel";
import { toast } from "react-toastify";

const defaultField = {
  ColId: null,
  ReportId: null,
  FieldName: "",
  HeaderName: "",
  Regex: null,
  ColumnType: "Text",
  MasterId: null,
  Width: "",
  HeaderAlign: "left",
  IframeTypeId: "",
  ColumnAlign: "left",
  OnHrefNavigate: "",
  RedirectId: 0,
  DisplayOrder: "",
  FontSize: 10,
  DefaultSort: "normall",
  TwoColumnData: "Select",
  BackgroundColor: "",
  FontColor: "",
  BorderRadius: "",
  SummaryValueKey: "",
  SummaryTitle: "",
  SummeryOrder: "",
  SummaryUnit: "",
  IconName: "",
  FriendlyName: "",
  ColumnDecimal: "",
  GroupChekBox: false,
  DefaultGroupChekBox: false,
  GroupColumnImageView: false,
  ActionFilter: false,
  CopyButton: false,
  HideColumn: false,
  ImageColumn: false,
  IsPriorityColumn: false,
  PriorityColorColumn: false,
  CurrencyColumn: false,
  IsShowDateWithTime: false,
  ActionMasterName: "",
  DateTimeFrame: 0,
};

const defaultFieldFilter = {
  NormalFilter: false,
  MultiSelection: false,
  RangeFilter: false,
  SuggestionFilter: false,
  SelectDropdownFilter: false,
  ServerSideFilter: false,
};

const defaultFieldSummury = {
  Summary: false,
  SummaryValueFormated: false,
  UniqueCountSummury: false,
};

const defaultFieldNavigate = {
  HrefLink: false,
  HyperlinkShowButton: false
};

const defaultColorPicker = {
  "IsPositiveNagativeColor": 0,
  "PvFColor": null,
  "PvBgColor": null,
  "NvFColor": null,
  "NvBgColor": null
};

const CustomizeColum = ({
  selectedColumn,
  spId,
  onClose,
  allColumData,
  redirectionMaster,
  onSave,
  customizeMasterGroupCheckBox
}) => {
  const clientIpAddress = sessionStorage.getItem("clientIpAddress");
  const [formData, setFormData] = useState({ ...defaultField });
  const [colorPicker, setColorPicker] = useState({ ...defaultColorPicker });
  useEffect(() => {
    const base = selectedColumn?.__original || selectedColumn;
    setFormData((prev) => ({
      ...prev,
      ...base,
      ReportId: spId,
      IsInFilterSection: base?.IsInFilterSection ? 1 : 0,
      IsOnScreenFilter: base?.IsOnScreenFilter ? 1 : 0,
    }));

    setColorPicker({
      IsPositiveNagativeColor: base?.IsPositiveNagativeColor ?? 0,
      PvFColor: base?.PvFColor ?? "#000000",
      PvBgColor: base?.PvBgColor ?? "#00ff00",
      NvFColor: base?.NvFColor ?? "#ff0000",
      NvBgColor: base?.NvBgColor ?? "#ffff00",
    });

  }, [selectedColumn, spId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;

    if (name === "GroupChekBox" && checked && !customizeMasterGroupCheckBox) {
      toast.warning("First enable GroupCheckBox in Report Options", {
        position: "top-center",
      });
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const saveData = async () => {
    if (!formData.HeaderName || !formData.FieldName) {
      alert("Header Name and Field Name are required");
      return;
    }

    const basePayload = {
      ColId: formData.ColId,
      ReportId: spId,
      FieldName: formData.FieldName,
      HeaderName: formData.HeaderName,
      Regex: formData.Regex,
      ColumnType: formData.ColumnType,
      MasterId: formData.MasterId,
      IconName: formData.IconName,
      Width: Number(formData.Width) || null,
      HeaderAlign: formData.HeaderAlign,
      IframeTypeId: formData.IframeTypeId,
      ColumnAlign: formData.ColumnAlign,
      OnHrefNavigate: formData.OnHrefNavigate,
      RedirectId: parseInt(formData.RedirectId),
      IsVisible: 1,
      // DateColumn: formData.DateColumn ? 1 : 0,
      DisplayOrder: formData.DisplayOrder,
      FontSize: parseInt(formData.FontSize) || 12,
      DefaultSort: formData.DefaultSort || "normall",
      TwoColumnData: formData.TwoColumnData || "Select",
      BackgroundColor: formData.BackgroundColor,
      FontColor: formData.FontColor,
      BorderRadius: Number(formData.BorderRadius) || 0,
      CopyButton: formData.CopyButton ? 1 : 0,
      GrupChekBox: formData.GroupChekBox ? 1 : 0,
      DefaultGrupChekBox: formData.DefaultGroupChekBox ? 1 : 0,
      IsPriorityColumn: formData.IsPriorityColumn ? 1 : 0,
      PriorityColorColumn: formData.PriorityColorColumn ? 1 : 0,
      IsCurrency: formData.CurrencyColumn ? 1 : 0,
      IsShowDateWithTime: formData.IsShowDateWithTime ? 1 : 0,
      IsUniqueCount: formData.UniqueCountSummury ? 1 : 0,
      ActionFilter: formData.ActionFilter ? 1 : 0,
      ActionMasterName: formData.ActionMasterName,
      IsLargeDataGroup: formData.IsLargeDataGroup ? 1 : 0,
      DateTimeFrame: formData.DateTimeFrame || 0,
      FriendlyName: formData.FriendlyName || "",
      HideColumn: formData.HideColumn ? 1 : 0,
      ImageColumn: formData.ImageColumn ? 1 : 0,
      GroupColumnImageView: formData.GroupColumnImageView ? 1 : 0,
      ColumnDecimal: formData.ColumnDecimal
        ? Number(formData.ColumnDecimal)
        : null, // ✅ Fix
    };

    const filterPayload = {
      NormalFilter: formData.NormalFilter ? 1 : 0,
      DateRangeFilter: formData.DateRangeFilter ? 1 : 0,
      MultiSelection: formData.MultiSelection ? 1 : 0,
      RangeFilter: formData.RangeFilter ? 1 : 0,
      SuggestionFilter: formData.SuggestionFilter ? 1 : 0,
      SelectDropdownFilter: formData.SelectDropdownFilter ? 1 : 0,
      ServerSideFilter: formData.ServerSideFilter ? 1 : 0,

    };

    const summaryPayload = {
      Summary: formData.Summary ? 1 : 0,
      SummaryValueFormated: formData.SummaryValueFormated ? 1 : 0,
      SummaryValueKey: formData.SummaryValueKey || null,
      SummaryTitle: formData.SummaryTitle || null,
      SummeryOrder: formData.SummeryOrder || null,
      SummaryUnit: formData.SummaryUnit || null,
    };

    const defaultFieldNavigate = {
      HrefLink: formData.HrefLink,
      HyperlinkShowButton: formData.HyperlinkShowButton,
      OnHrefLinkModel: formData.OnHyperlinkLinkModel,
      // OnHyperlinkLinkModel: false,
    };

    const finalPayload = {
      ...basePayload,
      ...filterPayload,
      ...summaryPayload,
      ...defaultFieldNavigate,
      ColumnFilter: 1,
      IsInFilterSection: formData.IsInFilterSection || 0, // 0 if not selected
      IsOnScreenFilter: formData.IsOnScreenFilter || 0,     // 0 if not selected
      ...colorPicker
    };

    let AllData = JSON.parse(sessionStorage.getItem("reportVarible"));
    const payload = {
      con: JSON.stringify({
        mode: "updateEditColumnRecord",
        appuserid: AllData?.LUId,
        IPAddress: clientIpAddress
      }),
      p: JSON.stringify(finalPayload),
      f: "DynamicReport ( Update column settings record list )",
    };

    try {
      const res = await CallApi(payload);
      if (onSave) {
        onSave({
          ...formData,
          ...colorPicker,
          IsPositiveNagativeColor: colorPicker.IsPositiveNagativeColor
        });
      }
      if (onClose) onClose();
    } catch (err) {
      console.error("❌ Failed updating column", err);
      alert("Failed to save column changes.");
    }
  };

  const iconOptions = [
    { name: "NotebookPen", component: <NotebookPen /> },
    { name: "Printer", component: <Printer /> },
    { name: "MessageCircle", component: <MessageCircle /> },
  ];

  return (
    <div className="Customize_Colum_Full_main">
      <div className="Customize_Colum_main">
        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
          {[
            "HeaderName",
            "FieldName",
            "Width",
            "DisplayOrder",
            "BackgroundColor",
            "FontColor",
            "BorderRadius",
            "FriendlyName",
            formData?.ColumnType === "Number" && "ColumnDecimal",
          ]
            .filter(Boolean)
            .map((field) => (
              <TextField
                key={field}
                name={field}
                variant="outlined"
                label={field}
                value={formData[field] || ""}
                onChange={handleInputChange}
                style={{ width: "47.5%" }}
                className="customize_colum_input"
                InputLabelProps={{
                  style: {
                    fontFamily: "Poppins, sans-serif",
                  },
                }}
              />
            ))}
        </div>

        <div
          style={{
            marginTop: "10px",
            display: "flex",
            gap: "10px",
            width: "100%",
            height: "50px",
          }}
        >
          <FormControl style={{ width: "20%", height: "30px" }} size="small">
            <InputLabel
              style={{
                fontFamily: "Poppins, sans-serif",
              }}
            >
              HeaderAlign
            </InputLabel>
            <Select
              label="HeaderAlign"
              name="HeaderAlign"
              value={formData.HeaderAlign}
              onChange={handleInputChange}
              style={{
                height: 40,
                fontSize: 16,
              }}
              MenuProps={{
                PaperProps: {
                  style: {
                    maxHeight: 200,
                  },
                },
              }}
            >
              <MenuItem value="left">left</MenuItem>
              <MenuItem value="center">center</MenuItem>
              <MenuItem value="right">right</MenuItem>
            </Select>
          </FormControl>

          <FormControl style={{ width: "20%", height: "30px" }} size="small">
            <InputLabel
              style={{
                fontFamily: "Poppins, sans-serif",
              }}
            >
              ColumnAlign
            </InputLabel>
            <Select
              label="ColumnAlign"
              name="ColumnAlign"
              value={formData.ColumnAlign}
              onChange={handleInputChange}
              style={{
                height: 40,
                fontSize: 16,
              }}
              MenuProps={{
                PaperProps: {
                  style: {
                    maxHeight: 200,
                  },
                },
              }}
            >
              <MenuItem value="left">left</MenuItem>
              <MenuItem value="center">center</MenuItem>
              <MenuItem value="right">right</MenuItem>
            </Select>
          </FormControl>

          <FormControl style={{ width: "20%", height: "30px" }} size="small">
            <InputLabel
              style={{
                fontFamily: "Poppins, sans-serif",
              }}
            >
              FontSize
            </InputLabel>
            <Select
              label="FontSize"
              name="FontSize"
              value={formData.FontSize}
              onChange={handleInputChange}
              style={{
                height: 40,
                fontSize: 16,
              }}
              MenuProps={{
                PaperProps: {
                  style: {
                    maxHeight: 200,
                  },
                },
              }}
            >
              <MenuItem value="10">10</MenuItem>
              <MenuItem value="12">12</MenuItem>
              <MenuItem value="14">14</MenuItem>
              <MenuItem value="16">16</MenuItem>
            </Select>
          </FormControl>

          <FormControl style={{ width: "20%", height: "30px" }} size="small">
            <InputLabel
              style={{
                fontFamily: "Poppins, sans-serif",
              }}
            >
              Default Sorting
            </InputLabel>
            <Select
              label="Default Sorting"
              name="DefaultSort"
              value={formData.DefaultSort}
              onChange={handleInputChange}
              style={{
                height: 40,
                fontSize: 16,
              }}
              MenuProps={{
                PaperProps: {
                  style: {
                    maxHeight: 200,
                  },
                },
              }}
            >
              <MenuItem value="normall">-sort-</MenuItem>
              <MenuItem value="ascending">Ascending Order</MenuItem>
              <MenuItem value="descending">Descending Order</MenuItem>
            </Select>
          </FormControl>

          <FormControl style={{ width: "20%", height: "30px" }} size="small">
            <InputLabel
              style={{
                fontFamily: "Poppins, sans-serif",
              }}
            >
              Two ColumnData
            </InputLabel>
            <Select
              label="Two ColumnData"
              name="TwoColumnData"
              value={formData.TwoColumnData}
              onChange={handleInputChange}
              style={{
                height: 40,
                fontSize: 16,
              }}
              MenuProps={{
                PaperProps: {
                  style: {
                    maxHeight: 200,
                  },
                },
              }}
            >
              <MenuItem value="Select">-Select-</MenuItem>
              {allColumData?.map((data, index) => (
                <MenuItem value={data?.FieldName} key={index}>
                  {data?.FieldName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap" }}>
          {Object.keys(defaultField)
            .filter((key) => typeof defaultField[key] === "boolean")
            .filter((key) => {
              if (key === "IsShowDateWithTime") {
                return formData?.ColumnType === "Date";
              }
              return true;
            })
            .map((key) => (
              <label
                key={key}
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "0px 20px 5px 0px",
                  gap: "4px",
                }}
              >
                <span className="chekbox_title_value">{key}</span>
                <Checkbox
                  name={key}
                  checked={!!formData[key]}
                  onChange={handleCheckboxChange}
                  style={{ margin: "0px", padding: "0px" }}
                />
              </label>
            ))}
        </div>

        <div style={{ display: 'flex', width: '100%', borderTop: "1px solid lightgray", }}>
          <div style={{ width: "50%" }}>
            <p className="other_title">Filter Options</p>
            <div style={{ display: "flex", gap: "30px", marginBottom: "15px", flexWrap: "wrap" }}>
              {["IsInFilterSection", "IsOnScreenFilter"].map((key, index) => (
                <div key={key} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <span className="chekbox_title_value">{key}</span>
                  <div
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        IsInFilterSection: key === "IsInFilterSection" ? 1 : 0,
                        IsOnScreenFilter: key === "IsOnScreenFilter" ? 1 : 0,
                      }))
                    }
                    style={{
                      width: "15px",
                      height: "15px",
                      borderRadius: "50%",
                      border: "2px solid #766ef3",
                      background: formData[key] === 1 ? "#7d74ff" : "white",
                      cursor: "pointer",
                    }}
                  ></div>
                </div>
              ))}
            </div>

            <div style={{ gap: "30px" }}>
              {Object.keys(defaultFieldFilter)
                .filter((key) => typeof defaultFieldFilter[key] === "boolean")
                .map((key) => (
                  <label
                    key={key}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      padding: "5px 0",
                      gap: "10px",
                      width: 'fit-content',
                    }}
                  >
                    <span className="chekbox_title_value" style={{ minWidth: '180px' }}>{key}</span>
                    <Checkbox
                      name={key}
                      checked={formData[key] || false}
                      onChange={handleCheckboxChange}
                      style={{ margin: "0px", padding: "0px" }}
                    />
                  </label>
                ))}
            </div>
          </div>
          <div>
            <p className="other_title">Positive & Negative Color</p>
            <ColorPickerPanel
              value={colorPicker}
              onChange={(val) => setColorPicker(val)}
            />
          </div>
        </div>

        <div style={{ borderTop: "1px solid lightgray", width: "100%" }}>
          <p className="other_title">Summary</p>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "15px" }}
          >
            <div style={{ display: "flex", gap: "30px" }}>
              {Object.keys(defaultFieldSummury)
                .filter((key) => typeof defaultFieldSummury[key] === "boolean")
                .map((key) => (
                  <label
                    key={key}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      padding: "5px 0",
                      gap: "10px",
                    }}
                  >
                    <span className="chekbox_title_value">{key}</span>
                    <Checkbox
                      name={key}
                      checked={formData[key] || false}
                      onChange={handleCheckboxChange}
                      style={{ margin: "0px", padding: "0px" }}
                    />
                  </label>
                ))}
            </div>
            <div style={{ display: "flex", gap: "15px", width: "100%" }}>
              {[
                "SummaryTitle",
                "SummaryUnit",
                "SummaryValueKey",
                "SummeryOrder",
              ].map((field) => (
                <TextField
                  key={field}
                  name={field}
                  variant="outlined"
                  label={field == "SummaryValueKey" ? "Decimal" : field}
                  value={formData[field] || ""}
                  onChange={handleInputChange}
                  style={{ width: "47.5%" }}
                  className="customize_colum_input"
                  InputLabelProps={{
                    style: {
                      fontFamily: "Poppins, sans-serif",
                    },
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        <div
          style={{
            borderTop: "1px solid lightgray",
            width: "100%",
            display: "flex",
            marginTop: "10px",
          }}
        >
          <div style={{ width: "50%" }}>
            <p className="other_title">Navigation Option</p>
            <div style={{ display: "flex", gap: "15px" }}>
              <div style={{ display: "flex", gap: "30px" }}>
                {Object.keys(defaultFieldNavigate)
                  .filter(
                    (key) => typeof defaultFieldNavigate[key] === "boolean"
                  )
                  .map((key) => (
                    <label
                      key={key}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        padding: "5px 0",
                        gap: "10px",
                      }}
                    >
                      <span className="chekbox_title_value">{key}</span>
                      <Checkbox
                        name={key}
                        checked={formData[key] || false}
                        onChange={handleCheckboxChange}
                        style={{ margin: "0px", padding: "0px" }}
                      />
                    </label>
                  ))}
              </div>
              <div style={{ display: "flex", gap: "30px", width: "100%" }}>
                <FormControl
                  style={{ width: "60%", marginTop: "10px" }}
                  size="small"
                >
                  <InputLabel
                    style={{
                      fontFamily: "Poppins, sans-serif",
                    }}
                  >
                    Select destination report name
                  </InputLabel>
                  <Select
                    label="Enter destination report name"
                    name="RedirectId"
                    value={formData.RedirectId}
                    onChange={handleInputChange}
                    style={{
                      height: 40,
                      fontSize: 16,
                    }}
                    MenuProps={{
                      PaperProps: {
                        style: {
                          maxHeight: 200,
                        },
                      },
                      anchorOrigin: {
                        vertical: "top",
                        horizontal: "left",
                      },
                      transformOrigin: {
                        vertical: "bottom",
                        horizontal: "left",
                      },
                      getContentAnchorEl: null,
                    }}
                  >
                    <MenuItem value={0}>--Select--</MenuItem>
                    {redirectionMaster?.rd1?.map((item) => (
                      <MenuItem key={item.RedirectId} value={item.RedirectId}>
                        {item.RedirectPage}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                {/* {["OnHrefNavigate"].map((field) => (
                  <TextField
                    key={field}
                    name={field}
                    variant="outlined"
                    label="Enter destination report name"
                    value={formData[field] || ""}
                    onChange={handleInputChange}
                    style={{ width: "47.5%" }}
                    className="customize_colum_input"
                    InputLabelProps={{
                      style: {
                        fontFamily: "Poppins, sans-serif",
                      },
                    }}
                  />
                ))} */}
              </div>
            </div>
          </div>
          <div style={{ width: "50%" }}>
            <p className="other_title">Iframe Option</p>

            <FormControl
              style={{ width: "40%", marginTop: "10px" }}
              size="small"
            >
              <InputLabel
                style={{
                  fontFamily: "Poppins, sans-serif",
                }}
              >
                Select Iframe
              </InputLabel>
              <Select
                label="IframeTypeId"
                name="IframeTypeId"
                value={formData.IframeTypeId}
                onChange={handleInputChange}
                style={{
                  height: 40,
                  fontSize: 16,
                }}
                MenuProps={{
                  PaperProps: {
                    style: {
                      maxHeight: 200,
                    },
                  },
                  anchorOrigin: {
                    vertical: "top",
                    horizontal: "left",
                  },
                  transformOrigin: {
                    vertical: "bottom",
                    horizontal: "left",
                  },
                  getContentAnchorEl: null,
                }}
              >
                <MenuItem value="">--Select--</MenuItem>
                {redirectionMaster?.rd.map((item) => (
                  <MenuItem key={item.IframeTypeId} value={item.IframeTypeId}>
                    {item.PopupTitle}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <div
              className="IconDiv"
              style={{ display: "flex", gap: "15px", marginTop: "10px" }}
            >
              {iconOptions.map((icon) => (
                <div
                  key={icon.name}
                  onClick={() => {
                    setFormData((prev) => ({
                      ...prev,
                      IconName: prev.IconName === icon.name ? "" : icon.name,
                    }));
                  }}
                  style={{
                    cursor: "pointer",
                    padding: "8px",
                    borderRadius: "50%",
                    border:
                      formData.IconName === icon.name
                        ? "2px solid rgb(86, 74, 252)"
                        : "1px solid gray",
                    background:
                      formData.IconName === icon.name
                        ? "#e3f2ff"
                        : "transparent",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "0.2s",
                  }}
                >
                  {React.cloneElement(icon.component, {
                    style: {
                      color:
                        formData.IconName === icon.name
                          ? "rgb(86, 74, 252)"
                          : "gray",
                      width: 20,
                      height: 20,
                    },
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="button-group">
        <Button onClick={onClose} className="Btn_CustomizeMaster_Model_Cancel">
          Cancel
        </Button>
        <Button onClick={saveData} className="Btn_Customize_Model_Save">
          Save
        </Button>
      </div>
    </div>
  );
};

export default CustomizeColum;