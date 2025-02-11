
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/components/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useQuery } from '@tanstack/react-query';

const NewOpportunity = () => {
  const { session } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { id } = useParams(); // Obtenemos el ID de la URL si estamos editando
  const isEditing = !!id;

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    type: '',
    duration: '',
    salary: '',
  });

  // Si estamos editando, cargamos los datos de la oportunidad
  const { data: opportunity } = useQuery({
    queryKey: ['opportunity', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('opportunities')
        .select('*')
        .eq('id', id)
        .eq('company_id', session?.user.id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: isEditing && !!session?.user.id,
    onSuccess: (data) => {
      if (data) {
        setFormData(data);
      }
    },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (isEditing) {
        // Si estamos editando, actualizamos la oportunidad existente
        const { error } = await supabase
          .from('opportunities')
          .update({
            ...formData,
            company_id: session?.user.id,
          })
          .eq('id', id)
          .eq('company_id', session?.user.id);

        if (error) throw error;

        toast({
          title: "Oportunidad actualizada",
          description: "La oportunidad laboral ha sido actualizada exitosamente.",
        });
      } else {
        // Si es nueva, la creamos
        const { error } = await supabase
          .from('opportunities')
          .insert({
            ...formData,
            company_id: session?.user.id,
          });

        if (error) throw error;

        toast({
          title: "Oportunidad creada",
          description: "La oportunidad laboral ha sido creada exitosamente.",
        });
      }

      navigate('/profile');
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>{isEditing ? 'Editar Oportunidad Laboral' : 'Crear Nueva Oportunidad Laboral'}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="title">Título</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Ej: Desarrollador Frontend Senior"
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Descripción</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe la posición, responsabilidades y requisitos"
                required
              />
            </div>

            <div>
              <Label htmlFor="location">Ubicación</Label>
              <Input
                id="location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="Ej: Ciudad de México"
                required
              />
            </div>

            <div>
              <Label htmlFor="type">Tipo de Trabajo</Label>
              <Input
                id="type"
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                placeholder="Ej: Tiempo completo, Medio tiempo, Por proyecto"
                required
              />
            </div>

            <div>
              <Label htmlFor="duration">Duración</Label>
              <Input
                id="duration"
                name="duration"
                value={formData.duration}
                onChange={handleInputChange}
                placeholder="Ej: 6 meses, Indefinido"
                required
              />
            </div>

            <div>
              <Label htmlFor="salary">Salario</Label>
              <Input
                id="salary"
                name="salary"
                value={formData.salary}
                onChange={handleInputChange}
                placeholder="Ej: $30,000 - $40,000 MXN mensual"
                required
              />
            </div>

            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/profile')}
              >
                Cancelar
              </Button>
              <Button type="submit">
                {isEditing ? 'Guardar Cambios' : 'Crear Oportunidad'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default NewOpportunity;
