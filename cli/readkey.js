let fs = require("fs");
//get cli parameters
let params = process.argv.slice(2);
//read the file
let devices = JSON.parse(fs.readFileSync("devices.json", "utf8"));
//find the device with the given key
let key = params[0];
if (devices[key]) {
  //if the device exists, write the log to the file
  let log = devices[key];
  console.log(`Value for device is ${log}.`);
}