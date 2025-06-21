import { LyraIcon } from "@lyra/_components/lyra/lyra-icon";
import { RegisterForm } from "@lyra/components/register-form";

export default function Register() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 p-6 ">
      <div className="flex w-full max-w-sm flex-col">
        <div className="flex items-center justify-center">
          <LyraIcon className="size-42" />
        </div>
        <RegisterForm />
      </div>
    </div>
  );
}
