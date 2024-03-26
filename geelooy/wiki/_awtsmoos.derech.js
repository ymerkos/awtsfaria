/**B"H
 * 
 */


module.exports = 

  async ($i) => {
    // Check if logged in

    await $i.use({
      "/:url": async (vars) => {
     
        var pt = vars.url;
        
        var k = `https://he.wikisource.org/${
            pt
        }`;
        var enc = encodeURIComponent(k)
        
        var bt = $i.btoa(enc);
        
        var ur = `/api/social/fetch/${bt}`
        
        try {
            var res = await $i.fetchAwtsmoos(ur);
            return "B\"H<br>Did it!" + k + " " + enc + " " + bt + " "+ur + res || "Nothing"
        } catch(e) {
            return er({
                message: "Didnt fetch",
                url: ur,
                source: k,
                bit: bt
            })
        }
      }

    })

};