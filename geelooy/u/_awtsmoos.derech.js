//B"H
module. exports={
  dynamicRoutes:async info=>{
  await info
  .use(
    "/@/:u",
    async (vars)=>{
      
      var t=await info.getT(
        "profile/user.html",{
          user:vars. u

        }

      );
      if(!t){
        return {
          mimeType:"text/html",
          response:
            "B\"H<br>"+
            "User "+vars.u+" not found."

        }

      }

      return {
        response: t

      };

      

    }

  );

}

}
