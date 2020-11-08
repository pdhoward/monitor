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
 * Search the database for a venue
 * @param {String} token The user's access token
 */


const findVenue = (venue) => {
    return new Promise(async (resolve, reject) => {
        const db = await conn(machineUri, machineDb)
        
        let token = 'unknown'
        // find mac and validate against registered venue device
        if (venue){token = venue[0].mac}   
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
    findVenue
}