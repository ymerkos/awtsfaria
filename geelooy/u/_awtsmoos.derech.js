//B"H
module. exports={
  dynamicRoutes:async info=>{
  await info
  .use(
    "/:u",
    await vars=()=>{
      return {
        response: "BH"

      }
      var t=await info.getT(
        "profile/user.html",{
          user: u

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
