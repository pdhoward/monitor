
const dayjs =               require('dayjs')
const utc =                 require('dayjs/plugin/utc')
const {dbProximity} =       require('../db')
const Logger =              require('../services/logger')
const { v4: uuidv4 } =      require('uuid')
const { g, b, gr, r, y } =  require('../console')

// websocketevents and redi events
const {wss} =               require('../events');
const {events} =            require('../events')

const logger = new Logger('auth')

dayjs.extend(utc)

////////////////redis intialization////////////

let pub
let redis

const createServers = () => {
  return new Promise(async (resolve, reject) => {
    const servers = await events()
    resolve(servers)
  })  
}
//////////////////////////////////////////

const init = () => {
  // select all grocery stores and super markets
  await dbProximity.db('proximity').collection('venues')
    .find({market: {$in: ['Grocery Stores', 'Supermarkets']}})
    .toArray()
    .then(data => {
      let newarray = data.map(d => d.marketid)
      venuearray = [...newarray]   
    })
  
}
if (dbProximity.isConnected()) {
  console.log(g(`DB Ready`))
  init();
} else {
  dbProximity.connect().then(function () {
    console.log(g(`Reconnect to DB`))
    init();
  });
}

const startReceiving = async() => {
    const servers = await createServers()  
    redis = servers['redis'] 
    pub = servers['pub'] 
    
    redis.subscribe('detect', function (err, count) {
        console.log(`Currently tracking ${count} channels`)
    });
  
    redis.on('message', async (channel, msg) => {
             
      let arr = JSON.parse(msg)
      let date = dayjs.utc(arr[0].timestamp)
  
      console.log(arr)
      
      let venues = arr.filter(u => {       
        if (u.type === 'Venue') return true           
        return false 
      })
      let subscribers = arr.filter(u => {       
        if (u.type === 'Subscriber') return true           
        return false 
      })
  
      const [venue = {name: 'Unknown Venue'}] = venues
  
      logger.info(`Received ${arr.length} signals from ${venue.name} on ${date}`) 
     
      pub.publish('signal', JSON.stringify(arr))

    //   for (const subscriber of subscribers) {
    //     // do something 
    //   }    

    })
  }

  
  const detect = (router) => {
      router.use(async(req, res, next) => {
         // subscribe and start detecting demo signals
          startReceiving()
          res.end()       
    })
  }

module.exports = detect


////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////

const util =                  require('util')
const dayjs =                 require('dayjs')
const utc =                   require('dayjs/plugin/utc')
const db  =                   require('../db')
const Logger =                require('../services/logger')
const {notify} =              require('../services/notifications.js')
const {events} =              require('../events')
const { g, b, gr, r, y } =    require('../console');

let redis

const logger = new Logger('auth')

dayjs.extend(utc)


const createServers = () => {
  return new Promise(async (resolve, reject) => {
    const servers = await events()
    resolve(servers)
  })  
}


/////////////////////////
const Cache =                require('lru-cache')
const Logger =               require('../services/logger')

const logger = new Logger('signal')

const cacheOptions = {
  max: 500,  
  //maxAge: 1000 * 3
  maxAge: 3000,
  updateAgeOnGet: true
}

const cache = new Cache(cacheOptions)

// eliminate duplicate objects in an array based on the key ibeaconUuid
const getUniqueSignals = (arr, key) => {
  if (Array.isArray(arr)) {
    return [...new Map(arr.map(item => [item[key], item])).values()]
    
  } else {
    console.log(`---type error in signal.js---`)
    console.log(arr)
    return []
  }
 
}

// return signals that have not been already detected within maxAge on cache
const getFilteredSignals = (arr) => {
  return new Promise((resolve, reject) => {    
    let filteredSignals = arr.filter(u => {
      // return venue signal in all instances
      if (u.type === 'Gateway') return true
      let key = u.ibeaconUuid
      let uuid  = cache.get(key) 
      // if not detected in cache, must be new - return this signal     
      if (!uuid) {   
        cache.set(key, u.ibeaconUuid)
        return true 
      } 
      return false      
    })    
    resolve(filteredSignals)
    
  })
}

let count = 0

const signal = (router) => {
    router.use(async(req, res, next) => {
        count++
        // periodically prune cache for expired signals 
        if (count % 20 == 0) cache.prune()
        console.log(`Signal number ${count} detected`)      
        let uniqueSignals = getUniqueSignals(req.body, 'ibeaconUuid')
        let filteredSignals = await getFilteredSignals(uniqueSignals) 
        // attach to req for publication
        console.log(filteredSignals)
        req.body = filteredSignals
        next()
  })
}

module.exports = signal

 
 
  
  
 

  
