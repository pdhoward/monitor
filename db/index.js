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
        // returns an empty array if venue not in db
        if (venue){token = venue[0].mac}   
        db.collection(marketsCollection)
            .find({monitors: token })                     
            .toArray()
            .then((result) => {  
                if (result.length > 0) delete result[0].monitors
                resolve(result)
            })
            .catch(err => reject(err))        
    })
}

const findSubscriberAndUpdate = (signal, venue) => {
    return new Promise(async (resolve, reject) => {  
        const db = await conn(authUri, authDb)
        let signalUUID = signal.ibeaconUuid
        let marketid = venue[0].marketid
        let marketstamp = Date.now()
        // updates doc but returns the pre-updated one - with marketstamp reflecting time of last detected signal
        db.collection(authCollection)
            .findOneAndUpdate({uuid: signalUUID }, {$set: {marketid: marketid, marketstamp: marketstamp}, $inc: {marketnotices: 1}})
            .then((result) => {               
                if (result.value) {                    
                    resolve([result.value])
                } else {
                    resolve([])
                }
                
            })
            .catch(err => reject(err))      
    })
}

module.exports = {    
    findVenue,
    findSubscriberAndUpdate
}