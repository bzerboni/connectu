
import OpportunityCard from "@/components/OpportunityCard";
import { Tables } from "@/integrations/supabase/types";

type Opportunity = Tables<"opportunities">;

interface OpportunityWithCompany extends Opportunity {
  profiles: {
    company_name: string | null;
  } | null;
}

interface OpportunityExplorerProps {
  opportunities: OpportunityWithCompany[];
}

export const OpportunityExplorer = ({ opportunities }: OpportunityExplorerProps) => {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {opportunities?.map((opportunity) => (
        <OpportunityCard
          key={opportunity.id}
          id={opportunity.id}
          title={opportunity.title}
          company={opportunity.profiles?.company_name || ""}
          location={opportunity.location}
          type={opportunity.type}
          duration={opportunity.duration}
          salary={opportunity.salary}
          description={opportunity.description}
          isCompanyView={false}
        />
      ))}
    </div>
  );
};
