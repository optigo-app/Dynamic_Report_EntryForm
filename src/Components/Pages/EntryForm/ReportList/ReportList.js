// http://localhost:3000/?pid=18332

import React, { useEffect, useState } from "react";
import "./ReportList.scss";
import { CirclePlus, Search, X } from "lucide-react";
import { Button, IconButton, InputAdornment, TextField } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { CallApi } from "../../../../API/CallApi/CallApi";
import LoadingBackdrop from "../../../../Utils/LoadingBackdrop";

const ReportList = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [spList, setSpList] = useState([]);
  const [search, setSearch] = useState("");
  const location = useLocation();

  const getSpData = async () => {
    setLoading(true);
    let AllData = JSON.parse(sessionStorage.getItem("reportVarible"));
    const body = {
      con: `{"id": "", "mode": "getSpList", "appuserid": "${AllData?.LUId}"}`,
      p: "{}",
      f: "DynamicReport ( get sp list )",
    };
    const response = await CallApi(body);
    setLoading(false);
    if (response?.rd) {
      const sortedData = response?.rd.sort((a, b) => b.ReportId - a.ReportId);
      setSpList(sortedData);
    }
  };

  useEffect(() => {
    getSpData();
  }, []);

  const filteredSpList = spList?.filter((sp) => {
    const query = search.toLowerCase();
    return (
      sp.ReportName?.toLowerCase().includes(query) ||
      sp.ReportDescription?.toLowerCase().includes(query)
    );
  });

  return (
    <div className="SP_list_main">
      <LoadingBackdrop isLoading={loading} />

      <div className="spList_header">
        <p className="spList_title">Report List</p>
        {/* <IconButton onClick={() => navigate("/AddReport")}>
          <CirclePlus style={{ color: "white" }} />
        </IconButton> */}
      </div>

      {!loading && (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <div
            className="sp_list_div_main"
            style={{ margin: "10px 0px", width: "1200px" }}
          >
            {spList?.length === 0 && !loading ? (
              <p style={{ textAlign: "center", color: "gray" }}>
                No SP Data found. Click + to add one.
              </p>
            ) : (
              <div style={{ width: "100%" }}>
                <Button
                  className="Sp_list_ADD_REPORT"
                  onClick={() => navigate(`/AddReport${location.search}`)}
                >
                  <CirclePlus style={{ color: "rgb(86, 74, 252)" }} />
                  <p>ADD REPORT</p>
                </Button>
                <div style={{ marginBottom: "10px" }}>
                  <TextField
                    type="text"
                    placeholder="Search..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Search size={18} color="#888" />
                        </InputAdornment>
                      ),
                      endAdornment: search ? (
                        <InputAdornment position="end">
                          <IconButton
                            edge="end"
                            size="small"
                            onClick={() => setSearch("")}
                            aria-label="clear"
                          >
                            <X size={18} color="#888" />
                          </IconButton>
                        </InputAdornment>
                      ) : null,
                    }}
                    sx={{
                      width: "350px",
                      "& .MuiInputBase-input": {
                        padding: "6px 8px !important",
                      },
                    }}
                    className="txt_commonSearch"
                  />
                </div>
                <div className="Sp_list_flexView">
                  {filteredSpList?.map((sp) => (
                    <div key={sp.id} className="Sp_list_singleView">
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "flex-start",
                        }}
                      >
                        <p className="sp_list_Title">{sp.ReportName}</p>
                        <p className="sp_list_Description">
                          {sp.ReportDescription}
                        </p>
                      </div>
                      <div style={{ display: "flex", gap: "10px" }}>
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => {
                            for (let i = 0; i < sessionStorage.length; i++) {
                              const key = sessionStorage.key(i);
                              if (key && key.startsWith("columnSettings")) {
                                sessionStorage.removeItem(key);
                                i--;
                              }
                            }
                            sessionStorage.removeItem("masterSetting");
                            navigate(`/ShowColumnList${location.search}`, {
                              state: sp,
                            });
                          }}
                          className="Btn_EditSp"
                        >
                          Customize
                        </Button>

                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() =>
                            navigate(`/AddReport${location.search}`, {
                              state: { sp },
                            })
                          }
                          className="Btn_AddColumn"
                        >
                          Add Column
                        </Button>
                        {sp?.rd && (
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/NewFirstSample/${sp.id}`);
                            }}
                            className="Btn_ShwoReport"
                          >
                            Show Report
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportList;
