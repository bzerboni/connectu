import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type ProfileFormData = {
  full_name: string;
  university?: string;
  career?: string;
  graduation_year?: string;
  bio: string;
  company_name?: string;
  company_description?: string;
  company_website?: string;
  company_size?: string;
};

type ProfileFormProps = {
  formData: ProfileFormData;
  isCompany: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
};

export const ProfileForm = ({ formData, isCompany, onChange }: ProfileFormProps) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Nombre Completo</label>
        <Input
          name="full_name"
          value={formData.full_name}
          onChange={onChange}
          placeholder="Nombre Completo"
        />
      </div>
      {isCompany ? (
        <>
          <div>
            <label className="block text-sm font-medium mb-1">Nombre de la Empresa</label>
            <Input
              name="company_name"
              value={formData.company_name}
              onChange={onChange}
              placeholder="Nombre de la Empresa"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Descripción de la Empresa</label>
            <Textarea
              name="company_description"
              value={formData.company_description}
              onChange={onChange}
              placeholder="Descripción de la Empresa"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Sitio Web</label>
            <Input
              name="company_website"
              value={formData.company_website}
              onChange={onChange}
              placeholder="https://ejemplo.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Tamaño de la Empresa</label>
            <Input
              name="company_size"
              value={formData.company_size}
              onChange={onChange}
              placeholder="Ej: 1-10 empleados"
            />
          </div>
        </>
      ) : (
        <>
          <div>
            <label className="block text-sm font-medium mb-1">Universidad</label>
            <Input
              name="university"
              value={formData.university}
              onChange={onChange}
              placeholder="Universidad"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Carrera</label>
            <Input
              name="career"
              value={formData.career}
              onChange={onChange}
              placeholder="Carrera"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Año de Graduación</label>
            <Input
              name="graduation_year"
              value={formData.graduation_year}
              onChange={onChange}
              placeholder="Año de Graduación"
            />
          </div>
        </>
      )}
      <div>
        <label className="block text-sm font-medium mb-1">Biografía</label>
        <Textarea
          name="bio"
          value={formData.bio}
          onChange={onChange}
          placeholder="Cuéntanos sobre ti"
        />
      </div>
    </div>
  );
};