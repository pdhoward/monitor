const db  =                  require('../db')
const constants =            require('../config/constants')
const Logger =               require('../services/logger')

const logger = new Logger('auth')

//////////////////////////////////////////////////////
/////  validate signals against registered venues  //
////     capture and return registered profiles   //
///////////////////////////////////////////////////
const auth = (router) => {
    router.use(async(req, res, next) => {
      // confirm that the signal received has a gateway object      
      // scan array of signal objects
      let filterVenue = req.body.filter(u => {
        // find and return venue signal
        if (u.type === 'Gateway') return true           
        return false 
      })
      // check venue signal against venues registered in database machine/markets
      const venue = await db.findVenue(filterVenue).catch(err => new Error(err))
      if (venue instanceof Error) {
        // Adding body of the request as log data
          logger.setLogData(req.params)
          logger.info(`Token Failed Authorization `) 
          return res.status(401).send(constants.ERR_UNAUTHORIZED)
      } 
      logger.info(`Device for ${venue[0].name} successfully validated `)
      req.bag = {}
      req.bag.venue = venue
      next()
  })
}

module.exports = auth
