const { pool } = require("../database")

class Controller{
    constructor(model){
        this.model = model
    }

    async create(obj){
        let response = null
        let success = true

        let placeholders = []
        let values = []
        for(let param of this.model.dbProperties){
            placeholders.push("?")
            values.push(obj[param])
        }
        
        response = await pool.execute(`INSERT INTO ${this.model.name.toLowerCase()} (${this.model.dbProperties.join()}) VALUES (${placeholders.join()})`, 
        values)
        .catch(e=>{
            success = false
            return {
                "error": e.sqlMessage
            }
        })

        if(success){
            const copyObj = JSON.parse(JSON.stringify(obj))

            if(this.model.autoCompleteProperty !== null){
                const id = response[0].insertId
                copyObj[this.model.autoCompleteProperty] = id
            }

            // We then create all the cores for this machine
            // TODO: automatically create the cores when a machine is added
            // eather here or in pure sql
            return this.model.load(copyObj)
        }
        return response
    }

    async all(){
        const result = await pool.execute(`SELECT * FROM ${this.model.name.toLowerCase()}`)
        let objects = []
        for(let r of result[0]){
            objects.push(this.model.load(r))
        }
        return objects
    }

    async get(ids){
        let placeholders = []
        let values = []
        for(let property of this.model.idProperties){
            placeholders.push(`${property}=?`)
            values.push(ids[property])
        }

        let result = await pool.execute(`SELECT * FROM ${this.model.name.toLowerCase()} WHERE ${placeholders.join(" and ")}`, values)
        .catch(e=> {
            return {
                "error": e.sqlMessage
            }
        })
        if(result[0][0] === undefined){
            return {
                "error": `Couldn't find ${this.model.name} with ${this.model.idProperties.join()} = ${values.join}`
            }
        }
        return this.model.load(result[0][0])
    }

    async delete(ids){
    
        let placeholders = []
        let values = []
        
        for(let property of this.model.idProperties){
            placeholders.push(`${property}=?`)
            values.push(ids[property])
        }

        const response = pool.execute(`DELETE FROM ${this.model.name.toLowerCase()} WHERE ${placeholders.join(" and ")}` , values)
        .catch(e=>{
            return {
                "error" : e.sqlMessage
            }
        })
        return response
    }
}

module.exports = Controller