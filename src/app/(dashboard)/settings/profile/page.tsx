"use client";
import { useSession } from "next-auth/react";
import { useEffect, useId, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { changeUserAppearanceSettings } from "@lyra/utils/change-user-appearance";
import { hexToOKLCH, oklchToHex } from "@lyra/utils/color";
import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient } from "@lyra/config/react-query-config/page";

// helpers
import { formatHexInput } from "@lyra/helpers/hex-format";

// components
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@lyra/components/ui/card";
import { Avatar } from "@lyra/components/ui/avatar";
import { AvatarImageUser } from "@lyra/components/ui/avatar-image-user";
import { Separator } from "@lyra/components/ui/separator";
import { z } from "zod";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@lyra/components/ui/form";
import { Input } from "@lyra/components/ui/input";
import { Textarea } from "@lyra/components/ui/textarea";
import { Button } from "@lyra/components/ui/button";
import { Combo } from "@lyra/components/ui/combo";
import { ColorPicker } from "@lyra/components/ui/color-picker";
import { ClickCopy } from "@lyra/components/ui/click-copy";

// icons
import { Check, LoaderCircle, Pencil, X } from "lucide-react";

// services
import { getUser, updateUser } from "@lyra/app/api/services/user.service";

// -----------------------------------------------------------------------------

const profileFormSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  description: z.string().optional(),
  appearancePrimaryColor: z.string().optional(),
  appearanceTextPrimaryLight: z.string().nullable().optional(),
  appearanceTextPrimaryDark: z.string().nullable().optional(),
});

type ProfileFormSchema = z.infer<typeof profileFormSchema>;

// -----------------------------------------------------------------------------

