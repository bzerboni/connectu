
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, Building2, FileText, Calculator, MessageSquare, File, Image, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/AuthProvider";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

type PortfolioItem = {
  id: string;
  file_name: string;
  file_url: string;
  file_type: string;
  description: string;
  created_at: string;
};

const StudentProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { session } = useAuth();
  const { toast } = useToast();
  const [isContactDialogOpen, setIsContactDialogOpen] = useState(false);
  const [message, setMessage] = useState("");

  const { data: student } = useQuery({
    queryKey: ["student", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("student_profiles")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  const { data: portfolioItems } = useQuery({
    queryKey: ["portfolio", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("student_portfolio")
        .select("*")
        .eq("student_id", id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as PortfolioItem[];
    },
    enabled: !!id,
  });

  const getFilePreview = (item: PortfolioItem) => {
    if (item.file_type.startsWith('image/')) {
      return (
        <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-gray-100">
          <img
            src={item.file_url}
            alt={item.file_name}
            className="object-cover w-full h-full"
          />
        </div>
      );
    }
    
    if (item.file_type.startsWith('video/')) {
      return (
        <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-gray-100">
          <video
            src={item.file_url}
            controls
            className="w-full h-full"
          />
        </div>
      );
    }

    return (
      <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-gray-100 flex items-center justify-center">
        <div className="flex flex-col items-center gap-2 text-gray-500">
          <File className="h-12 w-12" />
          <span className="text-sm font-medium">{item.file_name.split('.').pop()?.toUpperCase()}</span>
        </div>
      </div>
    );
  };

  const handleContact = async () => {
    if (!session) {
      navigate("/auth");
      return;
    }

    try {
      const { error } = await supabase.from("messages").insert({
        content: message,
        sender_id: session.user.id,
        receiver_id: id,
      });

      if (error) throw error;

      toast({
        title: "Mensaje enviado",
        description: "Tu mensaje ha sido enviado exitosamente.",
      });

      setIsContactDialogOpen(false);
      setMessage("");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (!student) return <div>No se encontró el estudiante</div>;

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <Card>
        <CardHeader className="flex flex-row items-start gap-4">
          <Avatar className="w-20 h-20">
            <AvatarImage src={student.avatar_url || undefined} />
            <AvatarFallback>{student.full_name?.charAt(0) || "S"}</AvatarFallback>
          </Avatar>
          <div className="flex flex-1 justify-between items-start">
            <div>
              <CardTitle className="text-2xl">{student.full_name}</CardTitle>
              <p className="text-gray-600">{student.career}</p>
            </div>
            <Button
              onClick={() => setIsContactDialogOpen(true)}
              className="flex items-center gap-2"
            >
              <MessageSquare className="h-4 w-4" />
              Contactar
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-gray-500" />
              <span>{student.university}</span>
            </div>
            <div className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-gray-500" />
              <span>Graduación: {student.graduation_year}</span>
            </div>
            {student.major && (
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-gray-500" />
                <span>Especialidad: {student.major}</span>
              </div>
            )}
            {student.gpa && (
              <div className="flex items-center gap-2">
                <Calculator className="h-5 w-5 text-gray-500" />
                <span>Promedio: {student.gpa}</span>
              </div>
            )}
          </div>

          {student.bio && (
            <div>
              <h3 className="font-semibold mb-2">Biografía</h3>
              <p className="text-gray-600">{student.bio}</p>
            </div>
          )}

          {student.cv_url && (
            <div>
              <Button asChild>
                <a href={student.cv_url} target="_blank" rel="noopener noreferrer">
                  Ver CV
                </a>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {portfolioItems && portfolioItems.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Portafolio</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {portfolioItems.map((item) => (
                <Card key={item.id} className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="relative">
                      {getFilePreview(item)}
                    </div>
                    <div className="p-4">
                      <a
                        href={item.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium hover:underline block"
                      >
                        {item.file_name}
                      </a>
                      {item.description && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {item.description}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Dialog open={isContactDialogOpen} onOpenChange={setIsContactDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Contactar a {student.full_name}</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Textarea
              placeholder="Escribe tu mensaje..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              className="resize-none"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsContactDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleContact}>
              Enviar mensaje
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StudentProfile;
