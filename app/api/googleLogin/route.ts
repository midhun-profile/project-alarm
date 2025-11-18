// /app/api/googleLogin/route.ts
import { NextResponse } from "next/server";
import admin from "firebase-admin";

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  });
}

export async function POST(req: Request) {
  try {
    const { idToken } = await req.json();

    if (!idToken) {
      return NextResponse.json({ error: "No token provided" }, { status: 400 });
    }

    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const { uid } = decodedToken;

    return NextResponse.json({ uid }, { status: 200 });
  } catch (error) {
    console.error("Google login error:", error);
    return NextResponse.json({ error: "Google login failed" }, { status: 500 });
  }
}
