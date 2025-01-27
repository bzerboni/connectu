import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin, Building, GraduationCap, School, Upload } from "lucide-react";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { Textarea } from "@/components/ui/textarea";

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

  // Get user role from profiles table
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

  const { data: profile, isLoading, error, refetch: refetchProfile } = useQuery({
    queryKey: ['profile', userId, isCompany],
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

  useEffect(() => {
    if (profile) {
      if (isCompany) {
        setFormData({
          full_name: profile.full_name || '',
          company_name: profile.company_name || '',
          company_description: profile.company_description || '',
          company_website: profile.company_website || '',
          company_size: profile.company_size || '',
          bio: profile.bio || '',
          university: '',
          career: '',
          graduation_year: '',
        });
      } else {
        setFormData({
          full_name: profile.full_name || '',
          university: profile.university || '',
          career: profile.career || '',
          graduation_year: profile.graduation_year || '',
          bio: profile.bio || '',
          company_name: '',
          company_description: '',
          company_website: '',
          company_size: '',
        });
      }
    }
  }, [profile, isCompany]);

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

      const updateData = fileType === 'cv' 
        ? { cv_url: publicUrl }
        : { avatar_url: publicUrl };

      const { error: updateError } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', userId);

      if (updateError) throw updateError;

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

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-red-500">Error al cargar el perfil. Por favor intenta de nuevo.</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p>No se encontró el perfil. Por favor contacta a soporte.</p>
      </div>
    );
  }

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
              <Input
                type="file"
                accept="image/*"
                className="hidden"
                id="avatar-upload"
                onChange={(e) => handleFileUpload(e, 'avatar')}
              />
              <label htmlFor="avatar-upload">
                <Button variant="outline" className="mt-4 cursor-pointer" asChild>
                  <span>Cambiar Foto</span>
                </Button>
              </label>
              {!isCompany && (
                <>
                  <Input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    className="hidden"
                    id="cv-upload"
                    onChange={(e) => handleFileUpload(e, 'cv')}
                  />
                  <label htmlFor="cv-upload">
                    <Button variant="outline" className="mt-2 cursor-pointer" asChild>
                      <span className="flex items-center gap-2">
                        <Upload size={16} />
                        {profile.cv_url ? 'Actualizar CV' : 'Subir CV'}
                      </span>
                    </Button>
                  </label>
                  {profile.cv_url && (
                    <a
                      href={profile.cv_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 text-sm text-blue-600 hover:underline"
                    >
                      Ver CV actual
                    </a>
                  )}
                </>
              )}
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
                  {isCompany ? (
                    <>
                      <div>
                        <label className="block text-sm font-medium mb-1">Nombre de la Empresa</label>
                        <Input
                          name="company_name"
                          value={formData.company_name}
                          onChange={handleInputChange}
                          placeholder="Nombre de la Empresa"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Descripción de la Empresa</label>
                        <Textarea
                          name="company_description"
                          value={formData.company_description}
                          onChange={handleInputChange}
                          placeholder="Descripción de la Empresa"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Sitio Web</label>
                        <Input
                          name="company_website"
                          value={formData.company_website}
                          onChange={handleInputChange}
                          placeholder="https://ejemplo.com"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Tamaño de la Empresa</label>
                        <Input
                          name="company_size"
                          value={formData.company_size}
                          onChange={handleInputChange}
                          placeholder="Ej: 1-10 empleados"
                        />
                      </div>
                    </>
                  ) : (
                    <>
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
                        <label className="block text-sm font-medium mb-1">Año de Graduación</label>
                        <Input
                          name="graduation_year"
                          value={formData.graduation_year}
                          onChange={handleInputChange}
                          placeholder="Año de Graduación"
                        />
                      </div>
                    </>
                  )}
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
                  <h1 className="text-2xl font-bold mb-2">{isCompany ? profile.company_name : profile.full_name || 'Sin nombre'}</h1>
                  <p className="text-gray-600 mb-4">{profile.bio || 'Sin biografía'}</p>
                  
                  <div className="grid gap-4">
                    {isCompany ? (
                      <>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Building size={20} />
                          <span>Sitio Web: {profile.company_website || 'No especificado'}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <MapPin size={20} />
                          <span>Tamaño: {profile.company_size || 'No especificado'}</span>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex items-center gap-2 text-gray-600">
                          <School size={20} />
                          <span>Universidad: {profile.university || 'No especificada'}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <GraduationCap size={20} />
                          <span>Carrera: {profile.career || 'No especificada'}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Building size={20} />
                          <span>Año de Graduación: {profile.graduation_year || 'No especificado'}</span>
                        </div>
                      </>
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
