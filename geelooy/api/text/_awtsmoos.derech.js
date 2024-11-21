//B"H
module.exports = {
  /**
   * The Dynamic Routes - A Symphony of Endpoints
   * A manifestation of the Awtsmoos, unfolding new paths and journeys.
   * @param {Object} request - The incoming HTTP request.
   * @returns {(string|null)} The response or null if not handled.
   */
  dynamicRoutes: async ($i) => {
    var request = $i.request;
    await info.use({
      "timestamp": async v => {
        var apiKey = $i.$_POST.apiKey;
        if(!apiKey) {
          return {error: "No api key"}
        }
        
        var mediaURL = $i.$_POST.mediaURL;
        if(!mediaURL) {
          return {error: "No mediaURL"}
        }
        var textURL = $i.$_POST.textURL;
        if(!textURL) {
          return {error: "No textURL"}
        }

        try {
          return await (await $i.fetch(
          "https://api.rev.ai/alignment/v1/jobs", {
              method: "POST",
              headers: {
                  "Authorization": "Bearer " + apiKey,
                  "content-type":"application/json",
                  
              },
              body: JSON.stringify({
                  "source_config": {
                      "url": mediaURL
                  }, 
                  "source_transcript_config": {
                      "url": textURL
                  }, 
                  "metadata":"Awtsmoosification"
              })
          }
          )).json()
          return a;
        } catch(e) {
          return {error:e.stack,code:"FETCH_ERROR"}
        }
        

        
      },
      "timestamp/:jobId": async v => {
        var apiKey = $i.$_POST.apiKey;
        if(!apiKey) {
          return {error: "No api key"}
        }
        try {
        return await (await $i.fetch(
          "https://api.rev.ai/alignment/v1/jobs/"+v.jobId, {
              headers: {
                  "Authorization": "Bearer " + apiKey,
                  "content-type":"application/json",
                  
              }
          })).json()
        } catch(e) {
          return {error:e.stack,code:"FETCH_ERROR"}
        }
      },
      ,
      "timestamp/:jobId/result": async v => {
        var apiKey = $i.$_POST.apiKey;
        if(!apiKey) {
          return {error: "No api key"}
        }
        try {
        return await (await $i.fetch(
          "https://api.rev.ai/alignment/v1/jobs/"
          +v.jobId+"/transcript", {
              headers: {
                  "Authorization": "Bearer " + apiKey,
                  "content-type":"application/json",
                  
              }
          })).json()
        } catch(e) {
          return {error:e.stack,code:"FETCH_ERROR"}
        }
      }
    })
  }
}
