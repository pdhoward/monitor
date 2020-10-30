
const {redisevents} =           require('./redis')

////////////////////////////////////////////////////////////////
////////////////Register REDIS Events and Connect//////////////
//////////////////////////////////////////////////////////////

const events = () => {
  return new Promise(async (resolve, reject) => {
    let {pub, redis} = await redisevents()
    resolve({pub, redis}) 
  })  
}

module.exports = {
  events    
}