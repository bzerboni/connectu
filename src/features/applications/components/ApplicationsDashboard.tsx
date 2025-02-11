
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";

interface ApplicationsDashboardProps {
  onOpenChat: (userId: string) => void;
}

export const ApplicationsDashboard = ({ onOpenChat }: ApplicationsDashboardProps) => {
  const { session } = useAuth();

  const { data: metrics } = useQuery({
    queryKey: ["applications-metrics", session?.user.id],
    queryFn: async () => {
      const { data: opportunities, error: opportunitiesError } = await supabase
        .from("opportunities")
        .select("id, title")
        .eq("company_id", session?.user.id);

      if (opportunitiesError) throw opportunitiesError;

      const opportunityIds = opportunities.map(opp => opp.id);

      const { data: applications, error: applicationsError } = await supabase
        .from("applications")
        .select(`
          id,
          created_at,
          status,
          message,
          profiles!applications_user_id_fkey (
            id,
            full_name,
            avatar_url,
            university,
            career
          ),
          opportunities!applications_opportunity_id_fkey (
            id,
            title
          )
        `)
        .in("opportunity_id", opportunityIds)
        .order("created_at", { ascending: false });

      if (applicationsError) throw applicationsError;

      // Agrupamos las aplicaciones por oportunidad
      const applicationsByOpportunity = opportunities.map(opportunity => {
        const opportunityApplications = applications.filter(
          app => app.opportunities.id === opportunity.id
        );

        return {
          opportunity,
          applications: opportunityApplications,
          totalApplications: opportunityApplications.length,
        };
      });

      return {
        totalApplications: applications.length,
        applicationsByOpportunity,
      };
    },
    enabled: !!session?.user.id,
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "accepted":
        return "bg-green-500";
      case "rejected":
        return "bg-red-500";
      default:
        return "bg-yellow-500";
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Aplicaciones
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metrics?.totalApplications || 0}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        {metrics?.applicationsByOpportunity.map(({ opportunity, applications }) => (
          <Card key={opportunity.id}>
            <CardHeader>
              <CardTitle>{opportunity.title}</CardTitle>
              <p className="text-sm text-muted-foreground">
                {applications.length} aplicaciones
              </p>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Candidato</TableHead>
                    <TableHead>Universidad</TableHead>
                    <TableHead>Carrera</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {applications.map((application) => (
                    <TableRow key={application.id}>
                      <TableCell className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage
                            src={application.profiles?.avatar_url || undefined}
                          />
                          <AvatarFallback>
                            {application.profiles?.full_name?.[0] || "U"}
                          </AvatarFallback>
                        </Avatar>
                        <span>{application.profiles?.full_name}</span>
                      </TableCell>
                      <TableCell>{application.profiles?.university}</TableCell>
                      <TableCell>{application.profiles?.career}</TableCell>
                      <TableCell>
                        <Badge
                          className={getStatusColor(application.status)}
                        >
                          {application.status === "pending"
                            ? "Pendiente"
                            : application.status === "accepted"
                            ? "Aceptado"
                            : "Rechazado"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {formatDistanceToNow(new Date(application.created_at), {
                          addSuffix: true,
                          locale: es,
                        })}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onOpenChat(application.profiles?.id || "")}
                        >
                          <MessageSquare className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
