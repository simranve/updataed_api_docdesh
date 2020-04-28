//require mongoose module
const mongoose = require('mongoose');
//require chalk module to give colors to console text
const chalk = require('chalk');
const connected = chalk.bold.cyan;
const error = chalk.bold.yellow;
const disconnected = chalk.bold.red;
const termination = chalk.bold.magenta;
const info = chalk.bold.blue;

var url = 'mongodb+srv://hippaDB:wFLUJkjfe2p2X7Hr@doctordesh-mhykh.mongodb.net/Hippa_app?retryWrites=true&w=majority';
// var url = `mongodb://127.0.0.1:27017/${process.env.MONGO_ATLAS_DB_NAME}`
//var url = `mongodb://127.0.0.1:27017/hippa_app`;
if (process.env.DB_TYPE === "atlas") {
  url = `mongodb+srv://${process.env.MONGO_ATLAS_USERNAME}:${process.env.MONGO_ATLAS_PASSWORD}@${process.env.MONGO_ATLAS_CLUSTER_NAME}.mongodb.net/${process.env.MONGO_ATLAS_DB_NAME}?retryWrites=true&w=majority`
}
console.log(url);
//require database URL from properties file
const dbURL = url;
console.log(info(`We are on ${process.env.DB_TYPE} mongo database :: ${dbURL}`));

//Options::
const options = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true,
  // autoIndex: false, // Don't build indexes
  // reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
  // reconnectInterval: 500, // Reconnect every 500ms
  poolSize: 20, // Maintain up to 10 socket connections
  // // If not connected, return errors immediately rather than waiting for reconnect
  // bufferMaxEntries: 0,
  // connectTimeoutMS: 10000, // Give up initial connection after 10 seconds
  socketTimeoutMS: 480000, // Close sockets after 45 seconds of inactivity
  // family: 4 // Use IPv4, skip trying IPv6
};


//export this function and imported by server.js
module.exports = function () {
  try {
    mongoose.connect(dbURL, options);

    mongoose.connection.on('connected', function () {
      console.log(connected("Mongoose default connection is open to ", dbURL));
    });

    mongoose.connection.on('error', function (err) {
      console.log(error("Mongoose default connection has occurred " + err + " error"));
    });

    mongoose.connection.on('disconnected', function () {
      console.log(disconnected("Mongoose default connection is disconnected"));
    });

    // Close mongoose connection on server termination
    process.on('SIGINT', function () {
      mongoose.connection.close(function () {
        console.log(termination("Mongoose default connection is disconnected due to application termination"));
        process.exit(0)
      });
    });
  } catch (err) {
    console.log("Critical Error! DB url is not provided. Please check environment file", err);
  }
}
