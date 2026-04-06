"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import loginSchema from "./components/loginSchema.js";
import { useRouter } from "next/navigation";
import { signIn, getSession } from "next-auth/react";

import { createClient } from "@supabase/supabase-js";

import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Home({ renderLogin, userID, role }) {
  const [isLoading, setIsLoading] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [error, setError] = useState("");
  const [userIP, setUserIP] = useState();
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  /*const supabaseUrl = "https://awtxsktldyykatnhests.supabase.co";
  const supabaseKey = process.env.SUPABASE_KEY;
  const supabase = createClient(supabaseUrl, supabaseKey);
  */

  const { control, handleSubmit, formState, reset } = form;

  // -----------------------------------
  // NextAuth Credentials Login
  // -----------------------------------
  const onSubmit = async (data) => {
    setIsLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false, // Don't redirect automatically
      });

      if (result?.error) {
        setError("Login fehlgeschlagen! Bitte richtige Benutzerdaten angeben!");
      } else if (result?.ok) {
        // Get session to update user state
        const session = await getSession();
        if (session?.user) {
          userID(session.user.id);
        }

        setLoginSuccess(true);

        // Show success popup for 2 seconds, then redirect
        setTimeout(() => {
          renderLogin(false);
          router.replace("/", undefined, { shallow: true });
        }, 2000);
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Ein unerwarteter Fehler ist aufgetreten.");
    } finally {
      setIsLoading(false);
    }

    reset();
  };

  useEffect(() => {
    const getIP = () => {
      try {
        fetch("https://api.ipify.org?format=json")
          .then((response) => response.json())
          .then((data) => {
            console.log("IP-Adresse:", data.ip);
            setUserIP(data.ip);
          })
          .catch((error) => {
            console.error("Error fetching IP:", error);
          });
      } catch (e) {
        console.log("Fehler", e);
      }
    };
    getIP();
  });
  // -----------------------------------
  // Social Login Handlers
  // -----------------------------------
  const handleEmailSignIn = () => {
    const email = form.getValues("email");
    console.log("Email-Login", email);
    if (!email) {
      setError("Bitte geben Sie eine E-Mail-Adresse ein.");
      return;
    }

    signIn("email", {
      email,
      redirect: true,
      callbackUrl: "/",
    });
  };

  const handleGoogleSignIn = async () => {
    try {
      // signIn mit redirect: false, damit wir selbst weiterleiten können
      const result = await signIn("google", { redirect: false });

      if (result?.url) {
        console.log(result)
        window.location.replace(result.url);
        console.log("Imag-URL",result?.user?.image)
      }
    } catch (err) {
      console.error("Google SignIn error:", err);
      setError("Google Login fehlgeschlagen.");
    }
  };

  // -----------------------------------
  // Loading screen
  // -----------------------------------
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-opacity-80">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-grey-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-screen bg-gray-600 relative">
      <div className="absolute inset-0 backdrop-blur-lg bg-gray-900 bg-opacity-80 z-10" />

      {/* Success Popup */}
      {loginSuccess && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-green-500 text-white p-6 rounded-lg shadow-lg text-center">
            <div className="text-4xl mb-4">✅</div>
            <h2 className="text-xl font-bold mb-2">Login erfolgreich!</h2>
            <p>Willkommen zurück!</p>
          </div>
        </div>
      )}

      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md relative z-20 min-h-75 top-40 md:top-30">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-900">Login</h1>

        {/* Error Message */}
        {error && <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">{error}</div>}

        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FormField
              control={control}
              name="email"
              render={({ field }) => (
                <FormItem className="mb-4">
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="Email" {...field} className="text-black bg-white" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="password"
              render={({ field }) => (
                <FormItem className="mb-6">
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Password" {...field} className="text-black bg-white" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full mb-4">
              Anmelden (Credentials)
            </Button>
          </form>
        </Form>

        {/* Google Login */}
        <Button type="button" onClick={handleGoogleSignIn} className="w-full mb-4 bg-blue-600 hover:bg-blue-700 text-white">
          Mit Google anmelden
        </Button>
      </div>
    </div>
  );
}