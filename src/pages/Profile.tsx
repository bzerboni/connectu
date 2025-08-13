import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { AvatarUpload } from "@/components/profile/AvatarUpload";
import { CVUpload } from "@/components/profile/CVUpload";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { ProfileView } from "@/components/profile/ProfileView";
import { useNavigate } from "react-router-dom";
import OpportunityCard from "@/components/OpportunityCard";
import { PortfolioUpload } from "@/components/profile/PortfolioUpload";

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
  const navigate = useNavigate();
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

  const { data: userProfile, isLoading: isProfileLoading, refetch: refetchProfile } = useQuery({
    queryKey: ['user_profile', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!userId,
  });

  const isCompany = userProfile?.user_type === 'company';
  const profile = userProfile;

  const { data: opportunities, refetch: refetchOpportunities } = useQuery({
    queryKey: ['company_opportunities', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('opportunities')
        .select('*')
        .eq('company_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!userId && isCompany,
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
        // CV functionality removed for AI builders
      } else {
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ avatar_url: publicUrl })
          .eq('user_id', userId);

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
      const { error } = await supabase
        .from('profiles')
        .upsert({
          user_id: userId,
          user_type: isCompany ? 'company' : 'ai_builder',
          company_name: isCompany ? formData.company_name : null,
          full_name: !isCompany ? formData.full_name : null,
          bio: formData.bio,
          website: formData.company_website,
        });

      if (error) throw error;

      toast({
        title: "Perfil creado",
        description: "Tu perfil ha sido creado exitosamente.",
      });

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
        .update({
          company_name: isCompany ? formData.company_name : null,
          full_name: !isCompany ? formData.full_name : null,
          bio: formData.bio,
          website: formData.company_website,
        })
        .eq('user_id', userId);

      if (error) throw error;

      toast({
        title: "Perfil actualizado",
        description: "Los cambios han sido guardados exitosamente.",
      });

      setIsEditing(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "No se pudo actualizar el perfil. Por favor intenta de nuevo.",
        variant: "destructive",
      });
    }
  };

  if (isProfileLoading) return <div className="container mx-auto px-4 py-8">Cargando...</div>;

  if (!profile) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold mb-4">
              {isCompany ? "Crear Perfil de Empresa" : "Crear Perfil de Estudiante"}
            </h2>
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
                avatarUrl={profile?.avatar_url}
                fullName={isCompany ? profile?.company_name : profile?.full_name}
                onFileUpload={(e) => handleFileUpload(e, 'avatar')}
              />
              
              {!isCompany && (
                <PortfolioUpload />
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
                      ...formData,
                      company_name: profile?.company_name || '',
                      full_name: profile?.full_name || '',
                      bio: profile?.bio || '',
                      company_website: profile?.website || '',
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

              {isCompany && profile && (
                <Button
                  className="mt-4"
                  onClick={() => navigate('/opportunities/new')}
                >
                  Crear Oportunidad Laboral
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

      {isCompany && opportunities && opportunities.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Mis Oportunidades</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {opportunities.map((opportunity) => (
                <OpportunityCard
                  key={opportunity.id}
                  id={opportunity.id}
                  title={opportunity.title}
                  company={profile?.company_name || ""}
                  location={opportunity.location}
                  type={opportunity.type}
                  duration={opportunity.duration}
                  budgetMin={opportunity.budget_min}
                  budgetMax={opportunity.budget_max}
                  description={opportunity.description}
                  isCompanyView={true}
                  onDelete={() => refetchOpportunities()}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Profile;
