"use client";

import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";

import { cn } from "@lyra/lib/utils";
import { Button } from "@lyra/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@lyra/components/ui/card";
import { Input } from "@lyra/components/ui/input";
import { GoogleAuthButton } from "@lyra/_components/google-auth/page";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@lyra/components/ui/form";
import { useId, useState } from "react";
import { LoaderCircle } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const loginFormSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormSchema = z.infer<typeof loginFormSchema>;

export function LoginForm() {
  const id = useId();
  const [isLoading, setIsLoading] = useState(false);
  const route = useRouter();

  const form = useForm<LoginFormSchema>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function handleSubmit(data: LoginFormSchema) {
    try {
      setIsLoading(true);
      const result = await signIn("credentials", {
        redirect: false,
        email: data.email,
        password: data.password,
      });

      setIsLoading(false);
      if (result?.error) {
        throw new Error(result.error);
      }

      toast.success("Login successful!");
      route.push("/");
    } catch (error) {
      setIsLoading(false);
      toast.error(
        "Login inválido. Verifique suas credenciais e tente novamente."
      );
      return error;
    }
  }

  return (
    <div className={cn("flex flex-col gap-6")}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Bem-vindo ao Lyra</CardTitle>
          <CardDescription>Acesse rapidamente com Google</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              id={id}
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-6"
            >
              <div className="grid gap-6">
                <div>
                  <GoogleAuthButton />
                </div>
                <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                  <span className="bg-card text-muted-foreground relative z-10 px-2">
                    Ou continue com
                  </span>
                </div>

                {/* form login */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>E-mail</FormLabel>
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
                      <FormLabel>Senha</FormLabel>
                      <FormControl>
                        <Input {...field} type="password" />
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
                  {isLoading ? isLoading : "Entrar"}
                </Button>

                <div className="text-center text-sm">
                  Não possui uma conta?{" "}
                  <a href="/register" className="underline underline-offset-4">
                    Registre-se
                  </a>
                </div>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
