//B"H
function convertGoSliceToJs(goSliceString) {
    // Extract the content inside the main array
    const mainContent = goSliceString.match(/\[\s*{(.*)}\s*\]/s)[1];

    // Split the content into individual objects
    const objects = mainContent.split('},').map(obj => obj.trim() + '}');

    // Map each object to a JavaScript object string
    const jsObjects = objects.map(obj => {
        const keyValuePairs = obj.match(/{\s*Key:\s*"([^"]*)",\s*Value:\s*([^}]*)}/g);
        return keyValuePairs.map(pair => {
            const [key, value] = pair.match(/Key:\s*"([^"]*)",\s*Value:\s*([^}]*)/).slice(1);
            return `"${key}": ${value.trim().replace(/nil/g, 'null')}`;
        }).join(', ');
    });

    // Join all objects into a single string
    return `{ ${jsObjects.join(', ')} }`;
}
/*
const goSliceString = `bda := []Bda{ ... }`; // Replace with your actual Go slice string
const jsString = convertGoSliceToJs(goSliceString);
*/