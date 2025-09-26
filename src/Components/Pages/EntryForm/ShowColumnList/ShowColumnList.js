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
} from "@mui/material";
import { ArrowLeftFromLine, CheckCircle } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import CustomizeColum from "../CustomizeColum/CustomizeColum";
import CustomizeMaster from "../CustomizeMaster/CustomizeMaster";
import { CallApi } from "../../../../API/CallApi/CallApi";

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="right" ref={ref} {...props} timeout={500} />;
});

const ShowColumnList = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [spData, setSpData] = useState(null);
  const [selectedCols, setSelectedCols] = useState(["Master Setting"]);
  const [editorOpen, setEditorOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(null);
  const [customizedStatus, setCustomizedStatus] = useState({});
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarError, setSnackbarError] = useState(false);
  const [largestLength, setLargestLength] = useState("");
  const [largeDataColum, setLargeDataColum] = useState();

  useEffect(() => {
    const getLargeColumData = async () => {
      const body = {
        con: JSON.stringify({ mode: "getLargeDataColumns" }),
        p: JSON.stringify({ ReportId: location.state.ReportId }),
        f: "DynamicReport (get Largedata data)",
      };
      try {
        const response = await CallApi(body);
        if (response?.rd) {
          setLargeDataColum(response?.rd);
        }
      } catch (err) {
        console.error("Failed fetching report settings", err);
      }
    };

    const fetchData = async () => {
      if (!location.state?.ReportId) return;
      const body = {
        con: JSON.stringify({ mode: "getReportAndColumnSettings" }),
        p: JSON.stringify({ ReportId: location.state.ReportId }),
        f: "DynamicReport (get colum data)",
      };
      try {
        const response = await CallApi(body);
        if (response?.rd && response.rd.length > 0) {
          setSpData({
            ...response.rd[0],
            master: response?.rd2,
            result: response.rd1 || [],
          });
        }
        if (response?.rd1 && response.rd1.length > 0) {
          setSpData((prev) => ({ ...prev, result: response.rd1 }));

          const visibleCols = response.rd1.filter((c) => c.IsVisible === true);

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
          setSelectedCols(initialSelected);
          let statusMap = { "Master Setting": false };
          visibleCols.forEach((c) => {
            statusMap[c.HeaderName] = true;
          });
          setCustomizedStatus(statusMap);
        }
      } catch (err) {
        console.error("Failed fetching report settings", err);
      }
    };

    fetchData();
    getLargeColumData();
  }, [location.state?.ReportId]);

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
      await CallApi(visibilityBody);
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
      setSnackbarOpen(true);
      setTimeout(() => {
        navigate("/");
      }, 1500);
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
    setActiveItem(null);
  };

  const fieldErrors = selectedCols?.filter((col) => !customizedStatus[col]);
  return (
    <div>
      <div className="colum_customize_main">
        <div className="spList_header">
          <Typography variant="h6" className="spList_title">
            {spData?.ReportName}
            {/* <Typography variant="subtitle1" className="sp_subtitle">
              {spData?.spDescription}
            </Typography> */}
          </Typography>
          <IconButton onClick={() => navigate("/")}>
            <ArrowLeftFromLine style={{ color: "white" }} />
          </IconButton>
        </div>
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

                  {spData?.result.map((col) => {
                    const label = col.HeaderName;
                    const isChecked = selectedCols?.includes(label);
                    return (
                      <div key={col.ColId} className="column_row">
                        <Checkbox
                          checked={isChecked}
                          onChange={() => handleCheckboxChange(label)}
                        />
                        <Typography className="column_label">
                          {col.HeaderName}
                        </Typography>

                        {isChecked && (
                          <>
                            <Button
                              variant="outlined"
                              size="small"
                              onClick={() => openColCustomize(col)}
                              style={{
                                marginLeft: "auto",
                                color: "rgb(86, 74, 252)",
                                borderColor: "rgb(86, 74, 252)",
                              }}
                              className="Btn_Customize"
                            >
                              Customize
                            </Button>
                            {/* {customizedStatus[label] && (
                          <CheckCircle
                            style={{
                              color: "green",
                              marginLeft: "8px",
                              fontSize: "20px",
                            }}
                          />
                        )} */}
                          </>
                        )}
                      </div>
                    );
                  })}
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
            <div className="LargeData_Report">
              <div style={{ display: "flex", alignItems: "center" }}>
                <Checkbox
                  checked={selectedCols.includes("Largest Data Report")}
                  onChange={() => handleCheckboxChange("Largest Data Report")}
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
                                  ? { ...c, IsLargeDataGroup: e.target.checked }
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
            </div>
          </div>
        </div>

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

        <Drawer
          anchor="left"
          open={editorOpen}
          onClose={closeEditor}
          keepMounted
          TransitionComponent={Transition} // <-- use custom Slide transition
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
      </div>
    </div>
  );
};

export default ShowColumnList;
