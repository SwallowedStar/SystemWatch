
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

module.exports = {
    getMissingProperties: getMissingProperties
}