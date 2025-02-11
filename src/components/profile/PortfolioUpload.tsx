
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { Trash2, FileIcon, Image, Video, File } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

type PortfolioItem = {
  id: string;
  file_name: string;
  file_url: string;
  file_type: string;
  description: string;
  created_at: string;
};

export const PortfolioUpload = () => {
  const { session } = useAuth();
  const { toast } = useToast();
  const [description, setDescription] = useState("");
  const userId = session?.user.id;

  const { data: portfolioItems, refetch: refetchPortfolio } = useQuery({
    queryKey: ['portfolio', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('student_portfolio')
        .select('*')
        .eq('student_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as PortfolioItem[];
    },
    enabled: !!userId,
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

    // Para documentos, mostramos un icono más elaborado
    return (
      <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-gray-100 flex items-center justify-center">
        <div className="flex flex-col items-center gap-2 text-gray-500">
          <File className="h-12 w-12" />
          <span className="text-sm font-medium">{item.file_name.split('.').pop()?.toUpperCase()}</span>
        </div>
      </div>
    );
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}/${crypto.randomUUID()}.${fileExt}`;

    try {
      const { error: uploadError } = await supabase.storage
        .from('student_files')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('student_files')
        .getPublicUrl(fileName);

      const { error: dbError } = await supabase
        .from('student_portfolio')
        .insert({
          student_id: userId,
          file_name: file.name,
          file_url: publicUrl,
          file_type: file.type,
          description: description,
        });

      if (dbError) throw dbError;

      toast({
        title: "Archivo subido exitosamente",
        description: "Tu archivo ha sido agregado a tu portafolio.",
      });

      setDescription("");
      refetchPortfolio();
    } catch (error: any) {
      toast({
        title: "Error",
        description: `No se pudo subir el archivo. ${error.message}`,
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('student_portfolio')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Archivo eliminado",
        description: "El archivo ha sido eliminado de tu portafolio.",
      });

      refetchPortfolio();
    } catch (error: any) {
      toast({
        title: "Error",
        description: `No se pudo eliminar el archivo. ${error.message}`,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4">Portafolio</h3>
          
          <div className="space-y-4">
            <Textarea
              placeholder="Descripción del archivo..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="resize-none"
            />
            
            <Input
              type="file"
              accept="image/*,video/*,.pdf,.doc,.docx"
              className="hidden"
              id="portfolio-upload"
              onChange={handleFileUpload}
            />
            <label htmlFor="portfolio-upload">
              <Button variant="outline" className="w-full cursor-pointer" asChild>
                <span className="flex items-center gap-2">
                  <FileIcon size={16} />
                  Subir Archivo
                </span>
              </Button>
            </label>
          </div>
        </CardContent>
      </Card>

      {portfolioItems && portfolioItems.length > 0 && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {portfolioItems.map((item) => (
            <Card key={item.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="relative">
                  {getFilePreview(item)}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 text-destructive hover:text-destructive/90 bg-white/90 hover:bg-white shadow-sm"
                    onClick={() => handleDelete(item.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
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
      )}
    </div>
  );
};
