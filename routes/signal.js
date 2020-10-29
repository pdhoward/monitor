const Cache =                require('lru-cache')
const Logger =               require('../services/logger')
const { ConsoleTransportOptions } = require('winston/lib/winston/transports')

const logger = new Logger('auth')

const cacheOptions = {
  max: 500,  
  dispose: function (key, n) {
    console.log(`${key} disposed`)
    n.close() }, // auto close based on max age
  maxAge: 1000 * 60 * 60,
  updateAgeOnGet: true
}

const cache = new Cache(cacheOptions)

// eliminate duplicate objects in an array based on the key ibeaconUuid
const getUniqueSignals = (arr, key) => {
  return [...new Map(arr.map(item => [item[key], item])).values()]
}

// return signals that have not been already detected in last hour
const getFilteredSignals = (arr) => {
  return new Promise((resolve, reject) => {
    let filteredArray = arr.filter(async (u) => {      
      let key = u.ibeaconUuid
      let uuid  = await cache.get(key)      
      if (!uuid) {        
        await cache.set(key, u.ibeaconUuid)                 
      }
      if (u.type === 'Gateway' || !uuid) return true
    })    
    resolve(filteredArray)
  })
}

let count = 0

const signal = (router) => {
    router.use(async(req, res, next) => {
        count++
        console.log(`Signal number ${count} detected`)      
        let uniqueSignals = getUniqueSignals(req.body, 'ibeaconUuid')
        let filteredSignals = await getFilteredSignals(uniqueSignals)
        console.log(filteredSignals)  
        console.log(`----------iteration complete -- logging cache------`)
        cache.forEach((value, key) => console.log(key, value))
        res.end() 
  })
}

module.exports = signal
