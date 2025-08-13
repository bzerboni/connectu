import { Button } from "@/components/ui/button";
import { ArrowRight, Users, Building, GraduationCap, Zap, Bot, Cpu } from "lucide-react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Sphere, MeshDistortMaterial, Float } from "@react-three/drei";
import { useNavigate } from "react-router-dom";

const AnimatedSphere = () => {
  return (
    <Float speed={1.4} rotationIntensity={1} floatIntensity={2}>
      <Sphere visible args={[1, 100, 200]} scale={2}>
        <MeshDistortMaterial
          color="#8B5CF6"
          attach="material"
          distort={0.3}
          speed={1.5}
          roughness={0}
        />
      </Sphere>
    </Float>
  );
};

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* 3D Background */}
      <div className="absolute inset-0 z-0">
        <Canvas>
          <OrbitControls enableZoom={false} enablePan={false} />
          <ambientLight intensity={1} />
          <directionalLight position={[3, 2, 1]} />
          <AnimatedSphere />
        </Canvas>
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-secondary/30 z-10"></div>
      
      {/* Hero Section */}
      <section className="relative z-20 py-32">
        <div className="container mx-auto px-4 text-center">
          <div className="animate-fade-in">
            <h1 className="text-7xl font-bold mb-8 bg-gradient-to-r from-primary via-purple-500 to-secondary bg-clip-text text-transparent leading-tight">
              ¡Conecta AI Builders con Empresas!
            </h1>
            <p className="text-2xl text-gray-700 mb-12 max-w-3xl mx-auto font-medium">
              La plataforma donde <span className="text-primary font-semibold">AI Builders</span> encuentran proyectos de automatización 
              y las <span className="text-secondary font-semibold">empresas</span> encuentran talento especializado en IA.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                size="lg" 
                className="gap-3 text-xl font-bold px-8 py-6 hover:scale-110 transition-all duration-300 shadow-2xl hover:shadow-primary/50 bg-gradient-to-r from-primary to-purple-600"
                onClick={() => navigate("/auth")}
              >
                <Bot size={24} />
                ¡Únete como AI Builder!
                <ArrowRight size={24} />
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="gap-3 text-xl font-bold px-8 py-6 hover:scale-105 transition-all duration-300 border-2 border-primary/50 hover:bg-primary/10"
              >
                <Zap size={24} />
                Explorar Proyectos
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Floating Icons */}
      <div className="absolute top-1/4 left-10 animate-bounce z-20">
        <div className="bg-secondary/80 backdrop-blur-sm p-4 rounded-full shadow-xl">
          <Cpu className="text-primary" size={32} />
        </div>
      </div>
      <div className="absolute top-1/3 right-16 animate-bounce delay-1000 z-20">
        <div className="bg-primary/80 backdrop-blur-sm p-4 rounded-full shadow-xl">
          <Bot className="text-white" size={32} />
        </div>
      </div>
      <div className="absolute bottom-1/3 left-20 animate-bounce delay-500 z-20">
        <div className="bg-gradient-to-r from-primary to-secondary p-4 rounded-full shadow-xl">
          <Zap className="text-white" size={32} />
        </div>
      </div>

      {/* Stats Section */}
      <section className="relative z-20 py-24 bg-gradient-to-r from-white/95 to-gray-50/95 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center group cursor-pointer transform hover:scale-110 transition-all duration-500">
              <div className="bg-gradient-to-br from-secondary/30 to-secondary/20 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:shadow-2xl group-hover:shadow-secondary/50 transition-all duration-500">
                <Users className="text-primary group-hover:scale-125 transition-transform duration-300" size={40} />
              </div>
              <h3 className="text-5xl font-bold mb-4 text-primary group-hover:text-purple-600 transition-colors">500+</h3>
              <p className="text-xl text-gray-600 font-medium">AI Builders activos</p>
            </div>
            <div className="text-center group cursor-pointer transform hover:scale-110 transition-all duration-500">
              <div className="bg-gradient-to-br from-primary/30 to-primary/20 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:shadow-2xl group-hover:shadow-primary/50 transition-all duration-500">
                <Building className="text-secondary group-hover:scale-125 transition-transform duration-300" size={40} />
              </div>
              <h3 className="text-5xl font-bold mb-4 text-primary group-hover:text-purple-600 transition-colors">200+</h3>
              <p className="text-xl text-gray-600 font-medium">Empresas buscando IA</p>
            </div>
            <div className="text-center group cursor-pointer transform hover:scale-110 transition-all duration-500">
              <div className="bg-gradient-to-br from-purple-500/30 to-purple-400/20 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:shadow-2xl group-hover:shadow-purple-500/50 transition-all duration-500">
                <GraduationCap className="text-primary group-hover:scale-125 transition-transform duration-300" size={40} />
              </div>
              <h3 className="text-5xl font-bold mb-4 text-primary group-hover:text-purple-600 transition-colors">1,500+</h3>
              <p className="text-xl text-gray-600 font-medium">Proyectos de automatización</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;