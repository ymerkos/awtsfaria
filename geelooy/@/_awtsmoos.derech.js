//B"H
module. exports={
  dynamicRoutes:async $i=>{
    console.log("HI aw",$i.request.user)
  var loggedInUser = $i.request.user ?
	$i.request.user.info.userId : null
  /*:a is the current
  alias to view*/
  await $i
  .use(
    ":a",
    async (vars)=>{
      
      var pt = `/api/social/aliases/${vars.a}/ownership`;
	  
      var belongsToMe = loggedInUser ? 
	  await $i.fetchAwtsmoos(
        pt, {
          superSecret:"maybe"
        }
      ) : {code: "NO"};
      var t=await $i.fetchAwtsmoos(
        "/@/_awtsmoos.user.html",
		{
			yeser: {
			  alias:vars.a,
			  wow:2,
			  loggedInUser,
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
