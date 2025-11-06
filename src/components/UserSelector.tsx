import { useUser } from "@/contexts/UserContext";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";

export function UserSelector() {
  const { selectedUser, setSelectedUser } = useUser();

  return (
    <div className="flex items-center gap-2 bg-muted/50 p-2 rounded-lg">
      <Users className="h-4 w-4 text-muted-foreground" />
      <span className="text-sm text-muted-foreground">Utilisateur:</span>
      <div className="flex gap-1">
        <Button
          size="sm"
          variant={selectedUser === "bapt" ? "default" : "outline"}
          onClick={() => setSelectedUser("bapt")}
        >
          Baptiste
        </Button>
        <Button
          size="sm"
          variant={selectedUser === "imrane" ? "default" : "outline"}
          onClick={() => setSelectedUser("imrane")}
        >
          Imrane
        </Button>
      </div>
    </div>
  );
}
