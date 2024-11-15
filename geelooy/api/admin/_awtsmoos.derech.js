/**
B"H
*/
const vm = require('vm');

module.exports = {
  dynamicRoutes = async $c => {
    var $r = $c.info;
  
    $c.use({
      "/code": async v => {
        const sandbox = { globalVar: 1 };
        vm.createContext(sandbox);
        return {
          hi: $r
        }
      }
    })
  }
}
