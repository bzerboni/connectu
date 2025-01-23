import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock } from "lucide-react";

interface OpportunityCardProps {
  title: string;
  company: string;
  location: string;
  type: string;
  duration: string;
}

const OpportunityCard = ({ title, company, location, type, duration }: OpportunityCardProps) => {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
        <p className="text-sm text-gray-600">{company}</p>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
          <MapPin size={16} />
          <span>{location}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
          <Clock size={16} />
          <span>{duration}</span>
        </div>
        <Badge variant="secondary" className="bg-primary/10 text-primary">
          {type}
        </Badge>
      </CardContent>
    </Card>
  );
};

export default OpportunityCard;