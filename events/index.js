
const conn =                    require('../db')
const {redisevents} =           require('./redis')

////////////////////////////////////////////////////////////////
////////////////  Register Events and Connect    //////////////
//////////////////////////////////////////////////////////////

const events = () => {
  return new Promise(async (resolve, reject) => {
    let {pub, redis} = await redisevents()
    resolve({db, pub, redis}) 
  })  
}

module.exports = {
  events    
}