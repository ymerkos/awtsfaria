/**B"H
 * 
 */


module.exports = 

  async ($i) => {
    // Check if logged in

    await $i.use({
      "/:url": async (vars) => {
     
        var pt = vars.url;
        var enc = encodeURIComponent(pt)
        var k = `https://he.wikisource.org/${
            enc
        }`;
        
        var bt = $i.btoa(k);
        
        var ur = `/api/social/fetch/${bt}`
        
        try {
            var res = await $i.fetchAwtsmoos(ur);
            return res || "Nothing"
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