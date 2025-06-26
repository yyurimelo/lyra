"use client";

import { useState } from "react";
import { CheckIcon, CopyIcon } from "lucide-react";

import { cn } from "@lyra/lib/utils";
import { Button } from "@lyra/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@lyra/components/ui/tooltip";

type Props = {
  content: string;
  variant?:
    | "link"
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | null
    | undefined;
};

export function ClickCopy({ content, variant }: Props) {
  const [copied, setCopied] = useState<boolean>(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={variant}
            size="icon"
            className="disabled:opacity-100"
            onClick={handleCopy}
            type="button"
            aria-label={copied ? "Copied" : "Copy to clipboard"}
            disabled={copied}
          >
            <div
              className={cn(
                "transition-all",
                copied ? "scale-100 opacity-100" : "scale-0 opacity-0"
              )}
            >
              <CheckIcon
                className="stroke-emerald-500"
                size={16}
                aria-hidden="true"
              />
            </div>
            <div
              className={cn(
                "absolute transition-all",
                copied ? "scale-0 opacity-0" : "scale-100 opacity-100"
              )}
            >
              <CopyIcon size={16} aria-hidden="true" />
            </div>
          </Button>
        </TooltipTrigger>
        <TooltipContent className="px-2 py-1 text-xs">
          Clique para copiar
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
