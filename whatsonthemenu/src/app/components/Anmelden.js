"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import loginSchema from "./components/loginSchema.js";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Home({ renderLogin, userID, role }) {
  const [submittedData, setSubmittedData] = useState(null);
  const [userIP, setUserIP] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { control, handleSubmit, formState, reset } = form;

  // -----------------------------------
  // Credentials Login (ohne Verschlüsselung)
  // -----------------------------------
  const submitToServer = async (user_data) => {
    const { email, password } = user_data;

    try {
      setIsLoading(true);

      const resp = await fetch("./api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          ip: userIP,
        }),
      });

      if (resp.ok) {
        const data = await resp.json();

        sessionStorage.setItem("userID", data.id);
        sessionStorage.setItem("sessionID", data.sessionID);
        sessionStorage.setItem("role", data.role);

        userID(data.id);
        role(data.role);
        setSubmittedData(data);
        renderLogin(false);

        router.replace("/", undefined, { shallow: true });
      } else {
        alert("Login fehlgeschlagen!\nBitte richtige Benutzerdaten angeben!");
      }
    } catch (err) {
      console.error("Network error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = (data) => {
    submitToServer(data);
    reset();
  };

  // -----------------------------------
  // IP fetch
  // -----------------------------------
  useEffect(() => {
    fetch("https://api.ipify.org?format=json")
      .then((res) => res.json())
      .then((data) => setUserIP(data.ip))
      .catch(() => {});
  }, []);

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

      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md relative z-20 min-h-[300px]">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-900">
          Login
        </h1>

        {/* Credentials Login */}
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FormField
              control={control}
              name="email"
              render={({ field }) => (
                <FormItem className="mb-4">
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Email"
                      {...field}
                      className="text-black bg-white"
                    />
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
                    <Input
                      type="password"
                      placeholder="Password"
                      {...field}
                      className="text-black bg-white"
                    />
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

        {/* Magic Link Email Login */}
        <Button
          type="button"
          onClick={() =>
            signIn("email", {
              email: form.getValues("email"),
              redirect: true,
              callbackUrl: "/",
            })
          }
          className="w-full mb-4 bg-gray-700 hover:bg-gray-800 text-white"
        >
          Magic Link an Email senden
        </Button>

        {/* Google Login */}
        <Button
          type="button"
          onClick={() => signIn("google", { callbackUrl: "http://localhost:3000" })}
          className="w-full mb-4 bg-blue-600 hover:bg-blue-700 text-white"
        >
          Mit Google anmelden
        </Button>
      </div>
    </div>
  );
}


/*import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import loginSchema from "./components/loginSchema.js";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react"
const cryptoJS = require("crypto-js");

import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Home({ renderLogin, userID, role }) {
  const [submittedData, setSubmittedData] = useState(null);
  const [userIP, setUserIP] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const email = "felixmayer02@gmx.de"

  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = form;

  const submitToServer = async (user_data) => {
    const { email, password } = user_data;
    var encrypted_email = cryptoJS.AES.encrypt(email, process.env.NEXT_PUBLIC_ENCRYPTION_KEY).toString(cryptoJS.AES.Utf8);
    var encrypted_password = cryptoJS.AES.encrypt(password, process.env.NEXT_PUBLIC_ENCRYPTION_KEY).toString(cryptoJS.AES.Utf8);
    var encrypted_IP = cryptoJS.AES.encrypt(userIP, process.env.NEXT_PUBLIC_ENCRYPTION_KEY).toString(cryptoJS.AES.Utf8);
    var encrypted_API_KEY = cryptoJS.AES.encrypt(process.env.NEXT_PUBLIC_API_KEY, process.env.NEXT_PUBLIC_ENCRYPTION_KEY).toString(cryptoJS.AES.Utf8);
    console.log("Encryption-Test", encrypted_email, encrypted_password);
    try {
      setIsLoading(true);
      const resp = await fetch("./api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ encrypted_email, encrypted_password, encrypted_IP, encrypted_API_KEY }),
      });

      if (resp.ok) {
        const data = await resp.json();

        // Save to sessionStorage
        sessionStorage.setItem("userID", data.id);
        sessionStorage.setItem("sessionID", data.sessionID);
        sessionStorage.setItem("role", data.role);

        userID(data.id);
        role(data.role);
        setSubmittedData(data);
        renderLogin(false);

        // Replace URL query
        const newQuery = { ...router.query, id: data.id };
        router.replace({ pathname: router.pathname, query: newQuery }, { shallow: true });
      } else {
        console.log("Login failed:", resp.status);
        window.alert("Login fehlgeschlagen!\nBitte richtige Benutzerdaten angeben!");
      }
    } catch (err) {
      console.error("Network error:", err);
    } finally {
      setIsLoading(false);
    }
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
  const onSubmit = (data) => {
    submitToServer(data);
    reset();
  };

  useEffect(() => {
    if (submittedData) {
      console.log("submittedData updated:", submittedData);
    }
  }, [submittedData]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-opacity-80">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-grey-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-screen bg-gray-600 text-black-900 relative">
      <div className="absolute inset-0 backdrop-blur-lg bg-gray-900 bg-opacity-80 z-10 flex flex-col" />
      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md relative z-20 flex flex-col justify-center min-h-[300px] top-50">
        <h1 className="text-2xl font-bold mb-6 text-gray-900 text-center">Login</h1>

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
            <button onClick={() => signIn("email", { email })}>Sign in with Email</button>
            

            <Button 
              type="button" 
              onClick={() => signIn("google")} 
              className="w-full mb-4 bg-blue-600 hover:bg-blue-700 text-white"
            >
              Sign in with Google
            </Button>
            
            <Button type="submit" className="w-full">
              Anmelden
            </Button>

          </form>
        </Form>

        {submittedData && <div className="mt-6 p-4 bg-blue-50 border border-blue-300 rounded text-blue-800 font-mono text-sm whitespace-pre-wrap wrap-break-words">{`Submitted Data:\n${JSON.stringify(submittedData, null, 2)}`}</div>}
      </div>
    </div>
  );
}*/

/*import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import loginSchema from "./components/loginSchema.js";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react"
const cryptoJS = require("crypto-js");

import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Home({ renderLogin, userID, role }) {
  const [submittedData, setSubmittedData] = useState(null);
  const [userIP, setUserIP] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const email = "felixmayer02@gmx.de"

  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = form;

  const submitToServer = async (user_data) => {
    const { email, password } = user_data;
    var encrypted_email = cryptoJS.AES.encrypt(email, process.env.NEXT_PUBLIC_ENCRYPTION_KEY).toString(cryptoJS.AES.Utf8);
    var encrypted_password = cryptoJS.AES.encrypt(password, process.env.NEXT_PUBLIC_ENCRYPTION_KEY).toString(cryptoJS.AES.Utf8);
    var encrypted_IP = cryptoJS.AES.encrypt(userIP, process.env.NEXT_PUBLIC_ENCRYPTION_KEY).toString(cryptoJS.AES.Utf8);
    var encrypted_API_KEY = cryptoJS.AES.encrypt(process.env.NEXT_PUBLIC_API_KEY, process.env.NEXT_PUBLIC_ENCRYPTION_KEY).toString(cryptoJS.AES.Utf8);
    console.log("Encryption-Test", encrypted_email, encrypted_password);
    try {
      setIsLoading(true);
      const resp = await fetch("./api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ encrypted_email, encrypted_password, encrypted_IP, encrypted_API_KEY }),
      });

      if (resp.ok) {
        const data = await resp.json();

        // Save to sessionStorage
        sessionStorage.setItem("userID", data.id);
        sessionStorage.setItem("sessionID", data.sessionID);
        sessionStorage.setItem("role", data.role);

        userID(data.id);
        role(data.role);
        setSubmittedData(data);
        renderLogin(false);

        // Replace URL query
        const newQuery = { ...router.query, id: data.id };
        router.replace({ pathname: router.pathname, query: newQuery }, undefined, { shallow: true });
      } else {
        console.log("Login failed:", resp.status);
        window.alert("Login fehlgeschlagen!\nBitte richtige Benutzerdaten angeben!");
      }
    } catch (err) {
      console.error("Network error:", err);
    } finally {
      setIsLoading(false);
    }
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
  const onSubmit = (data) => {
    submitToServer(data);
    reset();
  };

  useEffect(() => {
    if (submittedData) {
      console.log("submittedData updated:", submittedData);
    }
  }, [submittedData]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-opacity-80">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-grey-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-screen bg-gray-600 text-black-900 relative">
      <div className="absolute inset-0 backdrop-blur-lg bg-gray-900 bg-opacity-80 z-10 flex flex-col" />
      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md relative z-20 flex flex-col justify-center min-h-[300px] top-50">
        <h1 className="text-2xl font-bold mb-6 text-gray-900 text-center">Login</h1>

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
            <button onClick={() => signIn("email", { email })}>Sign in with Email</button>
            <Button type="submit" className="w-full">
              Anmelden
            </Button>

          </form>
        </Form>

        {submittedData && <div className="mt-6 p-4 bg-blue-50 border border-blue-300 rounded text-blue-800 font-mono text-sm whitespace-pre-wrap break-words">{`Submitted Data:\n${JSON.stringify(submittedData, null, 2)}`}</div>}
      </div>
    </div>
  );
}
*/