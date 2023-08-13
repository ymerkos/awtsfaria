//B"H
module. exports={
  dynamicRoutes: async i=>{
    await i.use(
      "post", async()=>{
        if(i.request.method!="POST"){
          return {
            response: {
              BH:"B\"H",
              hi: "what's up?"

            }

          }

        }

        if(i.request.user){
          var content=i.$_POST.content;

          if(! content){
            return {
              response: {
                missing:"content"
                
              }

            }

          }

          var id="BH_"+
            Date.now();

          var p=await i.db.create(
            "users/"+
            i.request.user.info.userId
            +"/posts/"
            +id,{

              content
              
            }

          );

          return {
            response: {
              id

            }

          }

        }

      }

    );

  };

}
