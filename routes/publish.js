 
//////////////////////////////////////////////////////////////////////////
////////////  Event Registration for server, streams and db      ////////
////////////////////////////////////////////////////////////////////////

const util =                  require('util');
const {events} =              require('../events')
let pub
let redis

const createServers = () => {
  return new Promise(async (resolve, reject) => {
    const servers = await events()
    resolve(servers)
  })  
}

const startBroadcasts = async() => {
  const servers = await createServers()  
  pub = servers['pub']  
  redis = servers['redis']   
}

startBroadcasts()

const publish = (router) => {
    router.use(async(req, res, next) => {
        // req.body - array from BLE Gateway. req.bag - Venue profile
        let signalObj =  [...req.body, ...req.bag.venue, ...req.bag.subscribers] 
        pub.publish('signal', JSON.stringify(signalObj))
        res.end()       
  })
}

module.exports = publish
