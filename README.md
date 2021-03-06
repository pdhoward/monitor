# Monitor
Monitor bluetooth activated devices

## Features

## Getting Started

### Prerequisites


## Built With


## Modes


## LICENSE
MIT
* deployment notes

1. A load balancer may be required, in order handle ble gateways transmitting at 1 second cycles, and a node server ingesting and processing each of those http transactions

2. cache is used to ensure that a visitor is only tagged once every hour for an sms message from a venue. The size of cache may need to be recalibrated base don number of venues and traffic per node server

* Research

//Endpoint for getting a user's settings
app.get('/settings/get/:token', auth, routes.getAllSettings)

// Endpoint for getting a user's settings
app.get('/settings/get/:token/:setting', auth, routes.getSetting)

// Endpoint for updating a user's settings
app.get('/settings/set/:token/:setting/:value', auth, routes.setSettings)

// Endpoint for getting all of the open/close history
app.get('/history/all', routes.allHistory)

// Endpoint for getting a page of the open/close history
app.get('/history/:page/:token', auth, routes.history)

// Endpoint for manually adding history
app.get('/history/add/:token/:status', auth, routes.addHistory)

// Endpoint for getting the status of the garage door (true if closed, false if open)
app.get('/status/:token', auth, routes.status)

// Endpoint for updating the ip of the Pi to the requester's ip
app.get('/updateip/:token', auth, routes.updateIP)

// Endpoint for moving the garage (mode can be "move" or "open")
app.get('/:mode/:token', auth, routes.move)