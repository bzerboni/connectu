import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { AvatarUpload } from "@/components/profile/AvatarUpload";
import { CVUpload } from "@/components/profile/CVUpload";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { ProfileView } from "@/components/profile/ProfileView";

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const { session } = useAuth();
  const { toast } = useToast();
  const userId = session?.user.id;
  const [formData, setFormData] = useState({
    full_name: '',
    university: '',
    career: '',
    graduation_year: '',
    bio: '',
    company_name: '',
    company_description: '',
    company_website: '',
    company_size: '',
  });

  const { data: userProfile } = useQuery({
    queryKey: ['user_role', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!userId,
  });

  const isCompany = userProfile?.role === 'company';

  const { data: studentProfile } = useQuery({
    queryKey: ['student_profile', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('student_profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!userId && !isCompany,
  });

  const { data: profile, isLoading, error, refetch: refetchProfile } = useQuery({
    queryKey: ['profile', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!userId,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, fileType: 'cv' | 'avatar') => {
    if (!e.target.files || e.target.files.length === 0) {
      return;
    }
    const file = e.target.files[0];
    const fileExt = file.name.split('.').pop();
    const filePath = `${userId}/${fileType}.${fileExt}`;

    try {
      const { error: uploadError } = await supabase.storage
        .from('student_files')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('student_files')
        .getPublicUrl(filePath);

      if (fileType === 'cv' && !isCompany) {
        const { error: updateError } = await supabase
          .from('student_profiles')
          .update({ cv_url: publicUrl })
          .eq('id', userId);

        if (updateError) throw updateError;
      } else {
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ avatar_url: publicUrl })
          .eq('id', userId);

        if (updateError) throw updateError;
      }

      toast({
        title: "Archivo subido exitosamente",
        description: `Tu ${fileType === 'cv' ? 'CV' : 'foto'} ha sido actualizado.`,
      });

      refetchProfile();
    } catch (error: any) {
      toast({
        title: "Error",
        description: `No se pudo subir el archivo. ${error.message}`,
        variant: "destructive",
      });
    }
  };

  const handleCreateProfile = async () => {
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: userId,
          ...formData,
          role: isCompany ? 'company' : 'student'
        });

      if (error) throw error;

      toast({
        title: "Perfil creado",
        description: "Tu perfil ha sido creado exitosamente.",
      });

      refetchProfile();
      setIsEditing(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "No se pudo crear el perfil. Por favor intenta de nuevo.",
        variant: "destructive",
      });
    }
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

  if (isLoading) return <div className="container mx-auto px-4 py-8">Cargando...</div>;

  if (!profile) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold mb-4">Crear Perfil</h2>
            <ProfileForm
              formData={formData}
              isCompany={isCompany}
              onChange={handleInputChange}
            />
            <Button 
              className="mt-4"
              onClick={handleCreateProfile}
            >
              Crear Perfil
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex flex-col items-center">
              <AvatarUpload
                avatarUrl={profile.avatar_url}
                fullName={profile.full_name}
                onFileUpload={(e) => handleFileUpload(e, 'avatar')}
              />
              
              {!isCompany && (
                <CVUpload
                  cvUrl={studentProfile?.cv_url}
                  onFileUpload={(e) => handleFileUpload(e, 'cv')}
                />
              )}
              
              <Button 
                variant={isEditing ? "default" : "outline"} 
                className="mt-4"
                onClick={() => {
                  if (isEditing) {
                    handleSave();
                  } else {
                    setIsEditing(true);
                    setFormData({
                      full_name: profile.full_name || '',
                      university: profile.university || '',
                      career: profile.career || '',
                      graduation_year: profile.graduation_year || '',
                      bio: profile.bio || '',
                      company_name: profile.company_name || '',
                      company_description: profile.company_description || '',
                      company_website: profile.company_website || '',
                      company_size: profile.company_size || '',
                    });
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
                <ProfileForm
                  formData={formData}
                  isCompany={isCompany}
                  onChange={handleInputChange}
                />
              ) : (
                <ProfileView
                  isCompany={isCompany}
                  profile={profile}
                />
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;