
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

type CompanyProfile = {
  id: string;
  avatar_url: string | null;
  company_name: string | null;
  company_description: string | null;
  company_website: string | null;
  company_size: string | null;
  created_at: string;
  updated_at: string;
};

type StudentProfile = {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  cv_url: string | null;
  university: string | null;
  career: string | null;
  student_id: string | null;
  graduation_year: string | null;
  major: string | null;
  gpa: string | null;
  bio: string | null;
  created_at: string;
  updated_at: string;
};

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const { session } = useAuth();
  const { toast } = useToast();
  const userId = session?.user.id;
  const [formData, setFormData] = useState({
    full_name: '',
    university: '',
    career: '',
    student_id: '',
    graduation_year: '',
    major: '',
    gpa: '',
    bio: '',
    company_name: '',
    company_description: '',
    company_website: '',
    company_size: '',
  });

  const { data: userProfile, isLoading: roleLoading } = useQuery({
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
      if (isCompany) {
        const { data, error } = await supabase
          .from('company_profiles')
          .select('*')
          .eq('id', userId)
          .maybeSingle();

        if (error) throw error;
        return data as CompanyProfile;
      } else {
        const { data, error } = await supabase
          .from('student_profiles')
          .select('*')
          .eq('id', userId)
          .maybeSingle();

        if (error) throw error;
        return data as StudentProfile;
      }
    },
    enabled: !!userId && !roleLoading,
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
    const fileName = `${userId}-${fileType}${fileExt ? `.${fileExt}` : ''}`;

    try {
      const { error: uploadError } = await supabase.storage
        .from(fileType === 'cv' ? 'student_files' : 'avatars')
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from(fileType === 'cv' ? 'student_files' : 'avatars')
        .getPublicUrl(fileName);

      if (fileType === 'cv') {
        const { error: updateError } = await supabase
          .from('student_profiles')
          .update({ cv_url: publicUrl })
          .eq('id', userId);

        if (updateError) throw updateError;
      } else {
        const { error: updateError } = await supabase
          .from(isCompany ? 'company_profiles' : 'student_profiles')
          .update({ avatar_url: publicUrl })
          .eq('id', userId);

        if (updateError) throw updateError;
      }

      toast({
        title: "Archivo subido exitosamente",
        description: `Tu ${fileType === 'cv' ? 'CV' : 'foto de perfil'} ha sido actualizado.`,
      });

      refetchProfile();
    } catch (error: any) {
      console.error('Error uploading file:', error);
      toast({
        title: "Error",
        description: `No se pudo subir el archivo. ${error.message}`,
        variant: "destructive",
      });
    }
  };

  const handleCreateProfile = async () => {
    try {
      if (isCompany) {
        const { error } = await supabase
          .from('company_profiles')
          .upsert({
            id: userId,
            company_name: formData.company_name,
            company_description: formData.company_description,
            company_website: formData.company_website,
            company_size: formData.company_size,
          });

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('student_profiles')
          .upsert({
            id: userId,
            full_name: formData.full_name,
            university: formData.university,
            career: formData.career,
            student_id: formData.student_id,
            graduation_year: formData.graduation_year,
            major: formData.major,
            gpa: formData.gpa,
            bio: formData.bio,
          });

        if (error) throw error;
      }

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
      if (isCompany) {
        const { error } = await supabase
          .from('company_profiles')
          .update({
            company_name: formData.company_name,
            company_description: formData.company_description,
            company_website: formData.company_website,
            company_size: formData.company_size,
          })
          .eq('id', userId);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('student_profiles')
          .update({
            full_name: formData.full_name,
            university: formData.university,
            career: formData.career,
            student_id: formData.student_id,
            graduation_year: formData.graduation_year,
            major: formData.major,
            gpa: formData.gpa,
            bio: formData.bio,
          })
          .eq('id', userId);

        if (error) throw error;
      }

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
                fullName={isCompany ? (profile as CompanyProfile).company_name : (profile as StudentProfile).full_name}
                onFileUpload={(e) => handleFileUpload(e, 'avatar')}
              />
              
              {!isCompany && studentProfile && (
                <CVUpload
                  cvUrl={studentProfile.cv_url}
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
                    if (isCompany) {
                      const companyProfile = profile as CompanyProfile;
                      setFormData({
                        ...formData,
                        company_name: companyProfile.company_name || '',
                        company_description: companyProfile.company_description || '',
                        company_website: companyProfile.company_website || '',
                        company_size: companyProfile.company_size || '',
                      });
                    } else {
                      const studentProfile = profile as StudentProfile;
                      setFormData({
                        ...formData,
                        full_name: studentProfile.full_name || '',
                        university: studentProfile.university || '',
                        career: studentProfile.career || '',
                        student_id: studentProfile.student_id || '',
                        graduation_year: studentProfile.graduation_year || '',
                        major: studentProfile.major || '',
                        gpa: studentProfile.gpa || '',
                        bio: studentProfile.bio || '',
                      });
                    }
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
