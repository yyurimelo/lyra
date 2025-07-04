import { Dot } from "@lyra/app/_components/dot";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@lyra/components/ui/card";
import { UserRoundPlus } from "lucide-react";

export default function FriendRequests() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Solicitações de amizade</CardTitle>
        <CardDescription>
          Aqui você pode gerenciar suas solicitações de amizade pendentes.
          Aceite ou rejeite solicitações de outros usuários.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div
          className={`bg-accent/20 hover:bg-secondary shadow-lg border rounded-lg px-1 py-2 text-sm transition-colors`}
        >
          <div className="relative flex items-start pe-3">
            <div className="flex-1 space-y-1">
              <div className="group relative flex self-stretch select-none items-start gap-3 p-2 text-foreground/80 text-start cursor-pointer">
                <UserRoundPlus className="text-primary" />

                <div>
                  <header className="flex items-center gap-2">
                    <span
                      className={`text-[10px] text-primary font-semibold uppercase leading-[1rem] tabular-nums`}
                    >
                      Nova solicitação de amizade
                    </span>
                    <Dot className="text-muted-foreground/50 size-[3px]" />
                    <span className="text-[10px] text-muted-foreground/80 font-semibold uppercase leading-[1rem] tabular-nums">
                      Agora
                    </span>
                  </header>

                  <span className="text-pretty">
                    Alexander te enviou uma solicitação de amizade.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
