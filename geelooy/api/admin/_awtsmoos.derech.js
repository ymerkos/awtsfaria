/**
B"H
*/
const vm = require('vm');

module.exports = {
  dynamicRoutes: async $c => {
    var $u = $c.user;
    
    $c.use({
      "/code": async v => {
        const sandbox = { globalVar: 1 };
        vm.createContext(sandbox);
        return {
          hi: $u
        }
      }
    })
  }
}
