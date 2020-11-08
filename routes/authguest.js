const db  =                  require('../db')
const constants =            require('../config/constants')
const Logger =               require('../services/logger')

const logger = new Logger('auth')


// subscriber signals have an ibeacon uuid and is a type of ibeacon
const isSubscriberSignal = (obj, key, key2, value) => {
  return new Promise((resolve, reject) => {    
    let result = obj.hasOwnProperty(key) && (obj[key2] === value)
    resolve(result)
  }) 
}

//////////////////////////////////////////////////////
/////  validate signals against registered members //
////     capture and return registered profiles   //
///////////////////////////////////////////////////
const authguest = (router) => {
    router.use(async(req, res, next) => {
      
     // need to process each subscriber signal in array in sequence for db reads
    for (const a of req.body) {
      // subscriber signals have an ibeacon uuid and is a type of ibeacon
      let isSubscriberTag = await isSubscriberSignal(a, 'ibeaconUuid', 'type', 'iBeacon')
     
      if (isSubscriberTag) {
        // if is a subscriber tag, check to if it is registered to a subscriber
        const subscriber = await db.findSubscriberAndUpdate(a, req.bag.venue).catch(err => new Error(err))
       
        if (subscriber instanceof Error) {     
            logger.info(`ERROR - DB operation failed on subscriber retrievel with ${subscriber} `) 
            return
        }
        // valid tag and a registered subscriber
        if ((subscriber.length > 0) && (subscriber[0].uuid)) {    
         
          if (req.bag) {
            req.bag.subscriber = subscriber
          } else {
            req.bag = {}
            req.bag.subscriber = subscriber
          }
          logger.info(`Subscriber ${subscriber[0].name} successfully validated `)
          next()
        } else {
          logger.info(`Guest signal ${a} not authorized `)
          next()
        }
        
      }
    }
      
  })
}

module.exports = authguest
