//B"H
async function predict(txt) {
    fetch("https://ysharma-explore-llamav2-with-tgi.hf.space/run/predict", {
  "headers": {
    "accept": "*/*",
    "accept-language": "en-US,en;q=0.9",
    "content-type": "application/json",
    "sec-ch-ua": "\"Not?A_Brand\";v=\"8\", \"Chromium\";v=\"108\", \"Google Chrome\";v=\"108\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"Linux\"",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-origin"
  },
  "referrer": "https://ysharma-explore-llamav2-with-tgi.hf.space/",
  "referrerPolicy": "strict-origin-when-cross-origin",
  "body": "{\"data\":[],\"event_data\":null,\"fn_index\":12,\"session_hash\":\"5a53vhzhm82\"}",
  "method": "POST",
  "mode": "cors",
  "credentials": "include"
});
}