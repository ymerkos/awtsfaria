//B"H
module. exports={
  dynamicRoutes:async info=>{
    
  info.private();
  await info
  .use(
    ":u",
    async (vars)=>{
      
      
      var pt = `/api/social/aliases/${vars.u}/ownership`
      var belongsToMe = await info.fetchAwtsmoos(
        pt, {
          superSecret:"maybe"
        }
      )
      
      var t=await info.getT(
        "profile/user.html",{
          alias:vars. u,
          loggedIn: info.request.user,
          belongsToMe

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
