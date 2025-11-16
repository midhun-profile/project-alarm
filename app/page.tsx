'use client';

import { Key, useEffect, useState } from 'react';
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  getDoc,
} from 'firebase/firestore';
import { db, auth } from '@/lib/firebaseClient';
import { useRouter } from 'next/navigation';
import withAuth from '@/lib/withAuth';
import useAuth from '@/lib/useAuth';

function UsersPage() {
  const [userData, setUserData] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    async function fetchUserData() {
      if (user) {
        const q = query(collection(db, 'demologin'), where('uid', '==', user.uid));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const userData = querySnapshot.docs[0].data();
          setUserData(userData);
        }
      }
      setLoading(false);
    }

    async function fetchMessages() {
      const res = await fetch("/api/messages");
      const data = await res.json();
      setMessages([data]);
    }
    fetchUserData();
    fetchMessages();
  }, [user]);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      router.push('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (loading) return <p className="text-white text-center p-10">Loading…</p>;

  return (
    <div className="p-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-white">User Details</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
        >
          Logout
        </button>
      </div>

      {userData ? (
        <div className="bg-[#221b27]/80 border border-[#4a3b54] p-6 rounded-lg text-white">
          <p>
            <strong>Name:</strong> {userData.name}
          </p>
          <p>
            <strong>Email:</strong> {userData.email}
          </p>
          <p>
            <strong>Location:</strong> {userData.location}
          </p>
          <p>
            <strong>Building:</strong> {userData.building}
          </p>
          <p>
            <strong>Floor:</strong> {userData.floor}
          </p>
        </div>
      ) : (
        <p className="text-white">No user data found.</p>
      )}

      <div className="mt-10">
        <h2 className="text-2xl font-bold text-white mb-4">Messages</h2>
        {messages.length > 0 ? (
         <div className="bg-[#221b27]/80 border border-[#4a3b54] p-6 rounded-lg text-white space-y-4 max-h-[600px] overflow-y-auto">
         {messages[0]?.alarmMessage?.slice(-10)?.map((msg: { message: any; time: string | number | Date; }, index: Key | null | undefined) => (
           <div key={index} className="border-b border-[#4a3b54] pb-2">
             <p>
               <strong>Message:</strong> {msg?.message || "No message"}
             </p>
             <p>
               <strong>Timestamp:</strong>{" "}
               {msg.time
                 ? new Date(msg.time).toLocaleString()
                 : "No timestamp"}
             </p>
           </div>
         ))}
       </div>
        ) : (
          <p className="text-white">No messages found.</p>
        )}
      </div>
    </div>
  );
}

export default withAuth(UsersPage);
