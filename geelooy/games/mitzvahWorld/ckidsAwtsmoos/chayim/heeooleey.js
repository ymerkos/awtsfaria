/**
B"H
**/

export default class Heeoolee {
    events = {};
    constructor() {

    }

	static extend(target) {
	 Object.getOwnPropertyNames(Heeoolee.prototype).forEach((name) => {
		if (
		name !== 'constructor' && 
		name != "extend" &&
		!target.hasOwnProperty(name)
		) {
		  target[name] = Heeoolee.prototype[name];
		}
	  });
	}

    clearAll() {
        Object.keys(this.events)
        .forEach(w => {
            try {
                delete this.events[w]
            } catch(e){

            }
        });
        this.events = {}
    }
	
    clear(shaym) {
        if(typeof(shaym) != "string") {
            return null;
        }
        if(this.events[shaym]) {
            delete this.events[shaym];
        }
    }

    remove(shaym, peula) {
        if(typeof(shaym) != "string") {
            return false;
        }

        if(typeof(peula) != "function") {
            return false;
        }

        var ev = this.events[shaym]
        if(!ev || !Array.isArray(ev)) {
            return false;
        }

        var ind = ev.indexOf(peula)
        if(
            ind > -1
        ) {
            this.events.splice(ind, 1);
            return true;
        }
        return false;
    }

    on(shaym, peula/*function*/, oneTime=false) {
        if(typeof(shaym) != "string") {
            return null;
        }

        if(typeof(peula) != "function") {
            if(typeof(peula) == "string") {
                /*try to resolve string as 
                function, maybe passed from worker
                or socket etc.*/
                
                try {
                    peula = eval("("+peula+")");
                } catch(e) {
                    
                    return null;
                }
                
            }
            
        }


        if(!this.events[shaym]) {
            this.events[shaym] = [];
        }
        this.events[shaym].push({peula, oneTime});
    }

    event(shaym) {
        return this.events[shaym] ? 
            this.events[shaym].length ? 
            this.events[shaym] : null : null;
    }

    ayshPeula/*fire event*/(
        shaym/*name*/, 
        ...dayuh/*data*/
    ) {
        const asyncs = [];
        
        if(this.events[shaym]) {
			var indexesToRemove = [];
            this.events[shaym].map(async (ev, index)=>{
				var q = ev.peula;
				var isOne = ev.oneTime;
                if((q+"").indexOf("async") > -1) {
                    asyncs.push(q(...dayuh));
				}
                else {
					q(...dayuh);
				}
				if(isOne) {
					indexesToRemove.push(index);
				}
            });
			
			indexesToRemove.sort((a,b)=> b-a);
			for(const ind of indexesToRemove) {
				this.events[shaym].splice(ind, 1)
			}
        }
        return Promise.all(asyncs)
    }
}