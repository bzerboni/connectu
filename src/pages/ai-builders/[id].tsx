import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, DollarSign, Globe, Star, MessageSquare } from "lucide-react";

const AIBuilderProfile = () => {
  const { id } = useParams();

  const { data: aiBuilder, isLoading } = useQuery({
    queryKey: ["ai_builder", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", id)
        .eq("user_type", "ai_builder")
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  const { data: portfolio } = useQuery({
    queryKey: ["portfolio", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("portfolio")
        .select("*")
        .eq("ai_builder_id", id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  if (isLoading) {
    return <div className="container mx-auto px-4 py-8">Cargando...</div>;
  }

  if (!aiBuilder) {
    return <div className="container mx-auto px-4 py-8">AI Builder no encontrado</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader className="text-center">
              <Avatar className="h-32 w-32 mx-auto mb-4">
                <AvatarImage src={aiBuilder.avatar_url || ""} />
                <AvatarFallback className="text-2xl">
                  {aiBuilder.full_name?.split(" ").map(n => n[0]).join("") || "AB"}
                </AvatarFallback>
              </Avatar>
              <CardTitle className="text-2xl">{aiBuilder.full_name}</CardTitle>
              <p className="text-gray-600">AI Builder</p>
              <div className="flex items-center justify-center gap-1 mt-2">
                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                <span className="font-medium">4.8</span>
                <span className="text-gray-500">(24 reseñas)</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {aiBuilder.location && (
                <div className="flex items-center gap-2">
                  <MapPin size={16} className="text-gray-500" />
                  <span>{aiBuilder.location}</span>
                </div>
              )}
              
              {aiBuilder.hourly_rate && (
                <div className="flex items-center gap-2">
                  <DollarSign size={16} className="text-gray-500" />
                  <span>${aiBuilder.hourly_rate}/hora</span>
                </div>
              )}

              {aiBuilder.website && (
                <div className="flex items-center gap-2">
                  <Globe size={16} className="text-gray-500" />
                  <a 
                    href={aiBuilder.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    Sitio web
                  </a>
                </div>
              )}

              <div>
                <Badge 
                  variant={aiBuilder.available ? "default" : "secondary"}
                  className="w-full justify-center"
                >
                  {aiBuilder.available ? "Disponible" : "Ocupado"}
                </Badge>
              </div>

              <Button className="w-full">
                <MessageSquare className="mr-2 h-4 w-4" />
                Contactar
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* About */}
          <Card>
            <CardHeader>
              <CardTitle>Sobre mí</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">
                {aiBuilder.bio || "Este AI Builder aún no ha completado su biografía."}
              </p>
            </CardContent>
          </Card>

          {/* Skills */}
          {aiBuilder.skills && aiBuilder.skills.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Habilidades</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {aiBuilder.skills.map((skill, index) => (
                    <Badge key={index} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Portfolio */}
          {portfolio && portfolio.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Portafolio</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {portfolio.map((item) => (
                    <Card key={item.id} className="overflow-hidden">
                      <CardContent className="p-4">
                        <h4 className="font-semibold mb-2">{item.title}</h4>
                        {item.description && (
                          <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                        )}
                        {item.technologies && item.technologies.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-2">
                            {item.technologies.map((tech, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {tech}
                              </Badge>
                            ))}
                          </div>
                        )}
                        {item.project_url && (
                          <a 
                            href={item.project_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-primary hover:underline text-sm"
                          >
                            Ver proyecto
                          </a>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIBuilderProfile;