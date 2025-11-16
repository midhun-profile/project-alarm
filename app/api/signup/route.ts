import { NextResponse } from "next/server";
import { db } from "@/lib/firebaseClient"; // Firebase client SDK
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { uid, name, email, location, building, floor } = body;

    if (!uid || !email) {
      return NextResponse.json({ error: "UID and Email are required" }, { status: 400 });
    }

    // Save user data to Firestore using client SDK
    await setDoc(doc(db, "demologin", uid), {
      uid,
      name: name || "",
      email,
      location: location || "",
      building: building || "",
      floor: floor || "",
      createdAt: serverTimestamp(),
    });

    return NextResponse.json({ success: true, message: "User created successfully" });
  } catch (error: any) {
    console.error("Signup API error:", error);
    return NextResponse.json(
      { error: error.message || "An unknown error occurred" },
      { status: 500 }
    );
  }
}
