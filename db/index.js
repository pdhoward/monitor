const conn =                require('../db/connections')
const { g, b, gr, r, y } =  require('../console')

// env variables for auth db and subscribers
const authUri = process.env.ATLAS_AUTH
const authCollection = process.env.ATLAS_AUTH_SUBSCRIBERS
const authDb = process.env.ATLAS_AUTH_DB
// env variables for proximity db and collections
const proximityurl = process.env.ATLAS_PROXIMITY_URI
const proximityDb = process.env.ATLAS_PROXIMITY_DB
const proximityVenues = process.env.ATLAS_PROXIMITY_MARKETS
const proximitySubscribers = process.env.ATLAS_PROXIMITY_SUBSCRIBERS
const proximityActiveTags = process.env.ATLAS_PROXIMITY_ACTIVETAGS
/**
 * Search the database for a venue
 * @param {String} token The user's access token
 */


const findVenue = (venue) => {
    return new Promise(async (resolve, reject) => {
        const db = await conn(proximityurl, proximityDb)
        
        let token = 'unknown'
        // find mac and validate against registered venue device
        // returns an empty array if venue not in db
        if (venue){token = venue[0].mac}   
        db.collection(proximityVenues)
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

const findActiveTags = (venue) => {
    return new Promise(async (resolve, reject) => {  
        const db = await conn(proximityurl, proximityDb)        
        let marketid = venue[0].marketid
        let marketstamp = Date.now()
        
        db.collection(proximityActiveTags)
            .find({marketid: marketid })
            .toArray()
            .then((result) => {                 
                resolve(result)
            })
            .catch(err => reject(err))       
    })
}

module.exports = {    
    findVenue,
    findSubscriberAndUpdate,
    findActiveTags
}

////
//////////////////////////////////////////

// const init = async() => {
//   // select all grocery stores and super markets
//   await dbProximity.db('proximity').collection('venues')
//     .find({market: {$in: ['Grocery Stores', 'Supermarkets']}})
//     .toArray()
//     .then(data => {
//       let newarray = data.map(d => d.marketid)
//       venuearray = [...newarray]   
//     })  
// }

// if (dbProximity.isConnected()) {
//   console.log(g(`DB Ready`))
//   init();
// } else {
//   dbProximity.connect().then(function () {
//     console.log(g(`Reconnect to DB`))
//     init();
//   });
// }