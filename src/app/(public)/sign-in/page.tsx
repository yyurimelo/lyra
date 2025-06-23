import { LyraChatIcon } from "@lyra/app/_components/lyra/lyra-chat-icon";
import { LoginForm } from "@lyra/components/login-form";

export default function SignIn() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col space-y-4">
        <div className="flex items-center justify-center">
          <LyraChatIcon height="h-10" />
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
