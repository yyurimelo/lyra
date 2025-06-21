import { LyraIcon } from "@lyra/_components/lyra/lyra-icon";
import { LoginForm } from "@lyra/components/login-form";

export default function SignIn() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col">
        <div className="flex items-center justify-center">
          <LyraIcon className="size-42" />
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
