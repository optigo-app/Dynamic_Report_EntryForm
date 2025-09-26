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
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { CallApi } from "../../../../API/CallApi/CallApi";

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
  ColumnAlign: "left",
  OnHrefNavigate: "",
  // IsVisible: true,
  // DateColumn: false,
  DisplayOrder: "",
  FontSize: 10,
  BackgroundColor: "",
  FontColor: "",
  BorderRadius: "",
  Decimal: "",
  SummaryTitle: "",
  SummaryUnit: "",
  IconName: "",
  FriendlyName: "",
  ColumnDecimal: "",
  GrupChekBox: false,
  DefaultGrupChekBox: false,
  ActionFilter: false,
  CopyButton: false,
  HideColumn: false,
  ActionMasterName: "",
  DateTimeFrame: 0,
};

const defaultFieldFilter = {
  NormalFilter: false,
  // DateRangeFilter: false,
  MultiSelection: false,
  RangeFilter: false,
  SuggestionFilter: false,
  SelectDropdownFilter: false,
};

const defaultFieldSummury = {
  Summary: false,
  SummaryValueFormated: false,
};

const defaultFieldNavigate = {
  Hyperlink: false,
  OnHyperlinkLinkModel: false,
};

const CustomizeColum = ({ selectedColumn, spId, onClose }) => {
  const [formData, setFormData] = useState({ ...defaultField });
  const sessionKey = `columnSettings_${spId}_${selectedColumn?.__original?.ColId}`;
  useEffect(() => {
    const saved = sessionStorage.getItem(sessionKey);
    if (saved) {
      setFormData(JSON.parse(saved));
    } else if (selectedColumn) {
      const base = selectedColumn.__original || selectedColumn;
      setFormData((prev) => ({
        ...prev,
        ...base,
        ReportId: spId,
      }));
    } else {
      setFormData({ ...defaultField, ReportId: spId });
    }
  }, [selectedColumn, spId, sessionKey]);
  console.log("formDataformData", formData);
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const saveData = async () => {
    if (!formData.HeaderName || !formData.FieldName) {
      alert("Header Name and Field Name are required");
      return;
    }

    console.log("formDataformData", formData);

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
      ColumnAlign: formData.ColumnAlign,
      HrefLink: formData.Hyperlink,
      OnHrefLinkModel: formData.OnHyperlinkLinkModel,
      OnHrefNavigate: formData.OnHrefNavigate,
      IsVisible: 1,
      // DateColumn: formData.DateColumn ? 1 : 0,
      DisplayOrder: Number(formData.DisplayOrder) || null,
      FontSize: parseInt(formData.FontSize) || 12,
      BackgroundColor: formData.BackgroundColor,
      FontColor: formData.FontColor,
      BorderRadius: Number(formData.BorderRadius) || 0,
      CopyButton: formData.CopyButton ? 1 : 0,
      GrupChekBox: formData.GrupChekBox ? 1 : 0,
      DefaultGrupChekBox: formData.DefaultGrupChekBox ? 1 : 0,
      ActionFilter: formData.ActionFilter ? 1 : 0,
      ActionMasterName: formData.ActionMasterName,
      IsLargeDataGroup: formData.IsLargeDataGroup ? 1 : 0,
      DateTimeFrame: formData.DateTimeFrame || 0,
      FriendlyName: formData.FriendlyName || "",
      HideColumn: formData.HideColumn ? 1 : 0,
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
    };

    const summaryPayload = {
      Summary: formData.Summary ? 1 : 0,
      SummaryValueFormated: formData.SummaryValueFormated ? 1 : 0,
      SummaryValueKey: formData.Decimal || null,
      SummaryTitle: formData.SummaryTitle || null,
      SummaryUnit: formData.SummaryUnit || null,
    };

    const finalPayload = {
      ...basePayload,
      ...filterPayload,
      ...summaryPayload,
      ColumnFilter: 1,
    };

    const payload = {
      con: JSON.stringify({ mode: "updateEditColumnRecord" }),
      p: JSON.stringify(finalPayload),
      f: "DynamicReport ( Update column settings record list )",
    };

    try {
      const res = await CallApi(payload);
      if (formData?.ColId) {
        sessionStorage.setItem(sessionKey, JSON.stringify(formData));
      }

      if (onClose) onClose();
    } catch (err) {
      console.error("❌ Failed updating column", err);
      alert("Failed to save column changes.");
    }
  };

  return (
    <div className="Customize_Colum_main">
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

      <div
        style={{
          margin: "10px 0",
          display: "flex",
          gap: "10px",
          width: "100%",
        }}
      >
        <FormControl style={{ width: "20%" }} size="small">
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

        <FormControl style={{ width: "20%" }} size="small">
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

        <FormControl style={{ width: "20%" }} size="small">
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
      </div>

      <div style={{ display: "flex", gap: "30px" }}>
        {Object.keys(defaultField)
          .filter((key) => typeof defaultField[key] === "boolean")
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

      <div style={{ borderTop: "1px solid lightgray", width: "100%" }}>
        <p className="other_title">Filter Options</p>
        <div style={{ display: "flex", gap: "30px" }}>
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
      </div>

      <div style={{ borderTop: "1px solid lightgray", width: "100%" }}>
        <p className="other_title">Summary</p>
        <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
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
            {["SummaryTitle", "SummaryUnit", "Decimal", "IconName"].map(
              (field) =>
                field === "IconName" ? (
                  <div
                    key={field}
                    style={{
                      width: "47.5%",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    <TextField
                      name={field}
                      variant="outlined"
                      label={field}
                      value={formData[field] || ""}
                      onChange={handleInputChange}
                      className="customize_colum_input"
                      style={{ flex: 1 }}
                    />
                    <Tooltip
                      slotProps={{
                        tooltip: {
                          sx: {
                            bgcolor: "rgb(220 220 220 / 92%)",
                          },
                        },
                      }}
                      title={
                        <div
                          style={{
                            maxWidth: 250,
                            color: "black",
                          }}
                        >
                          Enter the icon name (e.g., <b>CirclePlus</b>,{" "}
                          <b>FaBeer</b>, <b>MdHome</b>).
                          <br />
                          <br />
                          Browse icons here:
                          <ul style={{ paddingLeft: 16, margin: "4px 0" }}>
                            <li>
                              <a
                                href="https://lucide.dev/icons/"
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                Lucide Icons
                              </a>
                            </li>
                            <li>
                              <a
                                href="https://react-icons.github.io/react-icons/"
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                React Icons
                              </a>
                            </li>
                          </ul>
                        </div>
                      }
                      arrow
                      placement="top"
                    >
                      <InfoOutlinedIcon
                        color="action"
                        style={{ cursor: "pointer" }}
                      />
                    </Tooltip>
                  </div>
                ) : (
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
                )
            )}
          </div>
        </div>
      </div>

      <div style={{ borderTop: "1px solid lightgray", width: "100%" }}>
        <p className="other_title">Navigation Option</p>
        <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          <div style={{ display: "flex", gap: "30px" }}>
            {Object.keys(defaultFieldNavigate)
              .filter((key) => typeof defaultFieldNavigate[key] === "boolean")
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
            {["OnHrefNavigate"].map((field) => (
              <TextField
                key={field}
                name={field}
                variant="outlined"
                label="Navigation Link"
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
