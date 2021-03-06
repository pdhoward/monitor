
//////////////////////////////////////////////////////
////////   mongoDB connection manager         ///////
////////////////////////////////////////////////////

const MongoClient =       require('mongodb').MongoClient;
const Cache =             require('lru-cache')

const dbOptions = {
  	poolSize: 10, // Maintain up to x socket connections        
    useNewUrlParser: true,
    useUnifiedTopology: true }

const cacheOptions = {
    max: 500,
    length: function (n, key) { return n * 2 + key.length },
    dispose: function (key, n) {
      console.log(`${key} connection closed`)
      n.close() }, // auto close based on max age
    maxAge: 1000 * 60 * 10,
    updateAgeOnGet: true
}

const cache = new Cache(cacheOptions)

const log = console

module.exports = (url, dbName) => {

  return new Promise(async (resolve, reject) => {
        
      const api = url;  // dbname embedded in Atlas uri
      let conn;
      conn = await cache.get(api)  

      // if connection is in cache, will reuse it, otherwise create it
      if (conn) {
        log.info('Reusing existing MongoDB connection')
        // create db connection and return
        let db = conn.db(dbName)
        resolve(db)                 
      }
      else {
        log.info('creating new connection for ' + api);
        const conn = new MongoClient(api, dbOptions);

        conn.connect(async(err) => {
          if (err) reject(err)
          log.info('MongoDB server connection live')
          await cache.set(api, conn) 
          // create db connection and return
          let db = conn.db(dbName)
          resolve(db)         
        })
    }
  })
}
