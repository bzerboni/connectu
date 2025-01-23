import SearchBar from "@/components/SearchBar";
import OpportunityCard from "@/components/OpportunityCard";

const MOCK_OPPORTUNITIES = [
  {
    title: "Pasante de Marketing Digital",
    company: "TechCorp",
    location: "Ciudad de México",
    type: "Pasantía",
    duration: "3 meses",
  },
  {
    title: "Desarrollador Frontend Jr",
    company: "StartupMX",
    location: "Remoto",
    type: "Tiempo completo",
    duration: "6 meses",
  },
  {
    title: "Asistente de Investigación",
    company: "Universidad Nacional",
    location: "Presencial",
    type: "Medio tiempo",
    duration: "4 meses",
  },
];

const Explore = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Explorar Oportunidades</h1>
      
      <div className="mb-8">
        <SearchBar />
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MOCK_OPPORTUNITIES.map((opportunity, index) => (
          <OpportunityCard key={index} {...opportunity} />
        ))}
      </div>
    </div>
  );
};

export default Explore;