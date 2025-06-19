import { LyraIcon } from "@lyra/_components/lyra/lyra-icon";
import { RegisterForm } from "@lyra/components/register-form";

export default function Register() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <div className="flex items-center gap-2 self-center font-medium">
          <LyraIcon className="size-10" />
          LyraCHAT
        </div>
        <RegisterForm />
      </div>
    </div>
  );
}
