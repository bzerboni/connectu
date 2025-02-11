
import { useState } from "react";
import SearchBar from "@/components/SearchBar";
import { useAuth } from "@/components/AuthProvider";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";
import Inbox from "@/components/Inbox";
import { StudentExplorer } from "@/features/explore/components/StudentExplorer";
import { OpportunityExplorer } from "@/features/explore/components/OpportunityExplorer";
import { ApplicationsList } from "@/features/explore/components/ApplicationsList";

const Explore = () => {
  const { session } = useAuth();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isInboxOpen, setIsInboxOpen] = useState(false);

  const { data: profile } = useQuery({
    queryKey: ["profile", session?.user.id],
    queryFn: async () => {
      const { data: companyData, error: companyError } = await supabase
        .from("company_profiles")
        .select("*")
        .eq("id", session?.user.id)
        .maybeSingle();

      if (companyData) {
        setUserRole("company");
        return { ...companyData, role: "company" };
      }

      const { data: studentData, error: studentError } = await supabase
        .from("student_profiles")
        .select("*")
        .eq("id", session?.user.id)
        .maybeSingle();

      if (studentData) {
        setUserRole("student");
        return { ...studentData, role: "student" };
      }

      if (companyError && studentError) throw companyError;
      return null;
    },
    enabled: !!session?.user.id,
  });

  const { data: students } = useQuery({
    queryKey: ["students"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("student_profiles")
        .select("*");

      if (error) throw error;
      return data;
    },
    enabled: profile?.role === "company",
  });

  const { data: opportunities } = useQuery({
    queryKey: ["opportunities"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("opportunities")
        .select(`
          *,
          profiles:company_profiles!opportunities_company_id_fkey (
            company_name
          )
        `);

      if (error) throw error;
      return data;
    },
    enabled: profile?.role === "student",
  });

  const { data: applications } = useQuery({
    queryKey: ["applications", session?.user.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("applications")
        .select(`
          *,
          profiles (
            full_name,
            avatar_url,
            career,
            university,
            graduation_year,
            student_id
          ),
          opportunities (*)
        `)
        .eq("opportunity_id", profile?.id);

      if (error) throw error;
      return data;
    },
    enabled: !!session?.user.id && profile?.role === "company",
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">
          {userRole === "company" ? "Explorar Estudiantes" : "Explorar Oportunidades"}
        </h1>
        <Button
          variant="outline"
          size="icon"
          className="relative"
          onClick={() => setIsInboxOpen(true)}
        >
          <MessageSquare className="h-5 w-5" />
        </Button>
      </div>
      
      <div className="mb-8">
        <SearchBar />
      </div>

      {userRole === "company" && applications && <ApplicationsList applications={applications} />}

      {userRole === "company" && students ? (
        <StudentExplorer students={students} />
      ) : opportunities ? (
        <OpportunityExplorer opportunities={opportunities} />
      ) : null}

      <Inbox isOpen={isInboxOpen} onClose={() => setIsInboxOpen(false)} />
    </div>
  );
};

export default Explore;
