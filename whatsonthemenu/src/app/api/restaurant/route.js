import { NextResponse } from "next/server";

export async function GET(request) {
  return NextResponse.json({ message: 'Hello, World!' });
}

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  // Receive small data from client
  const inputData = req.body;
  console.log(inputData)
  // Log or process inputData if needed (for example purposes, we'll ignore)

  // Generate large data to return - for example, large array of objects
  const largeData = [];
  for (let i = 0; i < 10000; i++) {
    largeData.push({
      id: i + 1,
      name: `Item ${i + 1}`,
      description: `This is a description for item number ${i + 1}.`,
      extraData: "Lorem ipsum dolor sit amet, consectetur adipiscing elit."
    });
  }

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
}*/

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
