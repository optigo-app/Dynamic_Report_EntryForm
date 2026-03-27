import { Button, Checkbox, Grid, TextField, Typography } from '@mui/material';
import React from 'react'

const SpliterReport = ({
    selectedCols,
    handleCheckboxChange,
    largestLength,
    handleDateOptionChange,
    setLargestLength,
    spliterMonthCont,
    setSpliterMonthCont,
    largeDataColum,
    spliterFirst,
    setLargeDataColum,
    handleSecondSelect,
    handleFirstSelect,
    spliterSecond,
    handleOpen,
    allDateOptionsShow,
    handleToggleFilterOption,
    allDateOptions,
    selectedDateOptions
}) => {
    return (
        <div className="showList_LargeMain">
            <div
                className={
                    selectedCols?.includes("Spliter Report")
                        ? "spliterReport_allView"
                        : "LargeData_Report"
                }
            >
                    <div>
                        <div style={{ display: "flex", alignItems: "center" }}>
                            <Checkbox
                                checked={selectedCols.includes("Spliter Report")}
                                onChange={() => handleCheckboxChange("Spliter Report")}
                            />
                            <Typography className="column_label">
                                Spliter Report
                            </Typography>
                            {selectedCols?.includes("Spliter Report") && (
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        type="number"
                                        label="Enter Month Restriction"
                                        fullWidth
                                        size="small"
                                        value={spliterMonthCont}
                                        onChange={(e) => setSpliterMonthCont(e.target.value)}
                                        style={{ margin: "0px 15px" }}
                                    />
                                </Grid>
                            )}
                        </div>
                        {selectedCols?.includes("Spliter Report") && (
                            <div style={{ display: "flex", alignItems: "center" }}>
                                <Checkbox
                                    checked={selectedCols.includes("SpliterReportAllDataButton")}
                                    onChange={() => handleCheckboxChange("SpliterReportAllDataButton")}
                                />
                                All Data Button
                            </div>
                        )}
                    </div>

                {selectedCols?.includes("Spliter Report") && (
                    <div>
                        <div className="spliter_optionshow">
                            <div>
                                <p
                                    style={{
                                        margin: "10px 0px 0px 13px",
                                        fontWeight: 600,
                                    }}
                                    className="descLine_showColum"
                                >
                                    Select For First Slide
                                </p>

                                <div
                                    className="column_row sub_row"
                                    style={{ display: "flex", alignItems: "center" }}
                                >
                                    <Checkbox
                                        checked={selectedCols.includes("SpliterFirstPanelAll")}
                                        onChange={() => handleCheckboxChange("SpliterFirstPanelAll")}
                                    />
                                    <Typography className="column_label">ALL</Typography>
                                </div>
                                <div className="largest_columns_group" style={{ height: '50vh' }}>
                                    {largeDataColum?.map((col) => (
                                        <div
                                            key={`ldr1-${col.ColId}`}
                                            className="column_row sub_row"
                                            style={{ display: "flex", alignItems: "center" }}
                                        >
                                            <Checkbox
                                                checked={spliterFirst === col.FieldName}
                                                onChange={() =>
                                                    handleFirstSelect(col.FieldName)
                                                }
                                            />
                                            <Typography className="column_label">
                                                {col.HeaderName}
                                            </Typography>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <p
                                    style={{
                                        margin: "10px 0px 0px 13px",
                                        fontWeight: 600,
                                    }}
                                    className="descLine_showColum"
                                >
                                    Select For Second Slide
                                </p>

                                <div
                                    className="column_row sub_row"
                                    style={{ display: "flex", alignItems: "center" }}
                                >
                                    <Checkbox
                                        checked={selectedCols.includes("SpliterSecondPanelAll")}
                                        onChange={() => handleCheckboxChange("SpliterSecondPanelAll")}
                                    />
                                    <Typography className="column_label">ALL</Typography>
                                </div>
                                <div className="largest_columns_group" style={{ height: '50vh' }}>
                                    {largeDataColum?.map((col) => (
                                        <div
                                            key={`ldr2-${col.ColId}`}
                                            className="column_row sub_row"
                                            style={{ display: "flex", alignItems: "center" }}
                                        >
                                            <Checkbox
                                                checked={spliterSecond === col.FieldName}
                                                onChange={() =>
                                                    handleSecondSelect(col.FieldName)
                                                }
                                            />
                                            <Typography className="column_label">
                                                {col.HeaderName}
                                            </Typography>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <Button
                            style={{
                                color: "blue",
                                textDecoration: "underline",
                                cursor: "pointer",
                                marginTop: "20px",
                            }}
                            onClick={handleOpen}
                        >
                            ADD OTHER DETAIL ON SPLITER VIEW
                        </Button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default SpliterReport
