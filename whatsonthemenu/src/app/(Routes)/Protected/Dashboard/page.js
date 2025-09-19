"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { Prociono } from "next/font/google";

const cryptoJS = require("crypto-js");

export default function Page() {
  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState()

  useEffect(() => {
    const fetchUserData = async () => {
      const userID = await localStorage.getItem("userID")
      var encrypted_user_id = cryptoJS.AES.encrypt(userID, process.env.NEXT_PUBLIC_ENCRYPTION_KEY).toString(cryptoJS.AES.Utf8);
      var encrypted_api_key = cryptoJS.AES.encrypt(process.env.NEXT_PUBLIC_API_KEY, process.env.NEXT_PUBLIC_ENCRYPTION_KEY).toString(cryptoJS.AES.Utf8)
      console.log("User-ID gefunden:", userID)
      try {
        if(!userID){
          notAuth();
          return;
        }
        const response = await fetch("/api/user/userData", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({encrypted_user_id: encrypted_user_id, encrypted_api_key: encrypted_api_key}),
        });

        if (response.status === 401) {
          // Handle unauthorized - but don't redirect automatically
          notAuth()
          setUserData([]);
          return;
        }

        if (!response.ok) {
          throw new Error("Failed to fetch user data:", response.status, response);
        }

        const data = await response.json();
        setData(data)
        console.log("Response:", data)
        //setUserData(data);
        
      } catch (error) {
        console.error("Error fetching user data:", error);
        setUserData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      
      {userData.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {data}
          {userData.map((user, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle>{user.name || "User"}</CardTitle>
                <CardDescription>{user.email || "No email"}</CardDescription>
              </CardHeader>
              <CardContent>
                <p>User ID: {user.id || "N/A"}</p>
                {user.role && <p>Role: {user.role}</p>}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Welcome to Dashboard</CardTitle>
            <CardDescription>
              Your dashboard is ready. No additional user data was found, but youre successfully authenticated.
            </CardDescription>
          </CardHeader>
          <CardContent>
          </CardContent>
        </Card>
      )}
    </div>
  );
}


function notAuth(){
  window.alert("Melden sie sich bitte mit einem berrechtigtem Konto an um diese Seite nutzen zu können")
  console.log("Melden sie sich bitte mit einem berrechtigtem Konto an um diese Seite nutzen zu können")
}