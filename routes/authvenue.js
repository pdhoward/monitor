const db  =                  require('../db')
const constants =            require('../config/constants')
const Logger =               require('../services/logger')

const logger = new Logger('auth')

//////////////////////////////////////////////////////
/////  validate signals against registered venues  //
////     capture and return registered profiles   //
///////////////////////////////////////////////////
const authvenue = (router) => {
    router.use(async(req, res, next) => {
      // confirm that the signal received has a gateway object      
      // scan array of signal objects
      let filterVenue = req.body.filter(u => {        
        if (u.type === 'Gateway') return true           
        return false 
      })
      if (filterVenue.length == 0) {        
        logger.info(`${Date.now()} Signal eliminated. No Gateway (venue) object detected. ${req.body} `)
        req.bag.venue = [] 
        return res.status(401).send(constants.ERR_BAD_GATEWAY)
      } 
      // check venue signal against venues registered in database machine/markets
      const venue = await db.findVenue(filterVenue).catch(err => new Error(err))
      
      if (venue instanceof Error) {        
          logger.info(`DB fetch for ${filterVenue[0].name} failed. No authorization `)
          req.bag.venue = []
          return res.status(401).send(constants.ERR_UNAUTHORIZED)
      } 
      if (venue.length == 0) {        
        logger.info(`Device for ${filterVenue[0].name} failed authorization `)
        req.bag.venue = []
        return res.status(401).send(constants.ERR_UNAUTHORIZED)
      } 
      logger.info(`Device for ${venue[0].name} successfully validated `)
      req.bag = {}
      req.bag.venue = venue
      next()
  })
}

module.exports = authvenue
