//B"H
module. exports={
  dynamicRoutes:async info=>{
    console.log(info.superSecret)
  info.private();
  await info
  .use(
    ":u",
    async (vars)=>{
      console.log("Hi")
      var belongsToMe = info.fetchAwtsmoos(
        `/api/social/aliases/${vars.u}/ownership`, {
          superSecret:"maybe"
        }
      )
      console.log(belongsToMe)
      var t=await info.getT(
        "profile/user.html",{
          alias:vars. u,
          loggedIn: info.request.user

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
