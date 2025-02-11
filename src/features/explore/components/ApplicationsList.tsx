
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { GraduationCap, Building2, Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";

type Application = Tables<"applications">;
type Opportunity = Tables<"opportunities">;

interface ApplicationWithProfile extends Application {
  profiles: {
    full_name: string | null;
    avatar_url: string | null;
    career: string | null;
    university: string | null;
    graduation_year: string | null;
    student_id: string | null;
  };
  opportunities: Opportunity;
}

interface ApplicationsListProps {
  applications: ApplicationWithProfile[];
}

export const ApplicationsList = ({ applications }: ApplicationsListProps) => {
  const { toast } = useToast();

  const handleContact = async (studentId: string) => {
    try {
      const { error } = await supabase.from("messages").insert({
        sender_id: (await supabase.auth.getSession()).data.session?.user.id,
        receiver_id: studentId,
        content: "¡Hola! Me gustaría contactarte respecto a tu perfil.",
      });

      if (error) throw error;

      toast({
        title: "Mensaje enviado",
        description: "Se ha enviado un mensaje inicial al estudiante.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (!applications.length) return null;

  return (
    <div className="mb-12">
      <h2 className="text-2xl font-semibold mb-6">Aplicaciones Recibidas</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {applications.map((application) => (
          <Card key={application.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center gap-4">
              <Avatar className="w-12 h-12">
                <AvatarImage src={application.profiles.avatar_url || undefined} />
                <AvatarFallback>
                  {application.profiles.full_name?.charAt(0) || "S"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <CardTitle className="text-lg">
                  {application.profiles.full_name}
                </CardTitle>
                <p className="text-sm text-gray-600">
                  {application.profiles.career}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
                onClick={() => handleContact(application.profiles.student_id || "")}
              >
                <Mail size={16} />
                Contactar
              </Button>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <h4 className="font-semibold mb-1">Aplicó a:</h4>
                <p className="text-sm text-gray-600">
                  {application.opportunities.title}
                </p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <GraduationCap size={16} />
                  <span>{application.profiles.university}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Building2 size={16} />
                  <span>{application.profiles.graduation_year}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
