
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, Building2, FileText, Calculator } from "lucide-react";
import { Button } from "@/components/ui/button";

const StudentProfile = () => {
  const { id } = useParams();

  const { data: student } = useQuery({
    queryKey: ["student", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("student_profiles")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return data;
    },
  });

  if (!student) return <div>No se encontró el estudiante</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader className="flex flex-row items-start gap-4">
          <Avatar className="w-20 h-20">
            <AvatarImage src={student.avatar_url || undefined} />
            <AvatarFallback>{student.full_name?.charAt(0) || "S"}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-2xl">{student.full_name}</CardTitle>
            <p className="text-gray-600">{student.career}</p>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-gray-500" />
              <span>{student.university}</span>
            </div>
            <div className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-gray-500" />
              <span>Graduación: {student.graduation_year}</span>
            </div>
            {student.major && (
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-gray-500" />
                <span>Especialidad: {student.major}</span>
              </div>
            )}
            {student.gpa && (
              <div className="flex items-center gap-2">
                <Calculator className="h-5 w-5 text-gray-500" />
                <span>Promedio: {student.gpa}</span>
              </div>
            )}
          </div>

          {student.bio && (
            <div>
              <h3 className="font-semibold mb-2">Biografía</h3>
              <p className="text-gray-600">{student.bio}</p>
            </div>
          )}

          {student.cv_url && (
            <div>
              <Button asChild>
                <a href={student.cv_url} target="_blank" rel="noopener noreferrer">
                  Ver CV
                </a>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentProfile;
