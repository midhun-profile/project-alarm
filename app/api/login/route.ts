import { NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebaseAdmin";

// export async function POST(req: Request) {
//   try {
//     const { token } = await req.json();

//     if (!token) return NextResponse.json({ error: "No token provided" }, { status: 400 });

//     const decoded = await adminAuth.verifyIdToken(token);

//     return NextResponse.json({
//       message: "Login successful",
//       uid: decoded.uid,
//       email: decoded.email,
//     });
//   } catch (err: any) {
//     console.error(err);
//     return NextResponse.json({ error: "Invalid token" }, { status: 401 });
//   }
// }

// api/login.js
import { auth } from "../../../lib/firebaseClient";
import { signInWithEmailAndPassword } from "firebase/auth";

export default async function loginUser(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { success: true, user: userCredential.user };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
