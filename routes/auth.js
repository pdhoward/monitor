const db  =                  require('../db')
 const { g, b, gr, r, y } =  require('../console')

// const uri = process.env.ATLAS_CONFIGS
// const dbName = process.env.ATLAS_CONFIGS_DB
// const dbCollection = process.env.ATLAS_CONFIGS_COLLECTION

const auth = (router) => {
    router.use(async(req, res, next) => { 
       
    //const db = await conn(uri, dbName)  
    const user = await db.findUser(req.params.token).catch(err => new Error(err))
    if (user instanceof Error) {
        logger.printf("token %s was attempted to authorize but failed", req.params.token)
        return res.status(401).send(constants.ERR_UNAUTHORIZED)
    }

    logger.printf("authorized token %s to user %s", req.params.token, user.name)
    res.locals.user = user
    next()
  })
}

module.exports = auth
