const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();


async function seedFromFile(modelName, fileName) {
  const data = JSON.parse(fs.readFileSync(path.join(__dirname, 'sampledata', fileName), 'utf8'));
  for (const item of data) {
    await prisma[modelName].upsert({
      where: { id: item.id },
      update: item,
      create: item,
    });
  }
}

async function main() {
  // List of [model, file] pairs to seed
  const seeds = [
    ["customer", "customer.json"],
    ["user", "user.json"],
    ["device", "device.json"],
    /*   ["command", "command.json"],
     */
  ];
  for (const [model, file] of seeds) {
    await seedFromFile(model, file);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
