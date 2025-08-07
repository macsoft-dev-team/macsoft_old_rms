let fs = require('fs');
let devices = {};
for (let i = 0; i < 50000; i++) {
    let key = `${1234567891234 + i}`;
    let index = Math.ceil(i / 1000);
    devices[key] = "deviceLog_" + index ;
}
let data = JSON.stringify(devices, null, 2);
fs.writeFileSync('devices.json', data, 'utf8');