
/**
 * Endpoint for testing api with auth
 * 
**/

const Logger =               require('../services/logger')

const logger = new Logger('auth')

const test = (router) => {  
    router.use(async(req, res, next) => {   
        logger.setLogData(req.bag.user)
        logger.info(`Successful Test of Auth API`)
        //res.status(200).send(req.bag.user)
        console.log(req.bag.user)
        next()
 })
}

module.exports = test
