import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

const seedDatabase = async () => {
  console.log("SEED");
  try {
    // Seed Users
    for (let i = 0; i < 10; i++) {
      await prisma.user.create({
        data: {
          username: faker.internet.userName(),
        },
      });
    }

    // Seed Courses and CourseSections
    for (let i = 0; i < 5; i++) {
      const course = await prisma.course.create({
        data: {
          courseTitle: faker.lorem.word(),
          subject: faker.lorem.word(),
        },
      });

      for (let j = 0; j < 3; j++) {
        const { startTime, endTime } = generateRandomTime();
        await prisma.courseSection.create({
          data: {
            courseId: course.id,
            startTime,
            endTime,
          },
        });
      }
    }

    console.log("Seed data inserted successfully.");
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    await prisma.$disconnect();
  }
};

seedDatabase();

function generateRandomTime() {
  const startHour = faker.datatype.number({ min: 9, max: 16 }); // 9 AM to 4 PM (24-hour format)
  const startMinute = faker.datatype.number({ min: 0, max: 59 });
  const startTime = new Date();
  startTime.setHours(startHour);
  startTime.setMinutes(startMinute);

  const endTime = new Date(startTime);
  endTime.setHours(startTime.getHours() + 1);

  return {
    startTime,
    endTime,
  };
}
