import { RecoilRoot } from "recoil";
import "./App.css";
import GridMain from "./GridMain";
import { BrowserRouter, useSearchParams } from "react-router-dom";
import { DeviceStatusProvider } from "./DeviceStatusContext";
import { ToastContainer } from "./Utils/Tostify/ToastManager";

function AppWrapper() {
  
  function getBaseName() {
    const path = window.location.pathname;
    const match = path.match(/^\/([^/]+\/[^/]+)/);
    return match ? `/${match[1]}` : "/";
  }

  return (
    <RecoilRoot>
      <DeviceStatusProvider>
        <BrowserRouter basename={getBaseName()}>
          <App />
        </BrowserRouter>
      </DeviceStatusProvider>
    </RecoilRoot>
  );
}

function App() {
  return (
    <>
      <ToastContainer />
      <GridMain />
    </>
  );
}

export default AppWrapper;

// "homepage": "/dynamicreport",
// basename="/dynamicreport"

// basename="/dynamicreportform"
// "homepage": "/dynamicreportform",

// import React from "react";
// import { BrowserRouter, Route, Routes } from "react-router-dom";
// import SpList from "./Components/Pages/SPList/SpList";
// import AddSpColum from "./Components/Pages/AddSpColum/AddSpColum";
// import CustomizeColum from "./Components/Pages/CustomizeColum/CustomizeColum";
// import ShowColumnList from "./Components/Pages/ShowColumnList/ShowColumnList";
// import NewFirstSample from "./Components/Pages/NewSampleReport/NewFirstSample";

// const App = () => {
//   return (
//     <BrowserRouter basename="/dynamicreportform">
//       <Routes>
//         <Route path="/" element={<SpList />} />
//         <Route path="/AddSpColum" element={<AddSpColum />} />
//         <Route path="/ShowColumnList" element={<ShowColumnList />} />
//         <Route path="/CustomizeColum" element={<CustomizeColum />} />
//         <Route path="/NewFirstSample/:id" element={<NewFirstSample />} />
//       </Routes>
//     </BrowserRouter>
//   );
// };

// export default App;

// "homepage": "dynamicreportform",
