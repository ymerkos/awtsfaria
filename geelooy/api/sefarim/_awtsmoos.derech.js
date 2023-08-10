/**
 * B"H
 * Sefarim API
 * /api/sefarim
 * 
 * API Endpoints:
 *
 *TODO: document API strucutre
 */

module.exports = {
    dynamicRoutes: async info => {
        
        await info.use({
            "/": async vars => {
                var sefarimRoot = await info.db.get("/sefarim");
          

                return {
                    response: {
                        sefarim: sefarimRoot
                    }
                }
                
            },
            "/:sefer": async vars => {
                var sef = vars.sefer;
                var sefer = await info.db.get("/sefarim/" + sef);
                return {
                    response: {
                        portions: sefer.map((q, i)=>({
                            id: q,
                            name: q
                        }))
                    }
                }
            },
            
            "/:sefer/section/:section": async vars => {
                var sec = await info.db.get(
                    "/sefarim/"
                    + vars.sefer 
                    +"/"
                    + vars.section
                );
                
                return {
                    response: {
                        sections: sec
                    }
                };
            },
            "/:sefer/section/:section/sub/:sub" :async vars => {
                
                var sub = await info.db.get(
                    "/sefarim/"
                    + vars.sefer 
                    +"/"
                    + vars.section
                    +"/"
                    +vars.sub
                );

                
                return {
                    response: {
                        subSection: sub
                    }
                };
            }
        })
    }
};
        
    
