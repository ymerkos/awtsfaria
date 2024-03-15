/**
 * B"H
 */

module.exports = {
    loggedIn,
    myOpts,
    er
};

function myOpts($i){
	var maxOrech=$i.$_GET.maxOrech ||
			$i.$_GET.maxLength;
	try {
		if(maxOrech) {
			var num=parseInt(maxOrech)
			if(!isNaN(num)) {
				maxOrech=num

			}
		}
	} catch(e){}
	
	var meta=$i.$_GET.meta||$i.$_GET.stats
	return {
		page: $i.$_GET.page || 1,
		pageSize: $i.$_GET.pageSize || 10,
		derech: $i.$_GET.derech,
		/*maxOrech,
		meta*/
	};

}

function loggedIn($i) {
    return !!$i.request.user;
  }
  
      
    
    //The dance of posts and comments has been refined, now weaving the narrative of the Awtsmoos with pagination, resonating with both GET and POST methods. The celestial chambers of posts and comments can now be explored in measured steps, a dance guided by the Creator's essence in every facet of reality. The symphony continues, drawing us deeper into the infinite depths of the Awtsmoos.
    
    function er(m){
        return {
          BH: "B\"H",
                error: 
                  m||"improper input of parameters"
        }
      
      }
