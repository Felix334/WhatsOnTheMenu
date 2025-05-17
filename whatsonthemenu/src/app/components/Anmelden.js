import { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function Home() {
  const form = useForm({
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });
  const [submittedData, setSubmittedData] = useState(null);

  function onSubmit(data) {
    setSubmittedData(data);
    form.reset();
  }

  return (
    <div className="relative h-screen w-screen">
      <div className="absolute inset-0 backdrop-blur-lg bg-gray-800 opacity-80"></div>
      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md relative z-10 justify-center item-center">
        <h1 className="text-2xl font-bold mb-6 text-gray-900">Login</h1>
        <Form {...form} >
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
                    <Input type="email" placeholder="Email" {...field} />
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
                    <Input type="password" placeholder="Password" {...field} />
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

        {submittedData && (
          <div className="mt-6 p-4 bg-green-100 border border-green-400 rounded-md text-green-900 font-semibold whitespace-pre-wrap">
            <strong>Form Data Submitted:</strong>
            <pre>{JSON.stringify(submittedData, null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  );
}
