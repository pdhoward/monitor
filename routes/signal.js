const db  =                  require('../db')
const constants =            require('../config/constants')
const Logger =               require('../services/logger')

const logger = new Logger('auth')

const signal = (router) => {
    router.use(async(req, res, next) => {
        count++
        console.log(`Signal number ${count} detected`)
        console.log(req.body)

        res.end()
  })
}

module.exports = signal
