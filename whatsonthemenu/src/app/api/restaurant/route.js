import { NextResponse } from "next/server";

export async function GET(request) {
  var data = await getData();
  return NextResponse.json({ message: 'Hello, World!' });
}

/*export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Receive small data from client
  const inputData = req.body;
  console.log(inputData)

  const largeData = [];

  // Send the large data back as JSON
  return res.status(200).json({ largeData });
}

/*export async function POST(request) {
  return new Response('Method POST Not Allowed', {
    status: 405,
    headers: {
      Allow: 'GET',
    },
  });
}

export async function PUT(request) {
  return new Response('Method PUT Not Allowed', {
    status: 405,
    headers: {
      Allow: 'GET',
    },
  });
}

export async function DELETE(request) {
  return new Response('Method DELETE Not Allowed', {
    status: 405,
    headers: {
      Allow: 'GET',
    },
  });
}
*/