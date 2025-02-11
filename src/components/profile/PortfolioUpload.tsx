
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

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) return <Image className="h-5 w-5" />;
    if (fileType.startsWith('video/')) return <Video className="h-5 w-5" />;
    return <File className="h-5 w-5" />;
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
        <div className="grid gap-4 md:grid-cols-2">
          {portfolioItems.map((item) => (
            <Card key={item.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    {getFileIcon(item.file_type)}
                    <div>
                      <a
                        href={item.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium hover:underline"
                      >
                        {item.file_name}
                      </a>
                      {item.description && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {item.description}
                        </p>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:text-destructive/90"
                    onClick={() => handleDelete(item.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
