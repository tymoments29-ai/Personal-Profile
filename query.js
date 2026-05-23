const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const settings = await prisma.siteSettings.findFirst();
  console.log("URL:", settings?.profilePhotoUrl);
}
main().finally(() => prisma.$disconnect());
