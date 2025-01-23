import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Mail, MapPin, Phone, Building, GraduationCap } from "lucide-react";

const Profile = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex flex-col items-center">
              <Avatar className="w-32 h-32">
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <Button variant="outline" className="mt-4">
                Editar Perfil
              </Button>
            </div>
            
            <div className="flex-1">
              <h1 className="text-2xl font-bold mb-2">Carlos Núñez</h1>
              <p className="text-gray-600 mb-4">Estudiante de Ingeniería en Sistemas</p>
              
              <div className="grid gap-4">
                <div className="flex items-center gap-2 text-gray-600">
                  <Mail size={20} />
                  <span>carlos@universidad.edu</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin size={20} />
                  <span>Ciudad de México</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Phone size={20} />
                  <span>+52 123 456 7890</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Building size={20} />
              Experiencia
            </h2>
            <div className="space-y-4">
              <div className="border-l-2 border-primary pl-4">
                <h3 className="font-medium">Pasante de Desarrollo</h3>
                <p className="text-gray-600">TechStartup • 2023</p>
                <p className="text-sm text-gray-500">
                  Desarrollo de features para aplicación web usando React y Node.js
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <GraduationCap size={20} />
              Educación
            </h2>
            <div className="space-y-4">
              <div className="border-l-2 border-primary pl-4">
                <h3 className="font-medium">Universidad Nacional</h3>
                <p className="text-gray-600">Ingeniería en Sistemas • 2021 - Presente</p>
                <p className="text-sm text-gray-500">
                  Promedio: 9.2/10
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;