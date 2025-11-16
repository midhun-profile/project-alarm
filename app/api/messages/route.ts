import { db } from "@/lib/firebaseClient";
import { doc, getDoc } from "firebase/firestore";

export async function GET() {
  try {
       const docRef = doc(db, 'VishalBuildingDB', 'alarmMessage');
      const docSnap = await getDoc(docRef);

    //   if (docSnap.exists()) {
    //     setMessages([docSnap.data()]);
    //     console.log('Document data:', docSnap.data())
    //   } else {
    //     console.log('No such document!');
    //   }
    // const docRef = db.collection("VishalBuildingDB").doc("alarmMessage");
    // const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return new Response(JSON.stringify({ error: "No document found" }), { status: 404 });
    }
    // let messages = docSnap.data();
    return new Response(JSON.stringify(docSnap.data()), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Failed to fetch messages" }), { status: 500 });
  }
}
