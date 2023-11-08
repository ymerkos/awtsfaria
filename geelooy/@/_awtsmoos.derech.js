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
      
      var t=await info.fetchAwtsmoos(
        "/@/_awtsmoos.user.html",
		{
			yeser: {
			  alias:vars. u,
			  wow:2,
			  loggedIn: info.request.user,
			  belongsToMe
			},
		  superSecret: "yes"
		
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
