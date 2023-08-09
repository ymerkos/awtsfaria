/**
 * B"H
 * Sefarim API
 * 
 * 
 * API Endpoints:
 *
 * POST /api/sefarim {root dir, here} - Retrieve the list of available sefarim.
 *      Output: { sefarim: Array of available texts }
 *      Dynamic for Shulchan Aruch and other sacred texts.
 *
 * POST /api/sefarim/:sefer - Load the structure of a specific sefer (e.g., 'shulchanAruch').
 *      Input: { sefer: String }
 *      Output: { structure: Object describing the unique structure of the sefer }
 *      Provides a dynamic structure for each sefer, allowing for unique attributes.
 *
 * POST /api/sefarim/:sefer/section/:section - Load a specific section within a sefer.
 *      Input: { sefer: String, section: String }
 *      Output: { sections: Array of subsections or content specific to the sefer's structure }
 *      Adapts to the unique structure of each sefer, such as 'siman', 'shulchanAruch', and 'commentaries' in Shulchan Aruch.
 *
 * POST /api/sefarim/:sefer/subsection/:id - Load a specific subsection by ID.
 *      Input: { sefer: String, id: Number }
 *      Output: { content: Array or Object based on the sefer's unique structure }
 *      Provides detailed content for each subsection, adapting to the unique attributes of each sefer.
 *
 */
module.exports = {
    dynamicRoutes: async info => {
        
        await info.use({
            "/": async vars => {
                var sefarimRoot = await info.db.get("/sefarim");
                console.log(sefarimRoot);

                return {
                    response: {
                        sefarim: sefarimRoot
                    }
                }
                
            },
            "/:sefer": async vars => {
                var sef = vars.sefer;
                return {
                    response: {
                        sefer:sef
                    }
                }
            }
        })
    }
};
        
    
