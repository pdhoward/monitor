const db  =                  require('../db')
const constants =            require('../config/constants')
const Logger =               require('../services/logger')

const logger = new Logger('auth')

const getUniqueSignals = (arr, key) => {
  return [...new Map(arr.map(item => [item[key], item])).values()]
}

let count = 0

const signal = (router) => {
    router.use(async(req, res, next) => {
        count++
        console.log(`Signal number ${count} detected`)
        let uniqueSignals = getUniqueSignals(req.body, 'ibeaconUuid')
        //console.log(req.body)
        console.log(uniqueSignals)

        res.end()
  })
}

module.exports = signal
