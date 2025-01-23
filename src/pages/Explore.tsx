import { useEffect, useState } from "react";
import SearchBar from "@/components/SearchBar";
import OpportunityCard from "@/components/OpportunityCard";
import { useAuth } from "@/components/AuthProvider";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { GraduationCap, Building2 } from "lucide-react";

type Profile = Tables<"profiles">;
type Opportunity = Tables<"opportunities">;

const Explore = () => {
  const { session } = useAuth();
  const [userRole, setUserRole] = useState<string | null>(null);

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

  useEffect(() => {
    if (profile) {
      setUserRole(profile.role);
    }
  }, [profile]);

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

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">
        {userRole === "company" ? "Explorar Estudiantes" : "Explorar Oportunidades"}
      </h1>
      
      <div className="mb-8">
        <SearchBar />
      </div>

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