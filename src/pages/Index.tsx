import { Button } from "@/components/ui/button";
import { ArrowRight, Users, Building, GraduationCap } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary/5 to-primary/0 py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">
            Conecta con tu futuro profesional
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Encuentra pasantías y oportunidades profesionales diseñadas específicamente para estudiantes universitarios.
          </p>
          <Button size="lg" className="gap-2">
            Comienza ahora <ArrowRight size={20} />
          </Button>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="text-primary" size={32} />
              </div>
              <h3 className="text-3xl font-bold mb-2">1,000+</h3>
              <p className="text-gray-600">Estudiantes activos</p>
            </div>
            <div className="text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Building className="text-primary" size={32} />
              </div>
              <h3 className="text-3xl font-bold mb-2">500+</h3>
              <p className="text-gray-600">Empresas asociadas</p>
            </div>
            <div className="text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <GraduationCap className="text-primary" size={32} />
              </div>
              <h3 className="text-3xl font-bold mb-2">2,000+</h3>
              <p className="text-gray-600">Oportunidades publicadas</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;