import { NextResponse } from "next/server";

export async function DELETE(req, { params }) {
  const { id } = params; // Access dynamic params

  
  return NextResponse.json({ message: 'Item deleted successfully' });
}