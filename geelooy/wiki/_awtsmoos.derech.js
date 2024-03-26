/**B"H
 * 
 */


module.exports = 

  async ($i) => {
    // Check if logged in

    await $i.use({
      "/:url": async (vars) => {
     
        var pt = vars.url;
        var k = `https://he.wikisource.org${
            pt
        }`;
        var bt = btoa(k);
        var ur = `/api/social/fetch/${bt}`
        return await fetchAwtsmoos(ur);
      }

    })

};