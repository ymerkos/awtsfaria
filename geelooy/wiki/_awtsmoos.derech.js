/**B"H
 * 
 */


module.exports = 

  async ($i) => {
    // Check if logged in
    
    $i.setHeader(
      "Access-Control-Allow-Origin",
      "*"
    )
    var userid = null;
    if(loggedIn($i))
      userid = $i.request.user.info.userId; // Alias connected to the logged-in user

      
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