import { Building, GraduationCap, MapPin, School, Globe } from "lucide-react";

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
      <p className="text-gray-600 mb-4">
        {isCompany ? profile.company_description : profile.bio || 'Sin biografía'}
      </p>
      
      <div className="grid gap-4">
        {isCompany ? (
          <>
            <div className="flex items-center gap-2 text-gray-600">
              <Globe size={20} />
              <span>Sitio Web: {profile.company_website || 'No especificado'}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Building size={20} />
              <span>Tamaño: {profile.company_size || 'No especificado'}</span>
            </div>
          </>
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
          </>
        )}
      </div>
    </>
  );
};