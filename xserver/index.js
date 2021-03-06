///////////////////////////////////////////////////////////////
////////  Proxy Server - Ingest Beacon Signals         ///////
//////            mainline processing                 ///////
////// c strategic machines 2020 all rights reserved ///////
///////////////////////////////////////////////////////////

const express =               require('express')
const { createServer } =      require('http')
const path =                  require('path')
const transport =             require('../config/gmail')
const { g, b, gr, r, y } =    require('../console');

const app = express()
const server = createServer(app)

const PORT = process.env.PORT || 4000;

////////////////////////////////////////
//////middleware and static routes/////
///////////////////////////////////////
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/', express.static(path.join(__dirname, '../public')))

const isDev = (app.get('env') === 'development');
console.log('isDev: ' + isDev);


//////////////////////////////////////////////////////////////////
////////////  Event Registration for streams and db      ////////
////////////////////////////////////////////////////////////////

const {wss} = require('../events');

server.on('upgrade', (request, socket, head) => {
    wss.handleUpgrade(request, socket, head, (socket) => {
        wss.emit('connection', socket, request);
    });     
})

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
 
 /////////////////////////////////////////////////
 ///// Register and Config Routes ///////////////
 ///////////////////////////////////////////////
 const about =       express.Router()
 const header =      express.Router()
 const authvenue =   express.Router({mergeParams: true})
 const authguest =   express.Router({mergeParams: true})
 const signal =      express.Router({mergeParams: true})
 const publish =     express.Router({mergeParams: true})
 const detect =      express.Router()
 const test =        express.Router({mergeParams: true})
 
 require('../routes/about')(about)
 require('../routes/header')(header)
 require('../routes/authvenue')(authvenue)
 require('../routes/authguest')(authguest)
 require('../routes/signal')(signal)
 require('../routes/publish')(publish)
 require('../routes/detect')(detect)
 require('../routes/test')(test)

/////////////////////////////////////
//////////    api routes   /////////
///////////////////////////////////

app.use(header)
app.get('/about', about)

// endpoint for signal emulations. trigger from homepage
app.get('/detect', [detect])

// Endpoint for testing route
app.get('/api/test', authvenue, test)

// Endpoint for BLE signal detection - filter all dups and noise then proceed
// received from the gateway deviced installed in a venue
app.post("/api/signal", [signal, authvenue, authguest, publish])

///////////////////////////////////
///////     active servers ///////
/////////////////////////////////

server.listen(PORT, () => console.log(g(`Listening on Port ${PORT}`)))

