import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const settings = await prisma.siteSettings.findFirst()
  console.log('--- Site Settings ---')
  console.log('nameEn:', settings?.nameEn)
  console.log('nameId:', settings?.nameId)
  console.log('aboutTextEn:', settings?.aboutTextEn ? settings.aboutTextEn.substring(0, 50) + '...' : null)
  console.log('aboutTextId:', settings?.aboutTextId ? settings.aboutTextId.substring(0, 50) + '...' : null)

  const projects = await prisma.portfolioProject.findMany({ take: 1 })
  console.log('\n--- First Project ---')
  if (projects.length > 0) {
    console.log('title:', projects[0].title)
    console.log('descriptionEn:', projects[0].descriptionEn)
    console.log('descriptionId:', projects[0].descriptionId)
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
