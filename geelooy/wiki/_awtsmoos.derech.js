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
        
        var bt = $i.btoa(k);
        
        var ur = `/api/social/fetch/${bt}`
        return ur;
        try {
            return await fetchAwtsmoos(ur);
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