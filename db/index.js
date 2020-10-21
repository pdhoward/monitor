const conn =                require('../db/connections')
const { g, b, gr, r, y } =  require('../console')

const uri = process.env.ATLAS_CONFIGS
const dbName = process.env.ATLAS_CONFIGS_DB
const dbCollection = process.env.ATLAS_CONFIGS_COLLECTION
const authUri = process.env.ATLAS_AUTH
const authCollection = process.env.ATLAS_AUTH_COLLECTION


/**
 * Search the database for the given user
 * @param {String} token The user's access token
 */

const findUser = (token, res) => {
    return new Promise(async (resolve, reject) => {
        const db = await conn(authUri)         
        db.collection(authCollection).findOne({password: token}, (err, result) => {        
            if (err) reject(err)
            delete result.password      
            res.json(result)            
            resolve(result)
          })          
    })
}

module.exports = {
    findUser
}