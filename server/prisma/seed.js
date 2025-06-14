const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const fs = require("fs");
const path = require("path");

const transform = { id: "int", port: "int" };

function csvToJson(csvFilePath, jsonFilePath) {
  // Read CSV file
  const csvData = fs.readFileSync(csvFilePath, "utf8");

  // Split into rows
  const rows = csvData
    .split("\n")
    .map((row) => row.trim())
    .filter((row) => row);

  // Extract headers
  const headers = rows[0].split(",");

  // Convert rows to JSON
  const jsonArray = rows.slice(1).map((row) => {
    const values = row.split(",");
    let obj = {};
    headers.forEach((header, index) => {
      console.log(header);
      //transform based on header
      switch (transform[header]) {
        case "int":
          obj[header] = parseInt(values[index]?.trim());
          break;
        case "bool":
          obj[header] = Boolean(values[index]?.trim());
          break;
        default:
          obj[header] = values[index]?.trim();
          break;
      }

    });
    return obj;
  });

  // Save JSON file
  fs.writeFileSync(jsonFilePath, JSON.stringify(jsonArray, null, 2));
  console.log(`✅ JSON file saved as ${jsonFilePath}`);
}

async function main() {
  const files = ["MqttCredentials","User"]; // Add other model names as needed

  for (const file of files) {
    const csvpath = path.join(__dirname, `./data/${file}.csv`);
    const jsonPath = path.join(__dirname, `./data/${file}.json`);
    csvToJson(csvpath, jsonPath);
    console.log(jsonPath);
    if (fs.existsSync(jsonPath)) {
      try {
        const data = fs.readFileSync(jsonPath, "utf8");
        const json = JSON.parse(data);
        const model = prisma[file];
        console.log("file", file);
        for (const item of json) {
          const { id, ...rest } = item; // Extract id and the rest of the fields
          await model.upsert({
            where: { id },
            update: { ...rest },
            create: { id, ...rest },
          });
        }
      } catch (error) {
        console.error(`Error processing file ${file}.json:`, error);
      }
    } else {
      console.warn(`File ${file}.json not found.`);
    }
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
