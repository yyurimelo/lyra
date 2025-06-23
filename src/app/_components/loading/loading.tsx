import { LoaderCircle } from "lucide-react";

type Props = {
  isLoading: boolean;
};

export function Loading({ isLoading }: Props) {
  return (
    isLoading && (
      <div className="fixed inset-0 flex items-center justify-center backdrop-blur-lg z-50">
        <LoaderCircle className="w-8 h-8 text-primary animate-spin" />
      </div>
    )
  );
}
