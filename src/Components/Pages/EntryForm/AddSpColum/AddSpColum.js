import React, { useEffect, useState } from "react";
import "./AddSpColum.scss";
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Grid,
  Typography,
  IconButton,
  Snackbar,
  Alert,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeftFromLine, CirclePlus, Trash2 } from "lucide-react";
import { CallApi } from "../../../../API/CallApi/CallApi";
import LoadingBackdrop from "../../../../Utils/LoadingBackdrop";

const AddSpColum = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const existingSp = location.state?.sp;
  const [errors, setErrors] = useState([]);
  const [formErrors, setFormErrors] = useState({
    ReportName: false,
    spName: false,
    spDescription: false,
    appName: false,
    menuName: false,
  });
  const [reportName, setReportName] = useState(existingSp?.ReportName || "");
  const [spName, setSpName] = useState(existingSp?.SpNameR || "");
  const [masterOptions, setMasterOptions] = useState([]);
  const [spDescription, setSpDescription] = useState(
    existingSp?.ReportDescription || ""
  );

  const [columns, setColumns] = useState(
    existingSp?.result || [
      {
        FieldName: "",
        HeaderName: "",
        regex: "",
        ColumnType: "",
        master: "",
      },
    ]
  );

  console.log("columnscolumns", columns);

  useEffect(() => {
    const fetchMasterOptions = async () => {
      setLoading(true);
      const body = {
        con: JSON.stringify({ id: "", mode: "getMasterTableList" }),
        p: "{}",
        f: "DynamicReport ( get sp list )",
      };

      try {
        const response = await CallApi(body);
        if (response?.rd && Array.isArray(response.rd)) {
          setMasterOptions(response.rd);
          setLoading(false);
        }
      } catch (error) {
        console.error("Failed to fetch master options:", error);
      }
    };

    fetchMasterOptions();
  }, []);

  useEffect(() => {
    if (!existingSp?.ReportId || masterOptions.length === 0) return;
    const getEditColumData = async () => {
      const body = {
        con: JSON.stringify({ mode: "getReportAndColumnSettings" }),
        p: JSON.stringify({
          ReportId: existingSp?.ReportId || 0,
        }),
        f: "DynamicReport ( get colum data )",
      };
      try {
        const response = await CallApi(body);
        setLoading(false);
        if (response?.rd && response?.rd.length > 0) {
          setReportName(response.rd[0].ReportName || "");
          setSpName(response.rd[0].SpNameR || "");
          setSpDescription(response.rd[0].ReportDescription || "");
        }
        if (response?.rd1 && response.rd1.length > 0) {
          const mappedCols = response.rd1.map((col) => {
            const match = masterOptions.find((opt) => opt.Id == col.MasterId);
            return {
              ...col,
              master: match ? match.Id : "",
            };
          });
          setColumns(mappedCols);
        }
      } catch (error) {
        console.error("getEditColumData failed:", error);
      }
    };
    getEditColumData();
  }, [existingSp?.ReportId, masterOptions]);

  const [openSnackbar, setOpenSnackbar] = useState(false);

  const handleAddColumn = () => {
    setColumns([
      ...columns,
      {
        FieldName: "",
        HeaderName: "",
        regex: "",
        ColumnType: "",
        master: "",
      },
    ]);
    setErrors([...errors, { FieldName: false, HeaderName: false }]);
  };

  const handleColumnChange = (index, field, value) => {
    const updatedColumns = [...columns];
    if (!updatedColumns[index]) {
      updatedColumns[index] = {
        FieldName: "",
        HeaderName: "",
        regex: "",
        ColumnType: "",
        master: "",
      };
    }
    updatedColumns[index][field] = value;
    setColumns(updatedColumns);

    const updatedErrors = [...errors];
    if (!updatedErrors[index]) {
      updatedErrors[index] = {};
    }
    if (
      (field === "FieldName" || field === "HeaderName") &&
      value.trim() !== ""
    ) {
      updatedErrors[index][field] = false;
      setErrors(updatedErrors);
    }
  };

  const handleSave = async () => {
    const spErrors = {
      ReportName: reportName.trim() === "",
      spName: spName.trim() === "",
      spDescription: spDescription.trim() === "",
    };
    setFormErrors(spErrors);
    if (spErrors.spName || spErrors.spDescription || spErrors.ReportName) {
      return;
    }

    const validationResults = columns.map((col) => ({
      FieldName: col.FieldName.trim() === "",
      HeaderName: col.HeaderName.trim() === "",
    }));
    setErrors(validationResults);
    const hasErrors = validationResults.some(
      (err) => err.FieldName || err.HeaderName
    );
    if (hasErrors) {
      return;
    }

    const result = columns.map((col, index) => ({
      ...col,
      FieldName: col.FieldName,
      HeaderName: col.HeaderName,
      Regex: col.regex,
      ColumnType: col.ColumnType,
      MasterId: col.master,
      Width: col.width || "",
      IsFilterable: 1,
      IsVisible: 1,
    }));

    const body = {
      con: JSON.stringify({ mode: "saveReportAndColumns" }),
      p: JSON.stringify({
        ReportId: existingSp?.ReportId || 0, // FIXED
        ReportName: reportName,
        SpNameR: spName,
        ReportDescription: spDescription,
        Columns: result,
      }),
      f: "DynamicReport ( saveReportAndColumns )",
    };

    try {
      const response = await CallApi(body);
      if (!existingSp) {
        setReportName("");
        setSpName("");
        setSpDescription("");
        setColumns([
          {
            FieldName: "",
            HeaderName: "",
            regex: "",
            ColumnType: "",
            master: "",
          },
        ]);
        setErrors([]);
        setFormErrors({
          ReportName: false,
          spName: false,
          spDescription: false,
          appName: false,
          menuName: false,
        });
      }

      setOpenSnackbar(true);
      setTimeout(() => {
        navigate("/");
      }, 1200);
    } catch (error) {
      console.error("Save API failed:", error);
    }
  };

  const handleRemoveColumn = (index) => {
    const updatedCols = [...columns];
    updatedCols.splice(index, 1);
    setColumns(updatedCols);

    const updatedErrors = [...errors];
    updatedErrors.splice(index, 1);
    setErrors(updatedErrors);
  };

  return (
    <div className="add_sp_columdata">
      <LoadingBackdrop isLoading={loading} />
      <div className="spList_header">
        <Typography variant="h6" className="spList_title">
          Enter SP Details
        </Typography>
        <IconButton onClick={() => navigate("/")}>
          <ArrowLeftFromLine style={{ color: "white" }} />
        </IconButton>
      </div>

      <Grid container spacing={2} sx={{ m: 3 }}>
        <Grid item xs={12} md={6}>
          <TextField
            label="Report Name"
            value={reportName}
            onChange={(e) => setReportName(e.target.value)}
            fullWidth
            size="small"
            error={formErrors.ReportName}
            helperText={formErrors.ReportName ? "Report Name is required" : ""}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            label="Sp Name"
            value={spName}
            onChange={(e) => setSpName(e.target.value)}
            fullWidth
            size="small"
            error={formErrors.spName}
            helperText={formErrors.spName ? "Sp Name is required" : ""}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            label="SP Description"
            value={spDescription}
            onChange={(e) => setSpDescription(e.target.value)}
            fullWidth
            size="small"
            error={formErrors.spDescription}
            helperText={
              formErrors.spDescription ? "SP Description is required" : ""
            }
          />
        </Grid>
        {/* <Grid item xs={12} md={6} style={{ width: "200px" }}>
          <FormControl fullWidth size="small" error={formErrors.appName}>
            <InputLabel>App Name</InputLabel>
            <Select
              value={appName}
              onChange={(e) => setAppName(e.target.value)}
              label="App Name"
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              <MenuItem value="ACCOUNT">ACCOUNT</MenuItem>
              <MenuItem value="BOOKS_KEEPING">BOOKS_KEEPING</MenuItem>
              <MenuItem value="AC_MFGpp2">C_MFG</MenuItem>
              <MenuItem value="DIAMONDSTORE">DIAMONDSTORE</MenuItem>
              <MenuItem value="ECATALOG_BACKOFFICE">
                ECATALOG_BACKOFFICE
              </MenuItem>
              <MenuItem value="ITASK">ITASK</MenuItem>
            </Select>
            {formErrors.appName && (
              <Typography color="error" variant="caption">
                App Name is required
              </Typography>
            )}
          </FormControl>
        </Grid>
        <Grid item xs={12} md={6} style={{ width: "200px" }}>
          <FormControl fullWidth size="small" error={formErrors.menuName}>
            <InputLabel>Menu Name</InputLabel>
            <Select
              value={menuName}
              onChange={(e) => setMenuName(e.target.value)}
              label="Menu Name"
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              <MenuItem value="Menu1">CASTING</MenuItem>
              <MenuItem value="Menu2">CONVERSION</MenuItem>
              <MenuItem value="Menu3">DEPT WISE REPORT</MenuItem>
              <MenuItem value="Menu4">ENGAGE MATERIAL</MenuItem>
              <MenuItem value="Menu5">INCOMPLETE RETURN</MenuItem>
              <MenuItem value="Menu6">JOBS REPORT</MenuItem>
            </Select>
            {formErrors.menuName && (
              <Typography color="error" variant="caption">
                Menu Name is required
              </Typography>
            )}
          </FormControl>
        </Grid> */}
      </Grid>

      <p
        style={{
          fontSize: "20px",
          fontWeight: 600,
          margin: "5px 0px 15px 20px ",
        }}
      >
        Add Columns
      </p>

      <div className="allColum_Data_main">
        {columns.map((col, index) => (
          <Grid container spacing={2} key={index} sx={{ mb: 1 }}>
            <Grid item xs={12} sm={4} md={2}>
              <TextField
                label="Field Name"
                value={col.FieldName}
                onChange={(e) =>
                  handleColumnChange(index, "FieldName", e.target.value)
                }
                fullWidth
                size="small"
                error={errors[index]?.FieldName}
                helperText={
                  errors[index]?.FieldName ? "Field Name is required" : ""
                }
              />
            </Grid>
            <Grid item xs={12} sm={4} md={2}>
              <TextField
                label="Header Name"
                value={col.HeaderName}
                onChange={(e) =>
                  handleColumnChange(index, "HeaderName", e.target.value)
                }
                fullWidth
                size="small"
                error={errors[index]?.HeaderName}
                helperText={
                  errors[index]?.HeaderName ? "Header Name is required" : ""
                }
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <TextField
                label="Regex"
                value={col.regex}
                onChange={(e) =>
                  handleColumnChange(index, "regex", e.target.value)
                }
                fullWidth
                size="small"
              />
            </Grid>
            <Grid item xs={6} sm={3} md={2}>
              <FormControl fullWidth size="small" style={{ width: "200px" }}>
                <InputLabel>Select Type</InputLabel>
                <Select
                  value={col.ColumnType}
                  label="Select Type"
                  onChange={(e) =>
                    handleColumnChange(index, "ColumnType", e.target.value)
                  }
                >
                  <MenuItem value="String">String</MenuItem>
                  <MenuItem value="Number">Number</MenuItem>
                  <MenuItem value="Date">Date</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6} sm={3} md={2}>
              <FormControl fullWidth size="small" style={{ width: "200px" }}>
                <InputLabel>Select Master</InputLabel>
                <Select
                  value={col.master}
                  label="Select Master"
                  onChange={(e) =>
                    handleColumnChange(index, "master", e.target.value)
                  }
                >
                  <MenuItem value="">
                    <em>Select Option</em>
                  </MenuItem>
                  {masterOptions?.map((opt) => (
                    <MenuItem key={opt.Id} value={opt.Id}>
                      {opt.DisplayName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            {columns.length > 1 && (
              <Grid>
                <Button onClick={() => handleRemoveColumn(index)}>
                  <Trash2 style={{ color: "#ef5252" }} />
                </Button>
              </Grid>
            )}
          </Grid>
        ))}
      </div>
      <div style={{ marginTop: "15px" }}>
        <Button
          variant="outlined"
          startIcon={<CirclePlus style={{ color: "rgb(86, 74, 252)" }} />}
          onClick={handleAddColumn}
          sx={{ ml: 2 }}
          style={{ color: "rgb(86, 74, 252)", borderColor: "rgb(86, 74, 252)" }}
        >
          Add Column
        </Button>
      </div>

      <div style={{ display: "flex", justifyContent: "center" }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSave}
          style={{ backgroundColor: "rgb(86, 74, 252)", color: "white" }}
          className="Btn_saveAll"
        >
          Save All
        </Button>
      </div>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity="success" onClose={() => setOpenSnackbar(false)}>
          Data saved successfully!
        </Alert>
      </Snackbar>
      {/* <div>
        <p>
          "1": "jobpromisedate", "2": "orderdate", "3": "location", "4":
          "company", "5": "department", "6": "user_sirname", "7": "user_name",
          "8": "status", "9": "useJob", "10": "diamondWt", "11": "issue_weight",
          "12": "netwet", "13": "amount", "14": "hiddenColum"
        </p>
      </div> */}
    </div>
  );
};

export default AddSpColum;
