
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { GraduationCap, Building2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Tables } from "@/integrations/supabase/types";

type Profile = Tables<"profiles">;

interface StudentExplorerProps {
  students: Profile[];
}

export const StudentExplorer = ({ students }: StudentExplorerProps) => {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {students?.map((student) => (
        <Link key={student.id} to={`/ai-builders/${student.id}`}>
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center gap-4">
              <Avatar className="w-12 h-12">
                <AvatarImage src={student.avatar_url || undefined} />
                <AvatarFallback>
                  {student.full_name?.charAt(0) || "A"}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-lg">{student.full_name}</CardTitle>
                <p className="text-sm text-gray-600">AI Builder</p>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                <GraduationCap size={16} />
                <span>Especialista en IA</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Building2 size={16} />
                <span>{student.available ? 'Disponible' : 'Ocupado'}</span>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
};
