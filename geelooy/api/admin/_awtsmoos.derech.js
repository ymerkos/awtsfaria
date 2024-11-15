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
        var p = typeof($i.$_POST)
           var code = $i.$_POST.code;
       
        //  return {got: p,code,post:$i.$_POST}
          if(code) {
            try {
             var r = vm.runInContext(`(async () =>{${code}})()`, sandbox)
              return {
                 result: sandbox.result
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
