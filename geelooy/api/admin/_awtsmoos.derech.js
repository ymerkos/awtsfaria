/**
B"H
*/
const vm = require('vm');

module.exports = {
  dynamicRoutes: async $i => {
    var $u = $i?.request?.user;
    
    $i.use({
      "/code": async v => {
        try {
          const sandbox = { result: null, ...($i) };
          vm.createContext(sandbox);
          if($u.info.entry !== "asdf") {
            return {er: "No auth", user:$u}
          }
        var p = JSON.parse($i.$_POST)
          var code = p.code;
          return {got: p,code}
          if(code) {
            try {
             var r = vm.runInContext(code, sandbox)
              return {
                 result: sandbox 
              }
            } catch(e) {
                return {
                  error : {
                    message: "problem compiling",
                    stack:e.stack
                  }
                }
            }
          }
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
