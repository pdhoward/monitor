const Cache =                require('lru-cache')
const db  =                  require('../db')
const constants =            require('../config/constants')
const Logger =               require('../services/logger')

const logger = new Logger('auth')

const cacheOptions = {
  max: 500,
  length: function (n, key) { return n * 2 + key.length },
  dispose: function (key, n) {
    console.log(`${key} connection closed`)
    n.close() }, // auto close based on max age
  maxAge: 1000 * 60,
  updateAgeOnGet: true
}

const cache = new Cache(cacheOptions)

// eliminate duplicate objects in an array based on the key ibeaconUuid
const getUniqueSignals = (arr, key) => {
  return [...new Map(arr.map(item => [item[key], item])).values()]
}

let count = 0

const signal = (router) => {
    router.use(async(req, res, next) => {
        count++
        console.log(`Signal number ${count} detected`)
        let uniqueSignals = getUniqueSignals(req.body, 'ibeaconUuid')        
        console.log(uniqueSignals)

        res.end()
  })
}

module.exports = signal
