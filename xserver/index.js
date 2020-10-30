///////////////////////////////////////////////////////////////
////////  Proxy Server - Ingest Beacon Signals         ///////
//////            mainline processing                 ///////
////// c strategic machines 2020 all rights reserved ///////
///////////////////////////////////////////////////////////

const express =               require('express')
const path =                  require('path')
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

 
 /////////////////////////////////////////////////
 ///// Register and Config Routes ///////////////
 ///////////////////////////////////////////////
 const auth =        express.Router({mergeParams: true})
 const signal =      express.Router({mergeParams: true})
 const publish =     express.Router({mergeParams: true})
 const test =        express.Router({mergeParams: true})
 
 require('../routes/auth')(auth)
 require('../routes/signal')(signal)
 require('../routes/publish')(publish)
 require('../routes/test')(test)

/////////////////////////////////////
//////////    api routes   /////////
///////////////////////////////////

// Endpoint for testing route
app.get('/api/test', auth, test)

// Endpoint for signal detection
app.post("/api/signal", auth, signal, publish)


///////////////////////////////////
///////     active servers ///////
/////////////////////////////////

app.listen(PORT, () => console.log(g(`Listening on Port ${PORT}`)))

