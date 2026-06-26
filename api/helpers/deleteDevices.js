// deleteDevices.js

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function deleteDevices() {
    const deviceIds = [ 
        "cmmls75cl00bbqw2xec8ug02x"
    ];

    try {
        await prisma.$transaction(async (tx) => {
            // 1. Delete related commands first
            await tx.command.deleteMany({
                where: {
                    deviceId: {
                        in: deviceIds
                    }
                }
            });

            // 2. Delete devices
            await tx.device.deleteMany({
                where: {
                    id: {
                        in: deviceIds
                    }
                }
            });
        });

        console.log("✅ Devices deleted successfully");
    } catch (error) {
        console.error("❌ Error deleting devices:", error);
    } finally {
        await prisma.$disconnect();
    }
}

deleteDevices();