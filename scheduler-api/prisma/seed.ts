import {PrismaClient, Role} from "@prisma/client";
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function seedUsers() {
    await prisma.user.upsert({
        where: {
            email: "admin@hubbyscheduler.com"
        },
        update: {},
        create: {
            email: "admin@hubbyscheduler.com",
            password: bcrypt.hashSync("admin", 10),
            role: Role.ADMIN,
            firstName: "Admin",
            lastName: "Person",
            phoneNumber: "111-111-1111",
            imageUrl: "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg",
            portalId: 42762659, // TODO: CHANGE ME IF YOU WANT TO USE THIS SEED
        },
    });

    await prisma.user.upsert({
        where: {
            email: "staff@hubbyscheduler.com"
        },
        update: {},
        create: {
            email: "staff@hubbyscheduler.com",
            password: bcrypt.hashSync("staff", 10),
            role: Role.STAFF,
            firstName: "Staff",
            lastName: "Person",
            phoneNumber: "222-222-2222",
            imageUrl: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg",
            portalId: 42762659, // TODO: CHANGE ME IF YOU WANT TO USE THIS SEED
        },
    });
}

async function seedTechs() {
    await prisma.serviceTechnician.upsert({
        where: {
            email: "frank.smith@hubbyscheduler.com"
        },
        update: {},
        create: {
            email: "frank.smith@hubbyscheduler.com",
            firstName: "Frank",
            lastName: "Smith",
            imageUrl: "https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg",
            workingHours: {
                create: [
                    {
                        day: "MONDAY",
                        startHour: new Date("2000-01-01T08:00:00Z"),
                        endHour: new Date("2000-01-01T17:00:00Z"),
                    },
                    {
                        day: "TUESDAY",
                        startHour: new Date("2000-01-01T08:00:00Z"),
                        endHour: new Date("2000-01-01T17:00:00Z"),
                    },
                    {
                        day: "WEDNESDAY",
                        startHour: new Date("2000-01-01T08:00:00Z"),
                        endHour: new Date("2000-01-01T17:00:00Z"),
                    },
                    {
                        day: "THURSDAY",
                        startHour: new Date("2000-01-01T08:00:00Z"),
                        endHour: new Date("2000-01-01T17:00:00Z"),
                    },
                    {
                        day: "FRIDAY",
                        startHour: new Date("2000-01-01T08:00:00Z"),
                        endHour: new Date("2000-01-01T17:00:00Z"),
                    }
                ]
            }
        }
    });

    await prisma.serviceTechnician.upsert({
        where: {
            email: "anya.westley@hubbyscheduler.com"
        },
        update: {},
        create: {
            email: "anya.westley@hubbyscheduler.com",
            firstName: "Anya",
            lastName: "Westley",
            imageUrl: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg",
            workingHours: {
                create: [
                    {
                        day: "WEDNESDAY",
                        startHour: new Date("2000-01-01T08:00:00Z"),
                        endHour: new Date("2000-01-01T17:00:00Z"),
                    },
                    {
                        day: "THURSDAY",
                        startHour: new Date("2000-01-01T08:00:00Z"),
                        endHour: new Date("2000-01-01T17:00:00Z"),
                    },
                    {
                        day: "FRIDAY",
                        startHour: new Date("2000-01-01T08:00:00Z"),
                        endHour: new Date("2000-01-01T17:00:00Z"),
                    },
                    {
                        day: "SATURDAY",
                        startHour: new Date("2000-01-01T08:00:00Z"),
                        endHour: new Date("2000-01-01T17:00:00Z"),
                    },
                    {
                        day: "SUNDAY",
                        startHour: new Date("2000-01-01T08:00:00Z"),
                        endHour: new Date("2000-01-01T17:00:00Z"),
                    }
                ]
            }
        }
    });
}

async function main() {
    await seedUsers();
    await seedTechs();
}


main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        // close Prisma Client at the end
        await prisma.$disconnect();
    });
