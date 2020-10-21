const conn =                require('../db/connections')
const { g, b, gr, r, y } =  require('../console')

const uri = process.env.ATLAS_CONFIGS
const dbName = process.env.ATLAS_CONFIGS_DB
const dbCollection = process.env.ATLAS_CONFIGS_COLLECTION

/**
 * Search the database for the given user
 * @param {String} token The user's access token
 */

export function findUser(token) {
    return new Promise(async (resolve, reject) => {
        const db = await conn(uri, dbName) 
        db.collection(dbCollection).findOne({clientId: id}, (err, result) => {        
            if (err) reject(err)
            delete result.clientId           
            res.json(result)            
            resolve(result)
          })          
    })
}