// http://localhost:3000/?CN=UkRTRF8yMDI1MTAwNzA0MDgyNF9kZGFmNzIwOGQ4MzY0ODE0YmZiNDE3MDkyNzg0YTdiMQ==&pid=18333

import React, { useState, useEffect } from "react";
import { Route, Routes, useSearchParams } from "react-router-dom";
import { Box, CircularProgress, Paper, Typography } from "@mui/material";
import Cookies from "js-cookie";
import { AlertTriangle } from "lucide-react";
import { CallApi } from "./API/CallApi/CallApi";
import SpList from "./Components/Pages/AddSpList/SPList/SpList";
import AddSpColum from "./Components/Pages/AddSpList/AddSpColum/AddSpColum";
import CustomizeColum from "./Components/Pages/EntryForm/CustomizeColum/CustomizeColum";
import ShowColumnList from "./Components/Pages/EntryForm/ShowColumnList/ShowColumnList";
import { readAndDecodeCookie } from "./Utils/globalFunc";
import ReportList from "./Components/Pages/EntryForm/ReportList/ReportList";
import AddReport from "./Components/Pages/EntryForm/AddReport/AddReport";

const GridMain = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [tokenMissing, setTokenMissing] = useState(false);
  const [searchParams] = useSearchParams();
  const pid = searchParams.get("pid");
  const CN = searchParams.get("CN");

  // useEffect(() => {
  //   Cookies.set(
  //     "RDSD_20251007040824_ddaf7208d8364814bfb417092784a7b1",
  //     "%7b%22tkn%22%3a%22OTA2NTQ3MTcwMDUzNTY1MQ%3d%3d%22%2c%22pid%22%3a18333%2c%22IsEmpLogin%22%3a0%2c%22IsPower%22%3a0%2c%22SpNo%22%3a%22MA%3d%3d%22%2c%22SpVer%22%3a%22%22%2c%22SV%22%3a%22MA%3d%3d%22%2c%22LId%22%3a%22MTg1Mzg%3d%22%2c%22LUId%22%3a%22amVuaXNAZWcuY29t%22%2c%22DAU%22%3a%22aHR0cDovL256ZW4vam8vYXBpLWxpYi9BcHAvQ2VudHJhbEFwaQ%3d%3d%22%2c%22YearCode%22%3a%22e3tuemVufX17ezIwfX17e29yYWlsMjV9fXt7b3JhaWwyNX19%22%2c%22cuVer%22%3a%22UjUwQjM%3d%22%2c%22rptapiurl%22%3a%22aHR0cDovL25ld25leHRqcy53ZWIvYXBpL3JlcG9ydA%3d%3d%22%7d"
  //   );
  // }, []);

  const decodeBase64 = (str) => {
    if (!str) return null;
    try {
      return atob(str);
    } catch (e) {
      console.error("Error decoding base64:", e);
      return null;
    }
  };

  const initializeAndFetchReport = async () => {
    if (!CN) {
      console.error("CN parameter missing in URL");
      setTokenMissing(true);
      setIsLoading(false);
      return;
    }

    try {
      const decodedCN = decodeBase64(CN);
      console.log("decodedCN", decodedCN);
      const cookieData = await readAndDecodeCookie(decodedCN);
      if (!cookieData) {
        console.error("Cookie not found or invalid.");
        setTokenMissing(true);
        setIsLoading(false);
        return;
      }

      sessionStorage.setItem("reportVarible", JSON.stringify(cookieData));
      if (pid) {
        const body = {
          con: JSON.stringify({ mode: "getPageId" }),
          p: JSON.stringify({ PageId: pid }),
          f: "DynamicReport (get column data)",
        };
        const response = await CallApi(body);
        if (response?.Status === "400") {
          setTokenMissing(true);
          return;
        }
        const data = response?.rd?.[0];
        if (data?.stat === 1) {
          const reportId = data.ReportId;
          const key = `${pid}_${reportId}`;
          sessionStorage.setItem(key, reportId);
        }
      }
    } catch (err) {
      console.error("Failed to initialize or fetch report:", err);
      setTokenMissing(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    initializeAndFetchReport();
  }, [pid, CN]);

  const renderComponent = () => {
    if (pid === "18363") {
      return (
        <>
          <Route path="/" element={<SpList />} />.
          <Route path="/AddSpColum" element={<AddSpColum />} />
        </>
      );
    } else {
      return (
        <>
          <Route path="/" element={<ReportList />} />
          <Route path="/AddReport" element={<AddReport />} />
          <Route path="/ShowColumnList" element={<ShowColumnList />} />
          <Route path="/CustomizeColum" element={<CustomizeColum />} />
        </>
      );
    }
  };

  if (tokenMissing) {
    return (
      <Box display="flex" justifyContent="center" minHeight="70vh" p={2}>
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
    );
  }

  if (isLoading) {
    return (
      <Box textAlign="center" mt="20%">
        <CircularProgress />
      </Box>
    );
  }

  return <Routes>{renderComponent()}</Routes>;
};

export default GridMain;




// // http://localhost:3000/?CN=UkRTRF8yMDI1MTAwNzA0MDgyNF9kZGFmNzIwOGQ4MzY0ODE0YmZiNDE3MDkyNzg0YTdiMQ==&pid=18333

