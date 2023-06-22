// B"H
const vm = require('vm');

async function processTemplate(template) {
    return await template.replace(/<\?Awtsmoos([^>]+)\?>/g, async (match, code) => {
        const script = new vm.Script(code);
        const context = vm.createContext({});
        var tawmtsees /*result*/ =  script.runInContext(context);
        return await Promise.resolve(tawmtsees)
    });
}

module.exports = processTemplate;
