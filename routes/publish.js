 
//////////////////////////////////////////////////////////////////////////
////////////  Event Registration for server, streams and db      ////////
////////////////////////////////////////////////////////////////////////
const { emitWarning } = require('process');
const util =                  require('util')
const { v4: uuidv4 } =        require('uuid');
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
  
  // monitor key channels
  redis.monitor().then(function (monitor) {
      monitor.on('monitor', function (time, args, source, database) {
        console.log(time + ": " + util.inspect(args));
      });
    });

  redis.subscribe('signal', function (err, count) {
      console.log(`Currently tracking ${count} channels`)
  });

  redis.on('message', function (channel, msg) {        
    let arr = JSON.parse(msg)
            
    console.log(`Channel: ${ channel } Message: ${arr}`);
       
  });  
}
startBroadcasts()

const publish = (router) => {
    router.use(async(req, res, next) => {
        console.log(`-----------debug mode --------------`)
        console.log(req.body)
        pub.publish('signal', JSON.stringify(req.body))

        res.end()       
  })
}

module.exports = publish
