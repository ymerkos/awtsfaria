/**
B"H
*/
const vm = require('vm');

module.exports = {
  dynamicRoutes: async $c => {
    var $u = $c.user;
    
    $c.use({
      "/code": async v => {
        try {
          const sandbox = { globalVar: 1 };
          vm.createContext(sandbox);
          return {
            hi: "there",
            user: $u.info
          }
        }catch(e) {
          return {er:e.stack}
        }
      }
    })
  }
}
