import { Building, Globe, Users, FileText, Link, MapPin, Clock, DollarSign } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

type ProfileViewProps = {
  isCompany: boolean;
  profile: {
    company_name?: string | null;
    company_description?: string | null;
    company_website?: string | null;
    company_size?: string | null;
  };
};

export const ProfileView = ({ isCompany, profile }: ProfileViewProps) => {
  const { data: opportunities } = useQuery({
    queryKey: ['company_opportunities', profile.company_name],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('opportunities')
        .select('*')
        .eq('company_id', profile.id);

      if (error) throw error;
      return data;
    },
    enabled: !!isCompany,
  });

  if (!isCompany) return null;

  return (
    <div className="space-y-8">
      {/* Información de la empresa */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-primary/10 rounded-lg">
            <Building className="h-6 w-6 text-primary" />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold mb-2">
              {profile.company_name || 'Sin nombre'}
            </h1>
            <p className="text-gray-600 mb-4">
              {profile.company_description || 'Sin descripción'}
            </p>
            
            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex items-center gap-2 text-gray-600">
                <Globe className="h-5 w-5" />
                {profile.company_website ? (
                  <a 
                    href={profile.company_website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline flex items-center gap-1"
                  >
                    {profile.company_website}
                    <Link size={14} />
                  </a>
                ) : (
                  <span>No especificado</span>
                )}
              </div>
              
              <div className="flex items-center gap-2 text-gray-600">
                <Users className="h-5 w-5" />
                <span>{profile.company_size || 'Tamaño no especificado'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Oportunidades laborales */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Oportunidades Laborales
        </h2>
        
        <div className="grid gap-4 md:grid-cols-2">
          {opportunities?.map((opportunity) => (
            <Card key={opportunity.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <h3 className="font-semibold mb-2">{opportunity.title}</h3>
                
                <div className="space-y-2 text-sm text-gray-600 mb-3">
                  <div className="flex items-center gap-2">
                    <MapPin size={16} />
                    <span>{opportunity.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={16} />
                    <span>{opportunity.duration}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign size={16} />
                    <span>{opportunity.salary}</span>
                  </div>
                </div>

                <Badge variant="secondary" className="bg-primary/10 text-primary">
                  {opportunity.type}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};