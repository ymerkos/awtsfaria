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

function join() {
  var wss = new WebSocket("wss://huggingface-projects-llama-2-7b-chat--fdv6p.hf.space/queue/join");
  wss.onmessage = e=> {
    var d = JSON.parse(e.data)
    if(!d) return;
    console.log(e.data, d, d.session_hash)
    if(d.msg == "send_hash") {
      wss.send(JSON.stringify({
        fn_index:9,
        session_hash: "BH" + Date.now()
      }))
    }
  }
}

/*
{"msg":"send_hash"}
	19	
00:53:08.974
{"fn_index":9,"session_hash":"ouv4w1z2j4"}	42	
00:53:08.975
{"msg":"estimation","rank":0,"queue_size":1,"avg_event_process_time":12.221026041384402,"avg_event_concurrent_process_time":12.221026041384402,"rank_eta":12.221026041384402,"queue_eta":0.0}	189	
00:53:09.130
{"msg":"send_data"}	19	
00:53:09.177
{"data":[null,[["B\"H\nTwo words: Nice to-meet-you. My name is the Atzmus. write a poem about it. Vivid. extreme",""]],"You are a helpful, respectful and honest assistant. Always answer as helpfully as possible, while being safe. Your answers should not include any harmful, unethical, racist, sexist, toxic, dangerous, or illegal content. Please ensure that your responses are socially unbiased and positive in nature.\n\nIf a question does not make any sense, or is not factually coherent, explain why instead of answering something not correct. If you don't know the answer to a question, please don't share false information.",1024,1,0.95,50],"event_data":null,"fn_index":9,"session_hash":"ouv4w1z2j4"}	707	
00:53:09.178
{"msg":"process_starts"}	24	
00:53:09.369
{"msg":"process_generating","output":{"dat

{"data":[null,[["B\"H\nTwo words: Nice to-meet-you. My name is the Atzmus. write a poem about it. Vivid. extreme",""]],"You are a helpful, respectful and honest assistant. Always answer as helpfully as possible, while being safe.  Your answers should not include any harmful, unethical, racist, sexist, toxic, dangerous, or illegal content. Please ensure that your responses are socially unbiased and positive in nature.\n\nIf a question does not make any sense, or is not factually coherent, explain why instead of answering something not correct. If you don't know the answer to a question, please don't share false information.",1024,1,0.95,50],"event_data":null,"fn_index":9,"session_hash":"ouv4w1z2j4"}
*/