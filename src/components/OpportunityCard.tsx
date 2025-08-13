
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, DollarSign, ChevronDown, ChevronUp, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./AuthProvider";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

interface OpportunityCardProps {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  duration: string;
  budgetMin?: number;
  budgetMax?: number;
  salary?: string;
  description: string;
  isCompanyView?: boolean;
  onDelete?: () => void;
}

const OpportunityCard = ({ 
  id,
  title, 
  company, 
  location, 
  type, 
  duration, 
  budgetMin,
  budgetMax,
  salary,
  description,
  isCompanyView = false,
  onDelete
}: OpportunityCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [message, setMessage] = useState("");
  const { session } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleApply = async () => {
    if (!session) {
      navigate("/auth");
      return;
    }

    setIsDialogOpen(true);
  };

  const handleSubmitApplication = async () => {
    try {
      // First get the AI builder profile
      const { data: profile } = await supabase
        .from("profiles")
        .select("id")
        .eq("user_id", session?.user.id)
        .single();

      if (!profile) {
        throw new Error("Perfil no encontrado. Completa tu perfil primero.");
      }

      const { error } = await supabase.from("applications").insert({
        opportunity_id: id,
        ai_builder_id: profile.id,
        message: message
      });

      if (error) throw error;

      toast({
        title: "Aplicación exitosa",
        description: "Tu aplicación ha sido enviada correctamente.",
      });

      setIsDialogOpen(false);
      setMessage("");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleEdit = () => {
    navigate(`/opportunities/edit/${id}`);
  };

  const handleDelete = async () => {
    try {
      const { error } = await supabase
        .from("opportunities")
        .delete()
        .eq("id", id)
        .eq("company_id", (await supabase
          .from("profiles")
          .select("id")
          .eq("user_id", session?.user.id)
          .single()).data?.id);

      if (error) throw error;

      toast({
        title: "Oportunidad eliminada",
        description: "La oportunidad ha sido eliminada exitosamente.",
      });

      setIsDeleteDialogOpen(false);
      if (onDelete) onDelete();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-lg">{title}</CardTitle>
              <p className="text-sm text-gray-600">{company}</p>
            </div>
            {isCompanyView && (
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleEdit}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsDeleteDialogOpen(true)}
                  className="text-destructive hover:text-destructive/90"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
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
            <span>{budgetMin && budgetMax 
              ? `$${budgetMin} - $${budgetMax}` 
              : salary || 'Por definir'}</span>
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

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Aplicar a {title}</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Textarea
              placeholder="Escribe un mensaje para la empresa (opcional)"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              className="resize-none"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSubmitApplication}>
              Enviar aplicación
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Eliminar Oportunidad</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>¿Estás seguro de que quieres eliminar esta oportunidad? Esta acción no se puede deshacer.</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default OpportunityCard;
