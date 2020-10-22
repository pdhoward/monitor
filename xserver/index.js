
const express =               require('express')
const path =                  require('path')
const noble =                 require('noble');
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
 const test =        express.Router({mergeParams: true})
 
 require('../routes/auth')(auth)
 require('../routes/test')(test)

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
///////   active scanning  ///////
/////////////////////////////////

noble.on('stateChange', function(state) {
  if (state === 'poweredOn') {
    // Seek for peripherals broadcasting the heart rate service
    // This will pick up a Polar H7 and should pick up other ble heart rate bands
    // Will use whichever the first one discovered is if more than one are in range
    noble.startScanning(["180d"]);
  } else {
    noble.stopScanning();
  }
});

noble.on('discover', function(peripheral) {
  // Once peripheral is discovered, stop scanning
  noble.stopScanning();

  // connect to the heart rate sensor
  peripheral.connect(function(error){
    // 180d is the bluetooth service for heart rate:
    // https://developer.bluetooth.org/gatt/services/Pages/ServiceViewer.aspx?u=org.bluetooth.service.heart_rate.xml
    var serviceUUID = ["180d"];
    // 2a37 is the characteristic for heart rate measurement
    // https://developer.bluetooth.org/gatt/characteristics/Pages/CharacteristicViewer.aspx?u=org.bluetooth.characteristic.heart_rate_measurement.xml
    var characteristicUUID = ["2a37"];

    // use noble's discoverSomeServicesAndCharacteristics
    // scoped to the heart rate service and measurement characteristic
    peripheral.discoverSomeServicesAndCharacteristics(serviceUUID, characteristicUUID, function(error, services, characteristics){
      characteristics[0].notify(true, function(error){
        characteristics[0].on('data', function(data, isNotification){
          // Upon receiving data, output the BPM
          // The actual BPM data is stored in the 2nd bit in data (at array index 1)
          // Thanks Steve Daniel: http://www.raywenderlich.com/52080/introduction-core-bluetooth-building-heart-rate-monitor
          // Measurement docs here: https://developer.bluetooth.org/gatt/characteristics/Pages/CharacteristicViewer.aspx?u=org.bluetooth.characteristic.heart_rate_measurement.xml
          console.log('data is: ' + data[1]);
        });
      });
    });
  });
});


///////////////////////////////////
///////     active server  ///////
/////////////////////////////////
app.listen(PORT, () => console.log(g(`Listening on Port ${PORT}`)))

