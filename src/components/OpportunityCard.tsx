import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, DollarSign, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./AuthProvider";
import { useToast } from "@/components/ui/use-toast";

interface OpportunityCardProps {
  title: string;
  company: string;
  location: string;
  type: string;
  duration: string;
  salary: string;
  description: string;
  isCompanyView?: boolean;
}

const OpportunityCard = ({ 
  title, 
  company, 
  location, 
  type, 
  duration, 
  salary,
  description,
  isCompanyView = false
}: OpportunityCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { session } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleApply = async () => {
    if (!session) {
      navigate("/auth");
      return;
    }

    try {
      const { error } = await supabase.from("applications").insert({
        opportunity_id: `${company}-${title}`,
        user_id: session.user.id
      });

      if (error) throw error;

      toast({
        title: "Aplicación exitosa",
        description: "Tu aplicación ha sido enviada correctamente.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
        <p className="text-sm text-gray-600">{company}</p>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
          <MapPin size={16} />
          <span>{location}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
          <Clock size={16} />
          <span>{duration}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
          <DollarSign size={16} />
          <span>{salary}</span>
        </div>
        <div className="flex flex-wrap gap-2 mb-4">
          <Badge variant="secondary" className="bg-primary/10 text-primary">
            {type}
          </Badge>
        </div>
        
        <div className={cn(
          "overflow-hidden transition-all duration-300",
          isExpanded ? "max-h-96" : "max-h-0"
        )}>
          <p className="text-sm text-gray-700 mb-4">{description}</p>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-2">
        <Button 
          variant="ghost" 
          className="w-full justify-between"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? "Ver menos" : "Ver más"}
          {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </Button>
        {!isCompanyView && (
          <Button 
            className="w-full"
            onClick={handleApply}
          >
            {session ? "Aplicar ahora" : "Inicia sesión para aplicar"}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default OpportunityCard;