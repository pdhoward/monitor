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
    let subscriberArray = []
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
         
          subscriberArray.push(subscriber)
          logger.info(`Subscriber ${subscriber[0].name} successfully validated `)
          
        } else {
          logger.info(`Guest signal ${a} not authorized `)
          
        }
        
      }
    }
    if (req.bag) {
      req.bag.subscribers = subscriberArray
    } else {
      req.bag = {}
      req.bag.subscribers = subscriberArray
    }
    next()
      
  })
}

module.exports = authguest
