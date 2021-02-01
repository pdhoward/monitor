
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


 
 
  
  
 

  