export default function SettingsProfile() {
  const id = useId();
  const [edit, setEdit] = useState(false);
  const { data: loggedUser } = useSession();

  const form = useForm<ProfileFormSchema>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: "",
      description: "",
      appearancePrimaryColor: "",
      appearanceTextPrimaryDark: "",
      appearanceTextPrimaryLight: "",
    },
  });

  const { data: user } = useQuery({
    queryKey: ["user-details", loggedUser?.user.id],
    queryFn: () => getUser(loggedUser!.user.id),
    enabled: loggedUser?.user.id !== null,
  });

  useEffect(() => {
    if (user) {
      form.reset({
        name: user.name || "",
        description: user.description || "",
        appearancePrimaryColor: user.appearancePrimaryColor
          ? oklchToHex(user.appearancePrimaryColor)
          : "",
        appearanceTextPrimaryLight: user.appearanceTextPrimaryLight || null,
        appearanceTextPrimaryDark: user.appearanceTextPrimaryDark || null,
      });
    }
  }, [user, form]);

  function handleEdit() {
    setEdit(true);
  }

  function handleCancelEdit() {
    setEdit(false);
    form.reset({
      name: user?.name || "",
      description: user?.description || "",
      appearancePrimaryColor: user?.appearancePrimaryColor
        ? oklchToHex(user.appearancePrimaryColor)
        : "",
      appearanceTextPrimaryLight: user?.appearanceTextPrimaryLight || null,
      appearanceTextPrimaryDark: user?.appearanceTextPrimaryDark || null,
    });
  }

  const { mutateAsync: updateUserFn, isPending } = useMutation({
    mutationFn: updateUser,
    onSuccess: async (_, variables) => {
      await queryClient.invalidateQueries({
        queryKey: ["user-details", loggedUser?.user.id],
      });

      changeUserAppearanceSettings({
        appearancePrimaryColor: variables.appearancePrimaryColor
          ? oklchToHex(variables.appearancePrimaryColor)
          : undefined,
        appearanceTextPrimaryLight:
          variables.appearanceTextPrimaryLight ?? undefined,
        appearanceTextPrimaryDark:
          variables.appearanceTextPrimaryDark ?? undefined,
      });

      setEdit(false);
      toast.success("Perfil atualizado com sucesso!");
    },
    onError: (error) => {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Ocorreu um erro ao atualizar o perfil.");
      }
    },
  });

  async function handleSubmit(data: ProfileFormSchema) {
    await updateUserFn({
      id: loggedUser!.user.id,
      name: data.name,
      description: data.description,
      appearancePrimaryColor: data.appearancePrimaryColor?.trim()
        ? hexToOKLCH(data.appearancePrimaryColor)
        : undefined,
      appearanceTextPrimaryLight: data.appearanceTextPrimaryLight ?? undefined,
      appearanceTextPrimaryDark: data.appearanceTextPrimaryDark ?? undefined,
      token: loggedUser?.user.token,
    });
  }

  function abbreviateUserIdentifier(identifier: string) {
    return identifier.length > 6 ? `${identifier.slice(-6)}` : identifier;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Perfil</CardTitle>
        <CardDescription>Edite suas informações</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            id={id}
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <header className="w-full flex items-center justify-end">
              {!edit && (
                <Button variant="ghost" type="button" onClick={handleEdit}>
                  <Pencil className="w-4 h-4" />
                  Editar
                </Button>
              )}

              {edit && (
                <>
                  <Button
                    form={id}
                    variant="ghost"
                    className="text-emerald-500 hover:text-emerald-500"
                    type="submit"
                    disabled={isPending}
                  >
                    {isPending ? (
                      <span className="flex items-center gap-2">
                        <LoaderCircle className="w-4 h-4 animate-spin" />
                        Atualizando
                      </span>
                    ) : (
                      <>
                        <Check className="w-4 h-4" />
                        Confirmar
                      </>
                    )}
                  </Button>

                  {!isPending && (
                    <Button
                      variant="ghost"
                      className="text-red-500 hover:text-red-500"
                      onClick={handleCancelEdit}
                      type="button"
                    >
                      <X className="w-4 h-4" />
                      Cancelar
                    </Button>
                  )}
                </>
              )}
            </header>

            <Separator className="my-4" />

            <section className=" space-y-2">
              <div className="flex items-center w-full justify-between">
                <Avatar className="size-16 overflow-visible">
                  <AvatarImageUser
                    src={loggedUser?.user.image || undefined}
                    alt={loggedUser?.user.name}
                    className="rounded-full"
                  />
                </Avatar>
                <div className="flex items-center gap-2">
                  ID:{" "}
                  {abbreviateUserIdentifier(
                    loggedUser?.user.userIdentifier || ""
                  )}
                  <ClickCopy
                    content={abbreviateUserIdentifier(
                      loggedUser?.user.userIdentifier || ""
                    )}
                    variant={"ghost"}
                  />
                </div>
              </div>
            </section>

            <section className="space-y-4 w-[400px]">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome*</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={!edit}
                        placeholder={!edit ? "Não informado" : ""}
                        autoComplete="name"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descrição</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        disabled={!edit}
                        placeholder={!edit ? "Não informada" : ""}
                        autoComplete="description"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </section>

            <Separator className="my-6" />

            <section className="mb-6">
              <div className="space-y-2">
                <CardTitle>Aparência</CardTitle>
                <CardDescription>
                  Personalize a aparência da sua dashboard
                </CardDescription>
              </div>
            </section>

            <section className="grid lg:grid-cols-3 gap-3">
              <FormField
                control={form.control}
                name="appearanceTextPrimaryLight"
                render={({ field }) => (
                  <FormItem>
                    <div>
                      <FormLabel>Cor da fonte</FormLabel>
                      <FormDescription>Tema claro</FormDescription>
                    </div>
                    <FormControl>
                      <Combo
                        className="w-full"
                        value={field.value}
                        onSelect={(selectedValue) => {
                          form.setValue("appearanceTextPrimaryLight", "");
                          field.onChange(selectedValue);
                        }}
                        itens={[
                          {
                            label: "Branco",
                            value: "oklch(1.000 0.000 89.876)",
                          },
                          { label: "Preto", value: "oklch(0.000 0.000 0.000)" },
                        ]}
                        disabled={!edit}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="appearanceTextPrimaryDark"
                render={({ field }) => (
                  <FormItem>
                    <div>
                      <FormLabel>Cor da fonte</FormLabel>
                      <FormDescription>Tema escuro</FormDescription>
                    </div>
                    <FormControl>
                      <Combo
                        className="w-full"
                        value={field.value}
                        onSelect={(selectedValue) => {
                          form.setValue("appearanceTextPrimaryDark", "");
                          field.onChange(selectedValue);
                        }}
                        itens={[
                          {
                            label: "Branco",
                            value: "oklch(1.000 0.000 89.876)",
                          },
                          { label: "Preto", value: "oklch(0.000 0.000 0.000)" },
                        ]}
                        disabled={!edit}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="appearancePrimaryColor"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <div>
                      <FormLabel>Cor primária</FormLabel>
                      <FormDescription>Valor</FormDescription>
                    </div>
                    <FormControl>
                      <div className="flex gap-3 w-full">
                        <Input
                          className=" w-full"
                          placeholder="Informe o hexadecimal"
                          type="text"
                          {...field}
                          onChange={(e) => {
                            const formatted = formatHexInput(e.target.value);
                            field.onChange(formatted);
                          }}
                          disabled={!edit}
                        />

                        <ColorPicker
                          value={field.value ?? ""}
                          onChange={field.onChange}
                          onBlur={field.onBlur}
                          disabled={!edit}
                        />
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />
            </section>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
