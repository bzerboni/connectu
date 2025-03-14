import { Button } from "@/components/ui/button";
import { ArrowRight, Users, Building, GraduationCap } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-secondary/20 to-secondary/5 py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            ¡Tu futuro comienza aquí!
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Encuentra las mejores pasantías y oportunidades profesionales diseñadas especialmente para ti.
          </p>
          <Button size="lg" className="gap-2 text-lg font-semibold hover:scale-105 transition-transform">
            ¡Comienza ahora! <ArrowRight size={20} />
          </Button>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center transform hover:scale-105 transition-transform">
              <div className="bg-secondary/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="text-secondary" size={32} />
              </div>
              <h3 className="text-3xl font-bold mb-2 text-primary">1,000+</h3>
              <p className="text-gray-600">Estudiantes activos</p>
            </div>
            <div className="text-center transform hover:scale-105 transition-transform">
              <div className="bg-secondary/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Building className="text-secondary" size={32} />
              </div>
              <h3 className="text-3xl font-bold mb-2 text-primary">500+</h3>
              <p className="text-gray-600">Empresas asociadas</p>
            </div>
            <div className="text-center transform hover:scale-105 transition-transform">
              <div className="bg-secondary/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <GraduationCap className="text-secondary" size={32} />
              </div>
              <h3 className="text-3xl font-bold mb-2 text-primary">2,000+</h3>
              <p className="text-gray-600">Oportunidades publicadas</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;