///////////////////////////////////////////////////////////////
////////  Proxy Server - Ingest Beacon Signals         ///////
//////            mainline processing                 ///////
////// c strategic machines 2020 all rights reserved ///////
///////////////////////////////////////////////////////////

const express =               require('express')
const path =                  require('path')
const util =                  require('util')
const { v4: uuidv4 } =        require('uuid');
const {events} =              require('../events')
const transport =             require('../config/gmail')
const { g, b, gr, r, y } =    require('../console');

const app = express()

const PORT = process.env.PORT || 3000;

////////////////////////////////////////
//////middleware and static routes/////
///////////////////////////////////////
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/', express.static(path.join(__dirname, '../public')))

const isDev = (app.get('env') === 'development');
console.log('isDev: ' + isDev);

/////////////////////////////////////////
///// alerts for platform errors ///////
///////////////////////////////////////

const handleErr = (err) => {
  console.log('uncaught exception')
  console.log(err)
}

const mailObject = {
  from: process.env.TRANSPORT_LABEL,
  to: process.env.TRANSPORT_RECEIVER,
  subject: 'Platform Error',
  text: ''
}
process.on('uncaughtException', function (er) {
    console.log("uncaught exception")
    console.error(er.stack)
    mailObject.text = er.stack;
    transport.sendMail(mailObject, function (er) {
       if (er) console.error(er)
       process.exit(1)
    })
  })

  
//////////////////////////////////////////////////////////////////////////
////////////  Event Registration for server, streams and db      ////////
////////////////////////////////////////////////////////////////////////
const createServers = () => {
  return new Promise(async (resolve, reject) => {
    const servers = await events()
    resolve(servers)
  })  
}

const startBroadcasts = async() => {
  const servers = await createServers()  
  const pub = servers['pub']  
  const redis = servers['redis'] 
  
  // monitor key channels
  redis.monitor().then(function (monitor) {
      monitor.on('monitor', function (time, args, source, database) {
        console.log(time + ": " + util.inspect(args));
      });
    });

  redis.subscribe('device', function (err, count) {
      console.log(`Currently tracking ${count} channels`)
  });

  redis.on('message', function (channel, msg) {        
    let msgObj = JSON.parse(msg)
    switch (msgObj.Context) {     
      case 'GeoFence':          
        console.log(`Channel: ${ channel } Message: ${msg}`);
        //db.collection('signals').insertOne(msgObj)
        break;
      default:
        console.log(`------No context detected-----`)    
    }
  });

  setInterval(() => {
    let msg = {}
    msg.UUID = uuidv4()
    msg.Context = "GeoFence" 
    msg.Timestamp = Date.now()
    msg.Body = `Discounts today only`
    pub.publish('device', JSON.stringify(msg))
  }, 2000)
  
}


 /////////////////////////////////////////////////
 ///// Register and Config Routes ///////////////
 ///////////////////////////////////////////////
 const auth =        express.Router({mergeParams: true})
 const signal =      express.Router({mergeParams: true})
 const test =        express.Router({mergeParams: true})
 
 require('../routes/auth')(auth)
 require('../routes/signal')(signal)
 require('../routes/test')(test)

/////////////////////////////////////
//////////    api routes   /////////
///////////////////////////////////

// Endpoint for testing route
app.get('/api/test', auth, test)

// Endpoint for signal detection
app.post("/api/signal", auth, signal)


///////////////////////////////////
///////     active servers ///////
/////////////////////////////////
startBroadcasts()

app.listen(PORT, () => console.log(g(`Listening on Port ${PORT}`)))

