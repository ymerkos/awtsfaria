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
              /*var script =  new vm.Script(`(async () =>{${code}})()`);
              var res = await new Promise((resolve, reject) => {
                script.runInContext(vm.createContext({...sandbox, resolve}))
              
              });*/
               //var r = vm.runInContext(`(async () =>{${code}})()`, sandbox)
              var r = await runScript(code, sandbox)
              return {
                 result: sandbox.result,r
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
    code = `/*B"H*/
        try {

            result = await (async () => {
            
            
                      ${
                        code
                      }
            
            
            
            })();
            return resolve(result)
          
        } catch(e) {
          return resolve({
              BH:
                  "hi",
              error: e.stack
          })
        }
    `;
    const script = new vm.Script(`(async()=>{

          ${code}

          
    })()`);
    try {
      script.runInContext(vm.createContext({
        ...context,
        resolve,
        reject,
      }), {
        timeout,
        breakOnSigint,
      });
    } catch(e) {
      resolve({
        BH: 
            "hi",
        error: e.stack
      })
    }
  });
}
