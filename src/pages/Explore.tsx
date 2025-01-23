import SearchBar from "@/components/SearchBar";
import OpportunityCard from "@/components/OpportunityCard";

const MOCK_OPPORTUNITIES = [
  {
    title: "Pasante de Marketing Digital",
    company: "TechCorp",
    location: "Ciudad de México",
    type: "Pasantía",
    duration: "3 meses",
    salary: "$30,000 MXN/mes",
    description: "Buscamos un pasante de marketing digital para ayudar con campañas en redes sociales y análisis de datos.",
  },
  {
    title: "Content Creator Jr",
    company: "Mercado Libre",
    location: "Buenos Aires, Argentina",
    type: "Freelance",
    duration: "2 meses",
    salary: "ARS 150,000/mes",
    description: "Creación de contenido para redes sociales y blog de la empresa. Experiencia en fotografía y edición de video.",
  },
  {
    title: "Desarrollador Frontend",
    company: "Globant",
    location: "Córdoba, Argentina",
    type: "Tiempo completo",
    duration: "6 meses",
    salary: "ARS 450,000/mes",
    description: "Desarrollo de interfaces de usuario con React y TypeScript para proyectos internacionales.",
  },
  {
    title: "Community Manager",
    company: "Despegar",
    location: "Buenos Aires, Argentina",
    type: "Part-time",
    duration: "3 meses",
    salary: "ARS 120,000/mes",
    description: "Gestión de redes sociales y creación de contenido para marca líder en turismo.",
  },
  {
    title: "Data Analyst Intern",
    company: "Banco Galicia",
    location: "Buenos Aires, Argentina",
    type: "Pasantía",
    duration: "4 meses",
    salary: "ARS 180,000/mes",
    description: "Análisis de datos financieros y creación de reportes para la toma de decisiones.",
  },
  {
    title: "UX/UI Designer",
    company: "Accenture",
    location: "Rosario, Argentina",
    type: "Proyecto",
    duration: "2 meses",
    salary: "ARS 200,000/proyecto",
    description: "Diseño de interfaces de usuario para aplicación móvil del sector financiero.",
  },
  {
    title: "Social Media Creator",
    company: "Personal",
    location: "Buenos Aires, Argentina",
    type: "Freelance",
    duration: "1 mes",
    salary: "ARS 100,000/proyecto",
    description: "Creación de contenido para campaña de marketing digital específica.",
  },
  {
    title: "Backend Developer Jr",
    company: "OLX",
    location: "Buenos Aires, Argentina",
    type: "Tiempo completo",
    duration: "6 meses",
    salary: "ARS 400,000/mes",
    description: "Desarrollo de APIs y servicios backend con Node.js y PostgreSQL.",
  },
  {
    title: "Marketing Research",
    company: "Rappi",
    location: "Mendoza, Argentina",
    type: "Proyecto",
    duration: "3 meses",
    salary: "ARS 250,000/proyecto",
    description: "Investigación de mercado y análisis de competencia para expansión de servicios.",
  },
  {
    title: "Content Writer",
    company: "Naranja X",
    location: "Córdoba, Argentina",
    type: "Freelance",
    duration: "2 meses",
    salary: "ARS 90,000/mes",
    description: "Creación de contenido para blog y redes sociales del sector fintech.",
  },
  {
    title: "Business Analyst Intern",
    company: "MercadoPago",
    location: "Buenos Aires, Argentina",
    type: "Pasantía",
    duration: "5 meses",
    salary: "ARS 200,000/mes",
    description: "Análisis de procesos de negocio y propuesta de mejoras para productos financieros.",
  },
  {
    title: "Video Editor",
    company: "Ualá",
    location: "Buenos Aires, Argentina",
    type: "Proyecto",
    duration: "1 mes",
    salary: "ARS 150,000/proyecto",
    description: "Edición de videos para campaña de marketing en redes sociales.",
  }
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