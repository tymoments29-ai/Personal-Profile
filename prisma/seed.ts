/**
 * Seed script: Creates the initial admin user and site settings
 * Run with: npx tsx prisma/seed.ts
 */

import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...\n')

  // ── 1. Create Admin User ──────────────────────────────
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@portfolio.local'
  const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@1234!'
  const adminName = 'Sukristiyo'

  const existingUser = await prisma.user.findUnique({ where: { email: adminEmail } })

  if (!existingUser) {
    const hashedPassword = await bcrypt.hash(adminPassword, 12)
    await prisma.user.create({
      data: {
        email: adminEmail,
        password: hashedPassword,
        name: adminName,
      },
    })
    console.log(`✅ Admin user created: ${adminEmail}`)
    console.log(`   Password: ${adminPassword}`)
    console.log(`   ⚠️  Change this password after first login!\n`)
  } else {
    console.log(`ℹ️  Admin user already exists: ${adminEmail}\n`)
  }

  // ── 2. Create Site Settings ───────────────────────────
  const existingSettings = await prisma.siteSettings.findFirst()

  if (!existingSettings) {
    await prisma.siteSettings.create({
      data: {
        nameEn: 'Sukristiyo',
        nameId: 'Sukristiyo',
        subtitleEn: 'DevOps · SRE · Cloud Engineer · Data Center',
        subtitleId: 'DevOps · SRE · Cloud Engineer · Data Center',
        aboutTextEn: `I'm a dedicated IT professional specializing in DevOps, Site Reliability Engineering (SRE), and Cloud Infrastructure. With hands-on experience managing enterprise-grade data centers and cloud environments, I bridge the gap between development and operations to deliver reliable, scalable, and secure systems.`,
        aboutTextId: `Saya adalah profesional IT yang berdedikasi dengan spesialisasi di bidang DevOps, Site Reliability Engineering (SRE), dan Infrastruktur Cloud. Dengan pengalaman langsung mengelola pusat data dan lingkungan cloud skala enterprise, saya menjembatani kesenjangan antara pengembangan dan operasi untuk menghadirkan sistem yang andal, skalabel, dan aman.`,
        email: 'sukrisstiyo29@gmail.com',
        phone: '+62 821-7016-7025',
        birthDate: 'September 26, 1999',
        location: 'Jakarta, Indonesia',
        githubUrl: 'https://github.com/sukristiyo',
        linkedinUrl: 'https://linkedin.com/in/sukristiyo',
      },
    })
    console.log('✅ Site settings initialized\n')
  } else {
    console.log('ℹ️  Site settings already exist\n')
  }

  // ── 3. Seed Resume Education ──────────────────────────
  const educationCount = await prisma.resumeEducation.count()

  if (educationCount === 0) {
    await prisma.resumeEducation.createMany({
      data: [
        {
          institution: 'State Polytechnic of Batam',
          degree: 'Professional Course',
          field: 'DevSecOps Engineering',
          startYear: 2023,
          endYear: 2023,
          descriptionEn: 'Intensive DevSecOps training covering CI/CD pipelines, container security, and cloud-native security practices.',
          order: 1,
        },
        {
          institution: 'State Polytechnic of Batam',
          degree: 'Diploma (D3)',
          field: 'Informatics Engineering',
          startYear: 2018,
          endYear: 2021,
          descriptionEn: 'Focused on software engineering, networking fundamentals, and system administration.',
          order: 2,
        },
        {
          institution: 'SMK Negeri 2 Pekanbaru',
          degree: 'Vocational High School',
          field: 'Computer and Network Engineering',
          startYear: 2015,
          endYear: 2018,
          descriptionEn: 'Specialized in computer hardware, network infrastructure, and basic programming.',
          order: 3,
        },
      ],
    })
    console.log('✅ Resume education seeded (3 entries)\n')
  } else {
    console.log('ℹ️  Resume education already seeded\n')
  }

  // ── 4. Seed Resume Experience ─────────────────────────
  const experienceCount = await prisma.resumeExperience.count()

  if (experienceCount === 0) {
    await prisma.resumeExperience.createMany({
      data: [
        {
          company: 'PT. Tunas Ridean Tbk. (Tunas Group)',
          position: 'IT Lead Data Center & Database Administrator',
          startDate: 'Jan 2022',
          endDate: 'Present',
          descriptionEn: 'Lead the enterprise data center operations and database administration for one of Indonesia\'s largest automotive groups, managing critical infrastructure across multiple business units.',
          descriptionId: 'Memimpin operasional pusat data enterprise dan administrasi basis data untuk salah satu grup otomotif terbesar di Indonesia, mengelola infrastruktur kritis di berbagai unit bisnis.',
          responsibilities: [
            'Architect and manage AWS cloud infrastructure including EC2, S3, RDS, and VPC configurations',
            'Administer on-premise virtualization platform using Nutanix AHV and VMware vSphere',
            'Manage Carbonio Mail Server for enterprise email communication (5,000+ users)',
            'Configure and maintain Active Directory and Group Policy for domain management',
            'Implement backup and disaster recovery solutions using Veeam Backup & Replication',
            'Monitor and optimize SQL Server and PostgreSQL database performance',
            'Lead infrastructure security audits and vulnerability assessments',
            'Coordinate IT operations across Tunas Toyota, Tunas Daihatsu, and Tunas BMW dealerships',
          ],
          order: 1,
        },
      ],
    })
    console.log('✅ Resume experience seeded (1 entry)\n')
  } else {
    console.log('ℹ️  Resume experience already seeded\n')
  }

  console.log('🎉 Database seed completed successfully!')
  console.log('\nNext steps:')
  console.log('  1. Copy .env.example to .env.local')
  console.log('  2. Fill in your Neon DATABASE_URL and DIRECT_URL')
  console.log('  3. Run: npx prisma migrate dev --name init')
  console.log('  4. Run: npx tsx prisma/seed.ts')
  console.log('  5. Run: npm run dev')
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
