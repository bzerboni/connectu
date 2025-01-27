import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

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
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold mb-4">Información de la Empresa</h2>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="company_name">Nombre de la Empresa *</Label>
              <Input
                id="company_name"
                name="company_name"
                value={formData.company_name}
                onChange={onChange}
                placeholder="Ej: Mi Empresa S.A."
                required
              />
            </div>
            
            <div>
              <Label htmlFor="company_description">Descripción de la Empresa *</Label>
              <Textarea
                id="company_description"
                name="company_description"
                value={formData.company_description}
                onChange={onChange}
                placeholder="Describe tu empresa, su misión y valores"
                required
              />
            </div>

            <div>
              <Label htmlFor="company_website">Sitio Web</Label>
              <Input
                id="company_website"
                name="company_website"
                value={formData.company_website}
                onChange={onChange}
                placeholder="https://ejemplo.com"
                type="url"
              />
            </div>

            <div>
              <Label htmlFor="company_size">Tamaño de la Empresa</Label>
              <Input
                id="company_size"
                name="company_size"
                value={formData.company_size}
                onChange={onChange}
                placeholder="Ej: 1-10 empleados, 11-50 empleados, etc."
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};