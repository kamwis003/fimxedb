import { prisma } from '@/data/data-sources/postgresql/prisma-client'

export async function listProfiles() {
  return prisma.profile.findMany({
    orderBy: [{ createdAt: 'desc' }]
  })
}
