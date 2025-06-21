"use client";
import { useId, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";

// utils

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
import { createUser } from "@lyra/app/api/user.service";
import { InputPassword } from "./ui/input-passowrd";
import { LoaderCircle } from "lucide-react";
import { toast } from "sonner";
import { GoogleAuthButton } from "@lyra/_components/google-auth/page";

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
  const router = useRouter();

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
      toast.success("Usuário criado com sucesso!");
      router.push("/sign-in");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error(
          "Ocorreu um erro ao criar o usuário. Por favor, tente novamente."
        );
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Cadastre-se no Lyra</CardTitle>
          <CardDescription>Acesse rapidamente com Google</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <div>
            <GoogleAuthButton />
          </div>
          <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
            <span className="bg-card text-muted-foreground relative z-10 px-2">
              Ou continue com
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
                    <FormLabel>Nome de usuário</FormLabel>
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
                    <FormLabel>Confirmar senha</FormLabel>
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
                {isLoading ? isLoading : "Cadastrar"}
              </Button>
              <div className="text-center text-sm">
                Já tem uma conta?{" "}
                <a href="/sign-in" className="underline underline-offset-4">
                  Entrar
                </a>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </>
  );
}
