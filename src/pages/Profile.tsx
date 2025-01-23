import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Mail, MapPin, Building, Plus, Trash, GraduationCap, School } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useQuery } from "@tanstack/react-query";
import OpportunityCard from "@/components/OpportunityCard";
import { Textarea } from "@/components/ui/textarea";

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const { session } = useAuth();
  const { toast } = useToast();
  const userId = session?.user.id;

  const { data: profile, refetch: refetchProfile } = useQuery({
    queryKey: ['profile', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!userId,
  });

  const [formData, setFormData] = useState({
    full_name: profile?.full_name || '',
    university: profile?.university || '',
    career: profile?.career || '',
    student_id: profile?.student_id || '',
    graduation_year: profile?.graduation_year || '',
    major: profile?.major || '',
    gpa: profile?.gpa || '',
    bio: profile?.bio || '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update(formData)
        .eq('id', userId);

      if (error) throw error;

      toast({
        title: "Perfil actualizado",
        description: "Los cambios han sido guardados exitosamente.",
      });

      setIsEditing(false);
      refetchProfile();
    } catch (error: any) {
      toast({
        title: "Error",
        description: "No se pudo actualizar el perfil. Por favor intenta de nuevo.",
        variant: "destructive",
      });
    }
  };

  if (!profile) return <div>Cargando...</div>;

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex flex-col items-center">
              <Avatar className="w-32 h-32">
                <AvatarImage src={profile.avatar_url || "https://github.com/shadcn.png"} />
                <AvatarFallback>
                  {profile.full_name?.charAt(0) || 'S'}
                </AvatarFallback>
              </Avatar>
              <Button 
                variant={isEditing ? "default" : "outline"} 
                className="mt-4"
                onClick={() => {
                  if (isEditing) {
                    handleSave();
                  } else {
                    setIsEditing(true);
                  }
                }}
              >
                {isEditing ? 'Guardar Cambios' : 'Editar Perfil'}
              </Button>
              {isEditing && (
                <Button 
                  variant="outline" 
                  className="mt-2"
                  onClick={() => setIsEditing(false)}
                >
                  Cancelar
                </Button>
              )}
            </div>
            
            <div className="flex-1">
              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Nombre Completo</label>
                    <Input
                      name="full_name"
                      value={formData.full_name}
                      onChange={handleInputChange}
                      placeholder="Nombre Completo"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">ID de Estudiante</label>
                    <Input
                      name="student_id"
                      value={formData.student_id}
                      onChange={handleInputChange}
                      placeholder="ID de Estudiante"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Universidad</label>
                    <Input
                      name="university"
                      value={formData.university}
                      onChange={handleInputChange}
                      placeholder="Universidad"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Carrera</label>
                    <Input
                      name="career"
                      value={formData.career}
                      onChange={handleInputChange}
                      placeholder="Carrera"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Major</label>
                    <Input
                      name="major"
                      value={formData.major}
                      onChange={handleInputChange}
                      placeholder="Major"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Año de Graduación</label>
                    <Input
                      name="graduation_year"
                      value={formData.graduation_year}
                      onChange={handleInputChange}
                      placeholder="Año de Graduación"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">GPA</label>
                    <Input
                      name="gpa"
                      value={formData.gpa}
                      onChange={handleInputChange}
                      placeholder="GPA"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Biografía</label>
                    <Textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      placeholder="Cuéntanos sobre ti"
                    />
                  </div>
                </div>
              ) : (
                <>
                  <h1 className="text-2xl font-bold mb-2">{profile.full_name || 'Sin nombre'}</h1>
                  <p className="text-gray-600 mb-4">{profile.bio || 'Sin biografía'}</p>
                  
                  <div className="grid gap-4">
                    <div className="flex items-center gap-2 text-gray-600">
                      <School size={20} />
                      <span>Universidad: {profile.university || 'No especificada'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <GraduationCap size={20} />
                      <span>Carrera: {profile.career || 'No especificada'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin size={20} />
                      <span>ID de Estudiante: {profile.student_id || 'No especificado'}</span>
                    </div>
                    {profile.major && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <Building size={20} />
                        <span>Major: {profile.major}</span>
                      </div>
                    )}
                    {profile.graduation_year && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <Mail size={20} />
                        <span>Año de Graduación: {profile.graduation_year}</span>
                      </div>
                    )}
                    {profile.gpa && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <Mail size={20} />
                        <span>GPA: {profile.gpa}</span>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;