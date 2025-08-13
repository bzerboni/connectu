import { Tables } from "@/integrations/supabase/types";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MapPin, DollarSign, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

type Profile = Tables<"profiles">;

interface AIBuilderExplorerProps {
  aiBuilders: Profile[];
}

export const AIBuilderExplorer = ({ aiBuilders }: AIBuilderExplorerProps) => {
  const navigate = useNavigate();

  const handleCardClick = (id: string) => {
    navigate(`/ai-builders/${id}`);
  };

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {aiBuilders?.map((aiBuilder) => (
        <Card
          key={aiBuilder.id}
          className="cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => handleCardClick(aiBuilder.id)}
        >
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={aiBuilder.avatar_url || ""} />
                <AvatarFallback>
                  {aiBuilder.full_name?.split(" ").map(n => n[0]).join("") || "AB"}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold text-lg">{aiBuilder.full_name || "Sin nombre"}</h3>
                <p className="text-gray-600 text-sm">AI Builder</p>
              </div>
            </div>
            
            {aiBuilder.location && (
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                <MapPin size={16} />
                <span>{aiBuilder.location}</span>
              </div>
            )}
            
            {aiBuilder.hourly_rate && (
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                <DollarSign size={16} />
                <span>${aiBuilder.hourly_rate}/hora</span>
              </div>
            )}

            {aiBuilder.bio && (
              <p className="text-sm text-gray-700 mb-4 line-clamp-2">
                {aiBuilder.bio}
              </p>
            )}

            <div className="flex flex-wrap gap-2 mb-4">
              {aiBuilder.skills?.slice(0, 3).map((skill, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {skill}
                </Badge>
              ))}
              {aiBuilder.skills && aiBuilder.skills.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{aiBuilder.skills.length - 3} más
                </Badge>
              )}
            </div>

            <div className="flex items-center justify-between">
              <Badge 
                variant={aiBuilder.available ? "default" : "secondary"}
                className="text-xs"
              >
                {aiBuilder.available ? "Disponible" : "Ocupado"}
              </Badge>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-medium">4.8</span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};