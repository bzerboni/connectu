import { useEffect, useState } from "react";
import SearchBar from "@/components/SearchBar";
import OpportunityCard from "@/components/OpportunityCard";
import { useAuth } from "@/components/AuthProvider";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { GraduationCap, Building2, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

type Profile = Tables<"profiles">;
type Opportunity = Tables<"opportunities">;
type Application = Tables<"applications">;

interface ApplicationWithProfile extends Application {
  profiles: Profile;
  opportunities: Opportunity;
}

const Explore = () => {
  const { session } = useAuth();
  const [userRole, setUserRole] = useState<string | null>(null);
  const { toast } = useToast();

  const { data: profile } = useQuery({
    queryKey: ["profile", session?.user.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session?.user.id)
        .single();

      if (error) throw error;
      return data as Profile;
    },
    enabled: !!session?.user.id,
  });

  const { data: students } = useQuery({
    queryKey: ["students"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("role", "student");

      if (error) throw error;
      return data as Profile[];
    },
    enabled: profile?.role === "company",
  });

  const { data: opportunities } = useQuery({
    queryKey: ["opportunities"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("opportunities")
        .select("*, profiles(company_name)");

      if (error) throw error;
      return data as (Opportunity & { profiles: { company_name: string | null } })[];
    },
    enabled: profile?.role === "student",
  });

  const { data: applications } = useQuery({
    queryKey: ["applications"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("applications")
        .select(`
          *,
          profiles!applications_user_id_fkey (*),
          opportunities (*)
        `)
        .eq("opportunities.company_id", session?.user.id);

      if (error) throw error;
      return data as ApplicationWithProfile[];
    },
    enabled: profile?.role === "company",
  });

  useEffect(() => {
    if (profile) {
      setUserRole(profile.role);
    }
  }, [profile]);

  const handleContact = async (studentEmail: string) => {
    window.location.href = `mailto:${studentEmail}`;
    
    toast({
      title: "Contacto iniciado",
      description: "Se ha abierto tu cliente de correo para contactar al estudiante.",
    });
  };

  const renderStudentCard = (student: Profile) => (
    <Card key={student.id} className="hover:shadow-lg transition-shadow">
      <CardHeader className="flex flex-row items-center gap-4">
        <Avatar className="w-12 h-12">
          <AvatarImage src={student.avatar_url || undefined} />
          <AvatarFallback>
            {student.full_name?.charAt(0) || "S"}
          </AvatarFallback>
        </Avatar>
        <div>
          <CardTitle className="text-lg">{student.full_name}</CardTitle>
          <p className="text-sm text-gray-600">{student.career}</p>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
          <GraduationCap size={16} />
          <span>{student.university}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Building2 size={16} />
          <span>GPA: {student.gpa}</span>
        </div>
      </CardContent>
    </Card>
  );

  const renderApplicationCard = (application: ApplicationWithProfile) => (
    <Card key={application.id} className="hover:shadow-lg transition-shadow">
      <CardHeader className="flex flex-row items-center gap-4">
        <Avatar className="w-12 h-12">
          <AvatarImage src={application.profiles.avatar_url || undefined} />
          <AvatarFallback>
            {application.profiles.full_name?.charAt(0) || "S"}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <CardTitle className="text-lg">{application.profiles.full_name}</CardTitle>
          <p className="text-sm text-gray-600">{application.profiles.career}</p>
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
          <p className="text-sm text-gray-600">{application.opportunities.title}</p>
        </div>
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <GraduationCap size={16} />
            <span>{application.profiles.university}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Building2 size={16} />
            <span>GPA: {application.profiles.gpa}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">
        {userRole === "company" ? "Explorar Estudiantes" : "Explorar Oportunidades"}
      </h1>
      
      <div className="mb-8">
        <SearchBar />
      </div>

      {userRole === "company" && applications && applications.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Aplicaciones Recibidas</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {applications.map(application => renderApplicationCard(application))}
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {userRole === "company" ? (
          students?.map(student => renderStudentCard(student))
        ) : (
          opportunities?.map(opportunity => (
            <OpportunityCard
              key={opportunity.id}
              title={opportunity.title}
              company={opportunity.profiles.company_name || ""}
              location={opportunity.location}
              type={opportunity.type}
              duration={opportunity.duration}
              salary={opportunity.salary}
              description={opportunity.description}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Explore;
