import { NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebaseAdmin";

export async function POST(req: Request) {
  try {
    const { token } = await req.json();

    if (!token) {
      return NextResponse.json(
        { error: "No token provided" },
        { status: 400 }
      );
    }

    // Verify Firebase ID Token using Admin SDK
    const decoded = await adminAuth.verifyIdToken(token);

    return NextResponse.json(
      {
        message: "Login successful",
        uid: decoded.uid,
        email: decoded.email,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Invalid token" },
      { status: 401 }
    );
  }
}