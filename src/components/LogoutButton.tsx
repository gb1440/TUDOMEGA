
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";
import React from "react";

interface LogoutButtonProps {
  onLogout?: () => void;
}

const LogoutButton: React.FC<LogoutButtonProps> = ({ onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({ title: "Erro ao sair", description: error.message });
    } else {
      toast({ title: "Logout realizado", description: "Você saiu da conta." });
      if (onLogout) onLogout();
      navigate("/auth");
    }
  };

  return (
    <Button variant="outline" onClick={handleLogout} className="flex items-center gap-2" title="Sair da conta">
      <LogOut size={18} />
      Sair
    </Button>
  );
};

export default LogoutButton;
