
////////////////////////////////////////////////////////
/////             Custom Log Handler               ////
/////     Record Progress in Conversations        ////
/////     turns, ambiguities, ellipses, training ////
////////////////////////////////////////////////////
const moment =              require('moment-timezone')
const winston =             require('winston')
const { g, b, gr, r, y } =  require('../console')

const date = () => {
 return new Date(Date.now()).toLocaleString()
}

class Logger {
    constructor(route) {
        this.log_data = null
        this.route = route
        this.time = time = moment().tz("America/New_York").format("lll")
        const logger = winston.createLogger({

            transports: [
                new winston.transports.Console(),
                new winston.transports.File({
                filename: `./logs/${route}.log`
            })],

            format: winston.format.printf((info) => {
                let message = `${date()} | ${info.level.toUpperCase()} | ${info.message} | `
                message = info.obj ? message + `${JSON.stringify(info.obj)} | ` : message
                message = this.log_data ? message + `${JSON.stringify(this.log_data)} | ` : message
                return gr(message)
                })
        });

        this.logger = logger
    }
    setLogData(log_data) {
        this.log_data = log_data }

    async info(message) {
        this.logger.log('info', message); }

    async info(message, obj) {
        this.logger.log('info', message, { obj })}

    async debug(message) {
        this.logger.log('debug', message);}

    async debug(message, obj) {
        this.logger.log('debug', message, { obj }) }

    async error(message) { 
        this.logger.log('error', message) }

    async error(message, obj) {
        this.logger.log('error', message, { obj })
    }
}
module.exports = Logger