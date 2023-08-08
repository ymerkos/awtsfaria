//B"H
async function predict(txt) {
    fetch("https://ysharma-explore-llamav2-with-tgi.hf.space/run/predict", {
  "headers": {
    "accept": "*/*",
    "accept-language": "en-US,en;q=0.9",
    "content-type": "application/json",
  
  },
  "body": "{\"data\":[],\"event_data\":null,\"fn_index\":12,\"session_hash\":\"5a53vhzhm82\"}",
  "method": "POST",
  "mode": "cors"
});
}