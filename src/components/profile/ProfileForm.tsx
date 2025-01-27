import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type ProfileFormData = {
  company_name: string;
  company_description: string;
  company_website: string;
  company_size: string;
  title?: string;
  description?: string;
  location?: string;
  type?: string;
  duration?: string;
  salary?: string;
};

type ProfileFormProps = {
  formData: ProfileFormData;
  isCompany: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
};

export const ProfileForm = ({ formData, isCompany, onChange }: ProfileFormProps) => {
  if (!isCompany) return null;

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Nombre de la Empresa *</label>
        <Input
          name="company_name"
          value={formData.company_name}
          onChange={onChange}
          placeholder="Nombre de la Empresa"
          required
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1">Descripción de la Empresa *</label>
        <Textarea
          name="company_description"
          value={formData.company_description}
          onChange={onChange}
          placeholder="Describe tu empresa, su misión y valores"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Sitio Web</label>
        <Input
          name="company_website"
          value={formData.company_website}
          onChange={onChange}
          placeholder="https://ejemplo.com"
          type="url"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Tamaño de la Empresa</label>
        <Input
          name="company_size"
          value={formData.company_size}
          onChange={onChange}
          placeholder="Ej: 1-10 empleados, 11-50 empleados, etc."
        />
      </div>
    </div>
  );
};