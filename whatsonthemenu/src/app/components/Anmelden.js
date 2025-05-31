import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function Home({ renderLogin, userID }) {
  const [submittedData, setSubmittedData] = useState(null);
  const router = useRouter();
  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const submitToServer = async (user_data) => {
    const pathname = router.pathname;
    console.log("Submitted data sending: ", user_data);
    const { email, password } = user_data;

    try {
      const resp = await fetch("./api/Auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (resp.status === 200) {
        const data = await resp.json();
        console.log("Server Response: ", data);

        // Store user and session IDs in sessionStorage
        window.sessionStorage.setItem("userID", data.id);
        window.sessionStorage.setItem("sessionID", data.sessionID);
        userID(data.id)
        setSubmittedData(data);
        renderLogin(false);

        // Update the query parameter with the new user ID
        const pathname = router.pathname;
        const newQuery = { ...router.query, id: data.id };
   
        router.replace({
          pathname,
          query: newQuery,
        });

        const searchParams = new URLSearchParams(newQuery).toString();
        const url = `${searchParams ? `?${searchParams}` : ""}`;
        router.replace(url, { shallow: true });

        if (data.role === "Admin") {
          window.sessionStorage.setItem("role", data.role);
        }
        console.log("Data sent successfully");
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
    submitToServer(data);
    form.reset(); // Reset the form after submission
  };

  useEffect(() => {
    if (submittedData) {
      console.log("submittedData updated:", submittedData);
    }
  }, [submittedData]);

  return (
    <div className="relative min-h-screen w-screen bg-gray-600 text-black-900">
      <div className="absolute inset-0 backdrop-blur-lg bg-gray-900 bg-opacity-80"></div>
      <div className="max-w-md mx-auto p-6 bg-red-600 rounded-lg shadow-md relative z-10 flex flex-col justify-center min-h-[300px]">
        <h1 className="relative text-2xl font-bold mb-6 text-gray-900 align-center justify-center">Login</h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
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
                minLength: {
                  value: 6,
                  message: "Password must have at least 6 characters",
                },
              }}
              render={({ field }) => (
                <FormItem className="mb-6">
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Password" {...field} style={{ color: "black", backgroundColor: "white" }} />
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
