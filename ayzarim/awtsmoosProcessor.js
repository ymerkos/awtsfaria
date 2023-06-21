// B"H
const vm = require('vm');

function processTemplate(template) {
    return template.replace(/<\?Awtsmoos([^>]+)\?>/g, (match, code) => {
        const script = new vm.Script(code);
        const context = vm.createContext({});
        return script.runInContext(context);
    });
}

module.exports = processTemplate;
