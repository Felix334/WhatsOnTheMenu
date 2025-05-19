import { NextRequest, NextResponse } from "next/server";
import { getCookie } from "cookies-next";
import { PrismaClient } from "@prisma/client";
import { verify } from "jsonwebtoken";
import { NextApiRequest, NextApiResponse } from "next";

export default function handler(req, res) {
  const prisma = new PrismaClient();
  const {
    query: { id },
    method,
  } = req;

  switch (method) {
    case "GET":
      res.status(200).json({ restaurantId: id, menu: ["Pizza", "Pasta", "Salad"] });
      break;
    default:
      res.setHeader("Allow", ["GET"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
