
function getMissingProperties(propertyList, object){
    let objectProperties = Object.getOwnPropertyNames(object)
    let missingsProperties = []
    for(let property of propertyList){
        if(!objectProperties.includes(property)){
            missingsProperties.push(property)
        }
    }
    return missingsProperties
}

function isValidDate(d) {
    return d instanceof Date && !isNaN(d);
}

module.exports = {
    getMissingProperties: getMissingProperties,
    isValidDate: isValidDate
}