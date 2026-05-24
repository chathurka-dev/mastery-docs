import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const result = await prisma.user.updateMany({
  where: { email: "chinthaka.chathurka@gmail.com" },
  data: { emailVerified: true },
});

console.log("Updated:", result.count, "user(s)");
await prisma.$disconnect();
