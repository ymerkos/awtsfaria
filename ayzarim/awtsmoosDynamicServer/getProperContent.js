/**B"H */
module.exports = function getProperContent
(
    content=null, 
    contentType=null,
    isBinary=false
) {
    

    if (!isBinary) {
        if (typeof(content) == "boolean") {
            content += ""
        }
        else if (
            content && 
            typeof(content) == "object"
        ) {
            contentType = "application/json";
            try {
                content = JSON.stringify(content);
            } catch (e) {
                content += ""
            }
        }
    }
    return {
        content,
        contentType
    }
}
