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
        req.body = filteredSignals
        next()
  })
}

module.exports = signal
