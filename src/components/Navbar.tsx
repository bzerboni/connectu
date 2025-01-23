import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  return (
    <nav className="border-b bg-white">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold text-primary">
          UniConnect
        </Link>
        
        <div className="flex items-center gap-6">
          <Link to="/explore" className="text-gray-600 hover:text-primary">
            Explorar
          </Link>
          <Link to="/profile" className="text-gray-600 hover:text-primary">
            Perfil
          </Link>
          <Button variant="default">
            Iniciar Sesión
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;