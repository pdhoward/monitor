const db  =                  require('../db')
const constants =            require('../config/constants')
const Logger =               require('../services/logger')

const logger = new Logger('auth')

const auth = (router) => {
    router.use(async(req, res, next) => {
    // fake temporary password
    req.params.token = '$2a$08$.QIRzfcqphwVvNY3x1LzKu/7zEOadliaEDTQwrY7wMz2sgyQj1AqW'  
    const user = await db.findUser(req.params.token, res).catch(err => new Error(err))
    if (user instanceof Error) {
       // Adding body of the request as log data
        logger.setLogData(req.params)
        logger.info(`Token Failed Authorization `)
       
        return res.status(401).send(constants.ERR_UNAUTHORIZED)
    }
    logger.setLogData(user)
    logger.info(`Successful Login `)
    res.locals.user = user
    next()
  })
}

module.exports = auth
