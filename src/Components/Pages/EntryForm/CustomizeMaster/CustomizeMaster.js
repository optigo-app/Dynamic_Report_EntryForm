import React, { useState, useEffect } from "react";
import { Button, Checkbox } from "@mui/material";
import "./CustomizeMaster.scss";
import { CallApi } from "../../../../API/CallApi/CallApi";

const CustomizeMaster = ({ initialData, spId, onClose }) => {
  const [masterSettings, setMasterSettings] = useState({});
  useEffect(() => {
    const saved = sessionStorage.getItem("masterSetting");
    if (saved) {
      setMasterSettings(JSON.parse(saved));
    } else if (initialData[0]) {
      setMasterSettings({ ...initialData[0] });
    }
  }, [initialData, spId]);

  const handleCheckboxChange = (key) => {
    setMasterSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSave = async () => {
    const payload = {
      con: JSON.stringify({ mode: "updateReportMasterSettings" }),
      p: JSON.stringify({
        ReportId: spId,
        ...Object.keys(masterSettings).reduce((acc, key) => {
          acc[key] = masterSettings[key] ? 1 : 0;
          return acc;
        }, {}),
      }),
      f: "DynamicReport ( Update report master setting )",
    };

    try {
      const res = await CallApi(payload);
      sessionStorage.setItem("masterSetting", JSON.stringify(masterSettings));
      if (onClose) onClose();
    } catch (err) {
      console.error("❌ Failed saving master settings", err);
      alert("Failed to save master settings");
    }
  };

  return (
    <div className="Customize_Master_Colum_main">
      <div className="left-form">
        <div style={{ display: "flex", flexDirection: "column" }}>
          {Object.keys(masterSettings).map((key) => (
            <label
              key={key}
              style={{
                width: "fit-content",
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
                marginBottom: "4px",
              }}
            >
              <span className="chekbox_title_value">{key}</span>
              <Checkbox
                checked={Boolean(masterSettings[key])}
                onChange={() => handleCheckboxChange(key)}
                style={{ margin: "0px", padding: "0px" }}
              />
            </label>
          ))}
        </div>

        <div className="button-group" style={{ marginTop: "16px" }}>
          <Button
            onClick={onClose}
            className="Btn_CustomizeMaster_Model_Cancel"
          >
            Cancel
          </Button>
          <Button onClick={handleSave} className="Btn_Customize_Model_Save">
            Save
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CustomizeMaster;
