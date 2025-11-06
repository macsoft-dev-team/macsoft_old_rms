// tools/hash-imei-passwords.js
// Usage: node tools/hash-imei-passwords.js 123456789012345 987654321098765 ...

const bcrypt = require('bcryptjs');

const imeisArg = process.argv.slice(2);
let imeis = [];

if (imeisArg.length === 0) {
  console.error('Usage: node tools/hash-imei-passwords.js <IMEI1> [<IMEI2> ...]');
  console.error('Or:    node tools/hash-imei-passwords.js <START_IMEI>');
  process.exit(1);
}

if (imeisArg.length === 1) {
  // Generate 10,000 consecutive IMEIs starting from the given number
  const start = imeisArg[0];
  if (!/^\d+$/.test(start)) {
    console.error('IMEI must be a numeric string.');
    process.exit(1);
  }
  let startNum = BigInt(start);
  for (let i = 0; i < 10000; i++) {
    imeis.push((startNum + BigInt(i)).toString());
  }
} else {
  imeis = imeisArg;
}

const saltRounds = 8;

(async () => {
  console.time('HashingTime');
  for (const imei of imeis) {
    const hash = await bcrypt.hash(imei, saltRounds);
  }
  console.timeEnd('HashingTime');
})();
