import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log("Seeding database...");

    // Find an existing user and service provider
    const user = await prisma.user.findFirst();
    const serviceProvider = await prisma.serviceProvider.findFirst();

    if (!user || !serviceProvider) {
        console.error("⚠️ No users or service providers found. Please add some before running this seed.");
        return;
    }

    // Insert Sample Messages
    await prisma.message.createMany({
        data: [
            {
                senderUserId: user.id,
                receiverProviderId: serviceProvider.id,
                content: "Hi, are you available for an oil change tomorrow?",
                sentAt: new Date(),
                read: false,
            },
            {
                senderProviderId: serviceProvider.id,
                receiverUserId: user.id,
                content: "Yes, we are available. Would you like to book a slot?",
                sentAt: new Date(),
                read: false,
            },
            {
                senderUserId: user.id,
                receiverProviderId: serviceProvider.id,
                content: "That would be great! Do you have a 10 AM slot?",
                sentAt: new Date(),
                read: false,
            },
            {
                senderProviderId: serviceProvider.id,
                receiverUserId: user.id,
                content: "Yes, 10 AM is available. See you then!",
                sentAt: new Date(),
                read: false,
            },
        ],
    });

    console.log("✅ Sample messages added!");
}

main()
    .catch((e) => {
        console.error("❌ Error seeding database:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
