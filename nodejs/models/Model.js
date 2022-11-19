class Model {
    static dbProperties = []
    static autoCompleteProperty = null
    static idProperties = []
    
    constructor(modelClass){
        this.modelClass = modelClass
    }
    static load(obj){
        if(!this.hasAllProperties(obj)){
            return null
        }
        let newObject = new this()
        let properties = this.dbProperties.map((x)=>x)
        if(this.autoCompleteProperty !== null){
            properties.push(this.autoCompleteProperty)
        }
        for(let property of properties){
            newObject[property] = obj[property]
        }
        return newObject
    }

    static hasAllProperties(obj){

        let objectPropertyList = Object.getOwnPropertyNames(obj)
        for(let i of this.dbProperties){
            if(!objectPropertyList.includes(i)){
                return false
            }
        }
        return true
    }
}

module.exports = Model