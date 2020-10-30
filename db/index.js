const conn =                require('../db/connections')
const { g, b, gr, r, y } =  require('../console')

// env variables for auth db and subscribers
const authUri = process.env.ATLAS_AUTH
const authCollection = process.env.ATLAS_AUTH_SUBSCRIBERS
const authDb = process.env.ATLAS_AUTH_DB
// envariables for machine db and markets
const machineUri = process.env.ATLAS_MACHINE
const machineDb = process.env.ATLAS_MACHINE_DB
const marketsCollection = process.env.ATLAS_MACHINE_MARKETS

/**
 * Search the database for the given user
 * @param {String} token The user's access token
 */

const findUser = (token, res) => {
    return new Promise(async (resolve, reject) => {
        const db = await conn(authUri, authdb)         
        db.collection(authCollection).findOne({password: token}, (err, result) => {        
            if (err) reject(err)
            delete result.password 
            resolve(result)
          })          
    })
}

const findVenue = (req, res) => {
    return new Promise(async (resolve, reject) => {
        const db = await conn(machineUri)
        let filterVenue = req.body.filter(u => {
            // find and return venue signal
            if (u.type === 'Gateway') return true           
            return false 
          })
        let token = 'unknown'
        // find mac and validate against registered venue device
        if (filterVenue){token = filterVenue[0].mac}   
        db.collection(marketsCollection)
            .find({monitors: token })
            .toArray()
            .then((result) => {        
                delete result[0].monitors
                resolve(result)
            })          
    })
}

module.exports = {
    findUser,
    findVenue
}