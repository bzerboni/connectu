import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

const SearchBar = () => {
  return (
    <div className="flex gap-2">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <Input
          className="pl-10"
          placeholder="Buscar oportunidades..."
          type="search"
        />
      </div>
      <Button>Buscar</Button>
    </div>
  );
};

export default SearchBar;