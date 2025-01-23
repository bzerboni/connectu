import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Mail, MapPin, Building, Plus, Edit, Trash } from "lucide-react";
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
  const [isAddingOpportunity, setIsAddingOpportunity] = useState(false);
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

  const { data: opportunities, refetch: refetchOpportunities } = useQuery({
    queryKey: ['opportunities', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('opportunities')
        .select('*')
        .eq('company_id', userId);

      if (error) throw error;
      return data;
    },
    enabled: !!userId && profile?.role === 'company',
  });

  const [formData, setFormData] = useState({
    full_name: profile?.full_name || '',
    company_name: profile?.company_name || '',
    company_description: profile?.company_description || '',
    company_website: profile?.company_website || '',
    company_size: profile?.company_size || '',
  });

  const [newOpportunity, setNewOpportunity] = useState({
    title: '',
    description: '',
    location: '',
    type: '',
    duration: '',
    salary: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleOpportunityInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewOpportunity(prev => ({
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

  const handleAddOpportunity = async () => {
    try {
      const { error } = await supabase
        .from('opportunities')
        .insert({
          ...newOpportunity,
          company_id: userId,
        });

      if (error) throw error;

      toast({
        title: "Oportunidad creada",
        description: "La oportunidad ha sido creada exitosamente.",
      });

      setIsAddingOpportunity(false);
      setNewOpportunity({
        title: '',
        description: '',
        location: '',
        type: '',
        duration: '',
        salary: '',
      });
      refetchOpportunities();
    } catch (error: any) {
      toast({
        title: "Error",
        description: "No se pudo crear la oportunidad. Por favor intenta de nuevo.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteOpportunity = async (id: string) => {
    try {
      const { error } = await supabase
        .from('opportunities')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Oportunidad eliminada",
        description: "La oportunidad ha sido eliminada exitosamente.",
      });

      refetchOpportunities();
    } catch (error: any) {
      toast({
        title: "Error",
        description: "No se pudo eliminar la oportunidad. Por favor intenta de nuevo.",
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
                  {profile.company_name?.charAt(0) || 'C'}
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
                    setFormData({
                      full_name: profile.full_name || '',
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
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Nombre del Contacto</label>
                    <Input
                      name="full_name"
                      value={formData.full_name}
                      onChange={handleInputChange}
                      placeholder="Nombre del Contacto"
                    />
                  </div>
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
                      placeholder="Sitio Web"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Tamaño de la Empresa</label>
                    <Input
                      name="company_size"
                      value={formData.company_size}
                      onChange={handleInputChange}
                      placeholder="Tamaño de la Empresa"
                    />
                  </div>
                </div>
              ) : (
                <>
                  <h1 className="text-2xl font-bold mb-2">{profile.company_name || 'Sin nombre de empresa'}</h1>
                  <p className="text-gray-600 mb-4">{profile.company_description || 'Sin descripción'}</p>
                  
                  <div className="grid gap-4">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Building size={20} />
                      <span>Tamaño: {profile.company_size || 'No especificado'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin size={20} />
                      <span>Contacto: {profile.full_name || 'No especificado'}</span>
                    </div>
                    {profile.company_website && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <Mail size={20} />
                        <a href={profile.company_website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                          {profile.company_website}
                        </a>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {profile.role === 'company' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Oportunidades de Trabajo</h2>
            <Button onClick={() => setIsAddingOpportunity(true)}>
              <Plus className="mr-2 h-4 w-4" /> Agregar Oportunidad
            </Button>
          </div>

          {isAddingOpportunity && (
            <Card>
              <CardContent className="p-6 space-y-4">
                <h3 className="text-lg font-semibold">Nueva Oportunidad</h3>
                <div>
                  <label className="block text-sm font-medium mb-1">Título</label>
                  <Input
                    name="title"
                    value={newOpportunity.title}
                    onChange={handleOpportunityInputChange}
                    placeholder="Título de la posición"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Descripción</label>
                  <Textarea
                    name="description"
                    value={newOpportunity.description}
                    onChange={handleOpportunityInputChange}
                    placeholder="Descripción detallada de la posición"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Ubicación</label>
                  <Input
                    name="location"
                    value={newOpportunity.location}
                    onChange={handleOpportunityInputChange}
                    placeholder="Ubicación"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Tipo</label>
                  <Input
                    name="type"
                    value={newOpportunity.type}
                    onChange={handleOpportunityInputChange}
                    placeholder="Tipo de trabajo (ej: Tiempo completo, Medio tiempo)"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Duración</label>
                  <Input
                    name="duration"
                    value={newOpportunity.duration}
                    onChange={handleOpportunityInputChange}
                    placeholder="Duración"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Salario</label>
                  <Input
                    name="salary"
                    value={newOpportunity.salary}
                    onChange={handleOpportunityInputChange}
                    placeholder="Rango salarial"
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleAddOpportunity}>
                    Crear Oportunidad
                  </Button>
                  <Button variant="outline" onClick={() => setIsAddingOpportunity(false)}>
                    Cancelar
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="grid gap-4">
            {opportunities?.map((opportunity) => (
              <div key={opportunity.id} className="relative">
                <OpportunityCard
                  title={opportunity.title}
                  company={profile.company_name || ''}
                  location={opportunity.location}
                  type={opportunity.type}
                  duration={opportunity.duration}
                  salary={opportunity.salary}
                  description={opportunity.description}
                  isCompanyView={true}
                />
                <Button
                  variant="destructive"
                  size="sm"
                  className="absolute top-4 right-4"
                  onClick={() => handleDeleteOpportunity(opportunity.id)}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;