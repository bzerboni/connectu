import { Building, Globe, Users, FileText, Link } from "lucide-react";

type ProfileViewProps = {
  isCompany: boolean;
  profile: {
    company_name?: string | null;
    company_description?: string | null;
    company_website?: string | null;
    company_size?: string | null;
  };
};

export const ProfileView = ({ isCompany, profile }: ProfileViewProps) => {
  if (!isCompany) return null;

  return (
    <>
      <h1 className="text-2xl font-bold mb-4">
        {profile.company_name || 'Sin nombre'}
      </h1>
      
      <div className="space-y-6">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
            <FileText size={20} />
            Descripción de la Empresa
          </h2>
          <p className="text-gray-600">
            {profile.company_description || 'Sin descripción'}
          </p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2">
          <div className="flex items-start gap-2 text-gray-600">
            <Globe className="mt-1 flex-shrink-0" size={20} />
            <div>
              <p className="font-medium">Sitio Web</p>
              {profile.company_website ? (
                <a 
                  href={profile.company_website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline flex items-center gap-1"
                >
                  {profile.company_website}
                  <Link size={14} />
                </a>
              ) : (
                <p>No especificado</p>
              )}
            </div>
          </div>
          
          <div className="flex items-start gap-2 text-gray-600">
            <Users className="mt-1 flex-shrink-0" size={20} />
            <div>
              <p className="font-medium">Tamaño de la Empresa</p>
              <p>{profile.company_size || 'No especificado'}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};