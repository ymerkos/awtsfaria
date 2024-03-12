//B"H
module. exports={
  dynamicRoutes:async $i=>{
	  
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
	  belongsToMe = belongsToMe.code != "NO"
	  var aliasDetails = await $i.fetchAwtsmoos(
		`/api/social/aliases/${vars.a}/details`
	  )
      var t=await $i.fetchAwtsmoos(
        "/@/_awtsmoos.alias.html",
		{
			yeser: {
			  alias:aliasDetails,
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
