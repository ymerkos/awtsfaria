/**
 * B"H
 * 
 * 
 * @class DependencyInjector
// Usage
var dependencies = {
    hi: 'Hello!',
    bye: 'Goodbye!'
};

function greet() {
    console.log(this.hi);
    console.log(this.bye);
}

DependencyInjector.execute(greet, [], dependencies); // Output: Hello! Goodbye!
 */


class DependencyInjector {
    constructor(dependencies) {
        this.dependencies = dependencies;
    }

    generateCodeForDependencies() {
        return Object.keys(this.dependencies)
            .map(key => `var ${key} = dependencies['${key}'];`)
            .join('\n');
    }

    getBody(func) {
        
        try {
            var entire = func.toString(); // this part may fail!
            var body = entire
            .substring(entire.indexOf("{") + 1, entire.lastIndexOf("}"));
            return body;
        } catch(e) {
            return null
        }
    }

    generateCodeForParams(params) {
        return Object.keys(params)
            .map(key => `var ${key} = params['${key}'];`)
            .join('\n');
    }

    getHead(func) {
        try {
            var entire = func.toString(); // this part may fail!
            var body = entire
            .substring(0,entire.indexOf("{") + 1).trim();
            return body;
        } catch(e) {
            return null
        }
    }
    runFunction(func, params={}) {
        if(!func && !typeof(func) == "function") {
            return null;
        }
        if(!params) return
        var dependencies = this.dependencies || {};
        var dependencyCode = this.generateCodeForDependencies();
        var paramsCode = this.generateCodeForParams(params);
        var hd = this.getHead(func);
        var isAsync = hd.startsWith("async")
        try {
            var cd = `
                ${dependencyCode}
                ${paramsCode}
                ${this.getBody(func)||"()=>{}"}
            `
            
            
            var functionWithDependencies = 
            isAsync ? this.createAsyncFunction(
                [
                    "func", 
                    "params",
                    "dependencies"
                ], cd
            ) :
            new Function(
                'func', 'params', 'dependencies', cd
            );
            return functionWithDependencies(func, params, dependencies);
        } catch(e) {
            console.log("Issue?", e.stack, e)
            return null;
        }
    }

    createAsyncFunction(params, body) {
        return eval(`
            (async function(${params})  {
                
               ${body}
            }
        )`);
    };

    static execute({
        base, params, dependencies={}
    }) {
        var injector = new DependencyInjector(dependencies);
        return injector.runFunction(base, params);
    }

    static safeInit(initialValues = {}) {
        return new Proxy(initialValues, {
            get: (target, name) => {
                if (name in target) {
                    return target[name];
                } else {
                    return undefined;
                }
            }
        });
    }
}

module.exports = DependencyInjector