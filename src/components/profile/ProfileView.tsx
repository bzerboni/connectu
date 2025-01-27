import { Building, GraduationCap, MapPin, School, Globe, Users, FileText } from "lucide-react";

type ProfileViewProps = {
  isCompany: boolean;
  profile: {
    company_name?: string | null;
    full_name?: string | null;
    bio?: string | null;
    company_website?: string | null;
    company_size?: string | null;
    company_description?: string | null;
    university?: string | null;
    career?: string | null;
    graduation_year?: string | null;
  };
};

export const ProfileView = ({ isCompany, profile }: ProfileViewProps) => {
  return (
    <>
      <h1 className="text-2xl font-bold mb-2">
        {isCompany ? profile.company_name : profile.full_name || 'Sin nombre'}
      </h1>
      
      {isCompany ? (
        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
              <FileText size={20} />
              Descripción de la Empresa
            </h2>
            <p className="text-gray-600">
              {profile.company_description || 'Sin descripción'}
            </p>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex items-center gap-2 text-gray-600">
              <Globe size={20} />
              <div>
                <p className="font-medium">Sitio Web</p>
                <p>{profile.company_website || 'No especificado'}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 text-gray-600">
              <Users size={20} />
              <div>
                <p className="font-medium">Tamaño de la Empresa</p>
                <p>{profile.company_size || 'No especificado'}</p>
              </div>
            </div>
          </div>

          {profile.bio && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
                <Building size={20} />
                Información Adicional
              </h2>
              <p className="text-gray-600">{profile.bio}</p>
            </div>
          )}
        </div>
      ) : (
        <>
          <div className="flex items-center gap-2 text-gray-600">
            <School size={20} />
            <span>Universidad: {profile.university || 'No especificada'}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <GraduationCap size={20} />
            <span>Carrera: {profile.career || 'No especificada'}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <MapPin size={20} />
            <span>Año de Graduación: {profile.graduation_year || 'No especificado'}</span>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h2 className="text-lg font-semibold mb-2">Biografía</h2>
            <p className="text-gray-600">{profile.bio || 'Sin biografía'}</p>
          </div>
        </>
      )}
    </>
  );
};
