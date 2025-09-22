import axios from "axios";

const APIURL =
  window.location.hostname === "localhost" ||
  window.location.hostname === "nzen"
    ? "http://newnextjs.web/api/report"
    : "https://view.optigoapps.com/ExpressApp/EvoApp.aspx";

// const APIURL = "https://view.optigoapps.com/ExpressApp/EvoApp.aspx";
// const APIURL = "https://livenx.optigoapps.com/api/report";
// const APIURL = "http://nzen/jo/ExpressApp/EvoApp.aspx";

export const CommonAPI = async (body) => {
  try {
    const header = {
      YearCode: "e3tuemVufX17ezIwfX17e29yYWlsMjV9fXt7b3JhaWwyNX19",
      version: "R50B3",
      sv: 0,
      sp: 34,
    };

    const response = await axios.post(APIURL, body, { headers: header });
    return response?.data;
  } catch (error) {
    console.error("error is..", error);
  }
};