// import React, { useState, useEffect } from "react";
// import { Route, Routes, useSearchParams } from "react-router-dom";
// import { Box, CircularProgress, Paper, Typography } from "@mui/material";
// import Cookies from "js-cookie";
// import { AlertTriangle } from "lucide-react";
// import { CallApi } from "./API/CallApi/CallApi";
// import SpList from "./Components/Pages/AddSpList/SPList/SpList";
// import AddSpColum from "./Components/Pages/AddSpList/AddSpColum/AddSpColum";
// import CustomizeColum from "./Components/Pages/EntryForm/CustomizeColum/CustomizeColum";
// import ShowColumnList from "./Components/Pages/EntryForm/ShowColumnList/ShowColumnList";
// import { readAndDecodeCookie } from "./Utils/globalFunc";
// import ReportList from "./Components/Pages/EntryForm/ReportList/ReportList";
// import AddReport from "./Components/Pages/EntryForm/AddReport/AddReport";

// const GridMain = () => {
//   const [isLoading, setIsLoading] = useState(true);
//   const [tokenMissing, setTokenMissing] = useState(false);
//   const [searchParams] = useSearchParams();
//   const pid = searchParams.get("pid");
//   const CN = searchParams.get("CN");

//   // useEffect(() => {
//   //   Cookies.set(
//   //     "RDSD_20251007040824_ddaf7208d8364814bfb417092784a7b1",
//   //     "%7b%22tkn%22%3a%22OTA2NTQ3MTcwMDUzNTY1MQ%3d%3d%22%2c%22pid%22%3a18333%2c%22IsEmpLogin%22%3a0%2c%22IsPower%22%3a0%2c%22SpNo%22%3a%22MA%3d%3d%22%2c%22SpVer%22%3a%22%22%2c%22SV%22%3a%22MA%3d%3d%22%2c%22LId%22%3a%22MTg1Mzg%3d%22%2c%22LUId%22%3a%22amVuaXNAZWcuY29t%22%2c%22DAU%22%3a%22aHR0cDovL256ZW4vam8vYXBpLWxpYi9BcHAvQ2VudHJhbEFwaQ%3d%3d%22%2c%22YearCode%22%3a%22e3tuemVufX17ezIwfX17e29yYWlsMjV9fXt7b3JhaWwyNX19%22%2c%22cuVer%22%3a%22UjUwQjM%3d%22%2c%22rptapiurl%22%3a%22aHR0cDovL25ld25leHRqcy53ZWIvYXBpL3JlcG9ydA%3d%3d%22%7d"
//   //   );
//   // }, []);

//   const decodeBase64 = (str) => {
//     if (!str) return null;
//     try {
//       return atob(str);
//     } catch (e) {
//       console.error("Error decoding base64:", e);
//       return null;
//     }
//   };

//   const initializeAndFetchReport = async () => {
//     if (!CN) {
//       console.error("CN parameter missing in URL");
//       setTokenMissing(true);
//       setIsLoading(false);
//       return;
//     }

//     try {
//       const decodedCN = decodeBase64(CN);
//       console.log("decodedCN", decodedCN);
//       const cookieData = await readAndDecodeCookie(decodedCN);
//       if (!cookieData) {
//         console.error("Cookie not found or invalid.");
//         setTokenMissing(true);
//         setIsLoading(false);
//         return;
//       }

//       sessionStorage.setItem("reportVarible", JSON.stringify(cookieData));
//       if (pid) {
//         const body = {
//           con: JSON.stringify({ mode: "getPageId" }),
//           p: JSON.stringify({ PageId: pid }),
//           f: "DynamicReport (get column data)",
//         };
//         const response = await CallApi(body);
//         if (response?.Status === "400") {
//           setTokenMissing(true);
//           return;
//         }
//         const data = response?.rd?.[0];
//         if (data?.stat === 1) {
//           const reportId = data.ReportId;
//           const key = `${pid}_${reportId}`;
//           sessionStorage.setItem(key, reportId);
//         }
//       }
//     } catch (err) {
//       console.error("Failed to initialize or fetch report:", err);
//       setTokenMissing(true);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     initializeAndFetchReport();
//   }, [pid, CN]);

//   const renderComponent = () => {
//     return (
//       <>
//         <Route path="/" element={<SpList />} />
//         <Route path="/AddSpColum" element={<AddSpColum />} />
//         <Route path="/ShowColumnList" element={<ShowColumnList />} />
//         <Route path="/CustomizeColum" element={<CustomizeColum />} />
//       </>
//     );
//   };

//   if (tokenMissing) {
//     return (
//       <Box display="flex" justifyContent="center" minHeight="70vh" p={2}>
//         <Paper
//           elevation={3}
//           sx={{
//             maxWidth: 500,
//             width: "100%",
//             p: 4,
//             borderRadius: "20px",
//             textAlign: "center",
//             boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
//           }}
//         >
//           <Box
//             display="flex"
//             justifyContent="center"
//             alignItems="center"
//             mb={2}
//           >
//             <AlertTriangle size={48} color="#f44336" />
//           </Box>
//           <Typography variant="h5" fontWeight={600} gutterBottom>
//             You've been logged out
//           </Typography>
//           <Typography variant="body1" color="text.secondary" mb={3}>
//             Your session has ended. Please log in again to continue.
//           </Typography>
//         </Paper>
//       </Box>
//     );
//   }

//   if (isLoading) {
//     return (
//       <Box textAlign="center" mt="20%">
//         <CircularProgress />
//       </Box>
//     );
//   }

//   return <Routes>{renderComponent()}</Routes>;
// };

// export default GridMain;
