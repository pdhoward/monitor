

/**
 * Endpoint for testing api with auth
 * 
**/

const test = (router) => {  
    router.use(async(req, res, next) => {   
        logger.printf("retrieving settings for %s", res.locals.user.name)
        res.status(200).send(res.locals.user)
 })
}

module.exports = test
