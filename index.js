
const express =               require('express')
const path =                  require('path')
const transport =             require('../config/gmail')
const { g, b, gr, r, y } =    require('../console');

const app = express()

const PORT = process.env.PORT || 3000;
const data = [
  {
    message: "Life is good"
  }
]

////////////////////////////////////////
//////middleware and static routes/////
///////////////////////////////////////
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/', express.static(path.join(__dirname, 'public')))

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
 const auth =                express.Router({mergeParams: true})
 
 require('../routes/auth')(auth)
 

/////////////////////////////////////
//////////    api routes   /////////
///////////////////////////////////
// Endpoint for testing route
app.get('/api/test', auth, test)

// Endpoint for getting a user's settings
// app.get('/settings/get/:token', auth, routes.getAllSettings)

// // Endpoint for getting a user's settings
// app.get('/settings/get/:token/:setting', auth, routes.getSetting)

// // Endpoint for updating a user's settings
// app.get('/settings/set/:token/:setting/:value', auth, routes.setSettings)

// // Endpoint for getting all of the open/close history
// app.get('/history/all', routes.allHistory)

// // Endpoint for getting a page of the open/close history
// app.get('/history/:page/:token', auth, routes.history)

// // Endpoint for manually adding history
// app.get('/history/add/:token/:status', auth, routes.addHistory)

// // Endpoint for getting the status of the garage door (true if closed, false if open)
// app.get('/status/:token', auth, routes.status)

// // Endpoint for updating the ip of the Pi to the requester's ip
// app.get('/updateip/:token', auth, routes.updateIP)

// // Endpoint for moving the garage (mode can be "move" or "open")
// app.get('/:mode/:token', auth, routes.move)

///////////////////////////////////
///////     active server  ///////
/////////////////////////////////
const server = app.listen(4055, function () {
  console.log(`Listening on port ${server.address().port}`)
})
