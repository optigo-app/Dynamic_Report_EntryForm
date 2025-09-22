import React, { useState, useEffect } from "react";
import { Route, Routes, useSearchParams } from "react-router-dom";
import { Box, CircularProgress, Paper, Typography } from "@mui/material";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { AlertTriangle } from "lucide-react";
import { CallApi } from "./API/CallApi/CallApi";
import SpList from "./Components/Pages/EntryForm/SPList/SpList";
import AddSpColum from "./Components/Pages/EntryForm/AddSpColum/AddSpColum";
import CustomizeColum from "./Components/Pages/EntryForm/CustomizeColum/CustomizeColum";
import ShowColumnList from "./Components/Pages/EntryForm/ShowColumnList/ShowColumnList";

// Test73  :-    http://nzen/testreport/?sv=/e3tsaXZlLm9wdGlnb2FwcHMuY29tfX17ezIwfX17e3Rlc3Q3M319e3t0ZXN0NzN9fQ==/1&ifid=WorkerReportPro&pid=18223
// http://localhost:3000/testreport/?sv=/e3tsaXZlLm9wdGlnb2FwcHMuY29tfX17ezIwfX17e3Rlc3Q3M319e3t0ZXN0NzN9fQ==/1&ifid=WorkerReportPro&pid=18223

const GridMain = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [tokenMissing, setTokenMissing] = useState(false); // NEW
  const [searchParams] = useSearchParams();
  const pid = searchParams.get("pid");
  const [reportId, setReportId] = useState(null);
  const [spNumber, setSpNumber] = useState(null);
  const [largeData, setLargeData] = useState(false);

  useEffect(() => {
    const getEditColumData = async () => {
      const body = {
        con: JSON.stringify({ mode: "getPageId" }),
        p: JSON.stringify({ PageId: pid }),
        f: "DynamicReport ( get colum data )",
      };

      try {
        const response = await CallApi(body);
        if (response?.Status === "400") {
          setTokenMissing(true);
          return;
        }
        if (response?.rd?.[0]?.stat === 1) {
          const reportId = response.rd[0].ReportId;
          const SpNumber = response.rd[0].SpNumber;
          const IsLargeDataReport = response.rd[0].IsLargeDataReport;
          setLargeData(!!IsLargeDataReport);
          const key = `${pid}_${reportId}`;
          sessionStorage.setItem(key, reportId);
          setReportId(reportId);
          setSpNumber(SpNumber);
        }
      } catch (error) {
        console.error("getEditColumData failed:", error);
        setTokenMissing(true); // also set error flag in catch
      }
    };

    getEditColumData();
  }, [pid]);

  const getQueryParams = () => {
    const token = Cookies.get("skey");
    const decoded = jwtDecode(token);

    const decodedPayload = {
      ...decoded,
      uid: decodeBase64(decoded.uid),
    };
    if (decodedPayload) {
      sessionStorage.setItem("AuthqueryParams", JSON.stringify(decodedPayload));
    }
    setIsLoading(false);
  };

  useEffect(() => {
    //      Cookies.set(
    //    "skey",
    //    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJpdGFzayIsImF1ZCI6ImFtVnVhWE5BWldjdVkyOXQiLCJleHAiOjE3NDU5MTEwNDcsInVpZCI6ImFtVnVhWE5BWldjdVkyOXQiLCJ5YyI6ImUzdHVlbVZ1ZlgxN2V6SXdmWDE3ZTI5eVlXbHNNalY5Zlh0N2IzSmhhV3d5TlgxOSIsInN2IjoiMCJ9.9n0tGL-CArkbq3sn0Bfh17xZC7sgubAOWaHDe7rl25w"
    //  );
    const interval = setInterval(() => {
      const token = Cookies.get("skey");
      if (!token) {
        setTokenMissing(true);
      }
    }, 500);
    const token = Cookies.get("skey");
    if (token) {
      getQueryParams();
    } else {
      console.warn("Token cookie not found initially");
      setTokenMissing(true);
      setIsLoading(false);
    }
    return () => clearInterval(interval);
  }, []);

  const decodeBase64 = (str) => {
    if (!str) return null;
    try {
      return atob(str);
    } catch (e) {
      console.error("Error decoding base64:", e);
      return null;
    }
  };

  const renderComponent = () => {
    return (
      <>
        <Route path="/" element={<SpList />} />
        <Route path="/AddSpColum" element={<AddSpColum />} />
        <Route path="/ShowColumnList" element={<ShowColumnList />} />
        <Route path="/CustomizeColum" element={<CustomizeColum />} />
      </>
    );
  };

  return (
    <div>
      {tokenMissing ? (
        <div
          style={{ display: "flex", width: "100%", justifyContent: "center" }}
        >
          <Box
            minHeight="70vh"
            display="flex"
            alignItems="center"
            justifyContent="center"
            p={2}
          >
            <Paper
              elevation={3}
              sx={{
                maxWidth: 500,
                width: "100%",
                p: 4,
                borderRadius: "20px",
                textAlign: "center",
                boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
              }}
            >
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                mb={2}
              >
                <AlertTriangle size={48} color="#f44336" />
              </Box>

              <Typography variant="h5" fontWeight={600} gutterBottom>
                You've been logged out
              </Typography>

              <Typography variant="body1" color="text.secondary" mb={3}>
                Your session has ended. Please log in again to continue.
              </Typography>
            </Paper>
          </Box>
        </div>
      ) : isLoading ? (
        <div style={{ textAlign: "center", marginTop: "20%" }}>
          <CircularProgress />
        </div>
      ) : (
        <Routes>{renderComponent()}</Routes>
      )}
    </div>
  );
};

export default GridMain;