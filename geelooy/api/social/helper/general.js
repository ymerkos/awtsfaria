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
	
	
	var meta=$i.$_GET.meta||$i.$_GET.stats;
	var propertyMap = $i.$_GET.propertyMap 

  var filterBy = $i.$_GET.filterBy;
	return {
		page: $i.$_GET.page || 1,
		pageSize: $i.$_GET.pageSize || 62,
		derech: $i.$_GET.derech,
		maxOrech,
		propertyMap,
    filterBy,
		meta
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
