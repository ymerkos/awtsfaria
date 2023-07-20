/**
B"H
*/

if(typeof(args[0]) == "string") {
                var ob = {
                    [args[0]]:args[1]
                }
                obj = ob;
                if(args[2]) {
                    bool = argsCopy[2];
                }
            } else if(typeof(argsCopy[0]) == "object") {
                obj = argsCopy[0];
                bool = argsCopy[1];
                
            }