// api/googleLogin.js
import { auth, googleProvider } from "../lib/firebaseConfig";
import { signInWithPopup } from "firebase/auth";

export default async function loginWithGoogle() {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return { success: true, user: result.user };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
