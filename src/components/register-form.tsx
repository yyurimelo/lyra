"use client";

import { useId, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// utils
import { cn } from "@lyra/lib/utils";

// components
import { Button } from "@lyra/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@lyra/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@lyra/components/ui/form";
import { Input } from "@lyra/components/ui/input";

// services
import { createUser } from "@lyra/common/api/user.service";
import InputPassword from "./ui/input-passowrd";
import { LoaderCircle } from "lucide-react";

// -----------------------------------------------------------------------------

const createUserForm = z
  .object({
    name: z.string().min(1, "Name is required"),
    email: z.string().min(1, "Email is required").email("Invalid email"),
    password: z.string().min(1, "Password is required"),
    confirmPassword: z.string().min(1, "Confirm Password is required"),
  })
  .superRefine((data) => {
    if (data.password !== data.confirmPassword) {
      throw new z.ZodError([
        {
          path: ["confirmPassword"],
          message: "Passwords must match",
          code: z.ZodIssueCode.custom,
        },
      ]);
    }
  });

type CreateUserForm = z.infer<typeof createUserForm>;

export function RegisterForm() {
  const id = useId();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<CreateUserForm>({
    resolver: zodResolver(createUserForm),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function handleSubmit(data: CreateUserForm) {
    try {
      setIsLoading(true);
      await createUser(data);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className={cn("flex flex-col gap-6")}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Register on Lyra</CardTitle>
          <CardDescription>Register with your Google account</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <div>
            <Button variant="outline" className="w-full">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path
                  d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                  fill="currentColor"
                />
              </svg>
              Login with Google
            </Button>
          </div>
          <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
            <span className="bg-card text-muted-foreground relative z-10 px-2">
              Or continue with
            </span>
          </div>

          <Form {...form}>
            <form
              id={id}
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-6"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <InputPassword
                        id={id}
                        field={field}
                        error={form.formState.errors.password}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <InputPassword
                        id={id}
                        field={field}
                        error={form.formState.errors.confirmPassword}
                        isConfirm={true}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <Button
                disabled={isLoading}
                form={id}
                type="submit"
                className="w-full"
              >
                {isLoading && (
                  <LoaderCircle className="w-4 h-4 text-primary-foreground animate-spin mr-2" />
                )}
                {isLoading ? "Waiting..." : "Register"}
              </Button>
              <div className="text-center text-sm">
                Already have an account?{" "}
                <a href="/sign-in" className="underline underline-offset-4">
                  Sign in
                </a>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
