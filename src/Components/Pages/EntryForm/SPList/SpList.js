// http://localhost:3000/?pid=18332

import React, { useEffect, useState } from "react";
import "./SpList.scss";
import { CirclePlus } from "lucide-react";
import { Button, IconButton } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { CallApi } from "../../../../API/CallApi/CallApi";
import LoadingBackdrop from "../../../../Utils/LoadingBackdrop";

const SpList = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [spList, setSpList] = useState([]);

  const getSpData = async () => {
    setLoading(true);
    const body = {
      con: '{"id": "", "mode": "getSpList", "appuserid": "testuser"}',
      p: "{}",
      f: "DynamicReport ( get sp list )",
    };
    const response = await CallApi(body);
    setLoading(false);
    if (response?.rd) {
      setSpList(response?.rd);
    }
  };

  useEffect(() => {
    getSpData();
  }, []);

  return (
    <div className="SP_list_main">
      <LoadingBackdrop isLoading={loading} />

      <div className="spList_header">
        <p className="spList_title">SP List</p>
        {/* <IconButton onClick={() => navigate("/AddSpColum")}>
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
                  onClick={() => navigate("/AddSpColum")}
                >
                  <CirclePlus style={{ color: "rgb(86, 74, 252)" }} />
                  <p>ADD SP</p>
                </Button>
                <div className="Sp_list_flexView">
                  {spList?.map((sp) => (
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
                            navigate("/ShowColumnList", { state: sp });
                          }}
                          className="Btn_EditSp"
                        >
                          Customize
                        </Button>

                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() =>
                            navigate("/AddSpColum", { state: { sp } })
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

export default SpList;
