/**
B"H
*/
const vm = require('vm');

module.exports = {
  dynamicRoutes: async $i => {
    var $u = $i?.request?.user;
    
    await $i.use({
      "/code": async v => {
        
        try {
          const sandbox = { result: null, ...($i) };
         // vm.createContext(sandbox);
          if($u.info.entry !== "asdf") {
            return {er: "No auth", user:$u}
          }
        var p = typeof($i.$_POST)
           var code = $i.$_POST.code;
       
        //  return {got: p,code,post:$i.$_POST}
          if(code) {
            try {
              var r =3//
          //    var script =  new vm.Script(`g = 5`);
              var res = 6867/*await new Promise((resolve, reject) => {
                //script.runInContext({...sandbox, resolve}
                resolve(43)
              });*/
               //var r = vm.runInContext(`(async () =>{${code}})()`, sandbox)
              //var r = await runScript(code, sandbox)
              return {
                 result: sandbox.result,res
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

async function runScript(code, context = {}, options = {}) {
  return new Promise((resolve, reject) => {
    const { timeout = 120 * 1000, breakOnSigint = true } = options;
    const script = new Script(`(async()=>{${code}})()`);
    script.runInContext(createContext({
      ...context,
      resolve,
      reject,
    }), {
      timeout,
      breakOnSigint,
    });
  });
}
