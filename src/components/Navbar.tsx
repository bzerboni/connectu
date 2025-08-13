
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "./AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

const Navbar = () => {
  const { session } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigate("/");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <nav className="border-b bg-white">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold text-primary">
          AI Builders Hub
        </Link>
        
        <div className="flex items-center gap-6">
          {session ? (
            <>
              <Link to="/explore" className="text-gray-600 hover:text-primary">
                Explorar Proyectos
              </Link>
              <Link to="/profile" className="text-gray-600 hover:text-primary">
                Perfil
              </Link>
              <Button variant="outline" onClick={handleLogout}>
                Cerrar Sesión
              </Button>
            </>
          ) : (
            <Button onClick={() => navigate("/auth")}>
              Iniciar Sesión
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
