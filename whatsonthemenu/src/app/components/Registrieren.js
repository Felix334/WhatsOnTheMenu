import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { date } from "zod";

export default function Home({ renderRegistrieren }) {
  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      repeatPassword: "",
    },
  });

  const [submittedData, setSubmittedData] = useState(null);
  const submitToServer = async (user_data) => {
    console.log("Submitted data sending: ", user_data);
    var { email, password, name } = user_data;
    console.log("Data unpacked: ", email, password, name);
    try {
      const resp = await fetch("./api/Auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({name, email, password }),
      });
      if (resp.status === 200) {
        const data = await resp.json();
        window.localStorage.setItem("userID", data.userID);
        window.sessionStorage.setItem("sessionID", data.sessionID); // Überarbeiten
        setSubmittedData(data);
        renderRegistrieren(false);
        console.log("Data send succeess");
      } else {
        console.error("Failed to submit data:", resp.status);
      }
    } catch (err) {
      console.error("Error submitting data:", err);
    }
  };
  // Define the onSubmit function
  const onSubmit = (data) => {
    console.log("onSubmit data param:", data);
    if (data.password != data.repeatPassword) {
      console.log("Passwords do not match");
      window.alert("Nicht das selbe Passwort!");
    } else {
      submitToServer(data);
      form.reset();
    }
  };
  useEffect(() => {
    if (submittedData) {
      console.log("submittedData updated:", submittedData);
    }
  }, [submittedData]);

  return (
    <div className="relative min-h-screen w-screen bg-gray-600 text-black-900">
      <div className="absolute inset-0 backdrop-blur-lg bg-gray-900 bg-opacity-80"></div>
      <div className="max-w-md mx-auto p-6 bg-red-600 rounded-lg shadow-md relative z-10 flex flex-col justify-center min-h-[300px] top-50">
        <h1 className=" relative text-2xl font-bold mb-6 text-gray-900 align-center justify-center">Registrieren</h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
            <FormField
              control={form.control}
              name="name"
              rules={{
                required: "Name is required",
                 minLength: {
                  value: 4,
                  message: "Name must have at least 4 characters",
                },
              }}
              render={({ field }) => (
                <FormItem className="mb-4">
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="Name" {...field} style={{ color: "black", backgroundColor: "white" }} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              rules={{
                required: "Email is required",
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: "Invalid email address",
                },
              }}
              render={({ field }) => (
                <FormItem className="mb-4">
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="Email" {...field} style={{ color: "black", backgroundColor: "white" }} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              rules={{
                required: "Password is required",
                color: "black",
                minLength: {
                  value: 6,
                  message: "Password must have at least 6 characters",
                },
              }}
              render={({ field }) => (
                <FormItem className="mb-6">
                  <FormLabel>Passwort</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Passwort" {...field} style={{ color: "black", backgroundColor: "white" }} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="repeatPassword"
              rules={{
                required: "Password wiederholen",
                color: "black",
                minLength: {
                  value: 6,
                  message: "Password must have at least 6 characters",
                },
              }}
              render={({ field }) => (
                <FormItem className="mb-6">
                  <FormLabel>Passwort wiederholen</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Passwort wiederholen" {...field} style={{ color: "black", backgroundColor: "white" }} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
