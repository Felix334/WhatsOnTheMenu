// pages/api/auth/google.js
import { OAuth2Client } from 'google-auth-library';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { token } = req.body;
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    
    const payload = ticket.getPayload();
    const userId = payload['sub'];
    
    // Here you would typically:
    // 1. Check if user exists in your DB
    // 2. Create new user if not exists
    // 3. Create session/JWT and return to client
    
    res.status(200).json({ 
      success: true,
      user: {
        id: userId,
        name: payload.name,
        email: payload.email,
        picture: payload.picture
      }
    });
    
  } catch (error) {
    console.error('Google auth error:', error);
    res.status(401).json({ success: false, message: 'Authentication failed' });
  }
}
