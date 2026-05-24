// app/api/sort/route.js

import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { NextResponse } from "next/server"

export async function PATCH(req) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { groups, categories } = await req.json()

  await prisma.$transaction([
    ...groups.map((g) =>
      prisma.categoryGroup.update({ where: { id: g.id }, data: { position: g.position } })
    ),
    ...categories.map((c) =>
      prisma.category.update({ where: { id: c.id }, data: { position: c.position } })
    ),
  ])

  return NextResponse.json({ success: true })
}