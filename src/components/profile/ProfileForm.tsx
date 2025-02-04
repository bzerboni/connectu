
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

type StudentProfileFormData = {
  full_name: string;
  university: string;
  career: string;
  graduation_year: string;
  major: string;
  gpa: string;
  bio: string;
};

type CompanyProfileFormData = {
  company_name: string;
  company_description: string;
  company_website: string;
  company_size: string;
};

type ProfileFormProps = {
  formData: StudentProfileFormData | CompanyProfileFormData;
  isCompany: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
};

export const ProfileForm = ({ formData, isCompany, onChange }: ProfileFormProps) => {
  if (isCompany) {
    const companyData = formData as CompanyProfileFormData;
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
                  value={companyData.company_name || ''}
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
                  value={companyData.company_description || ''}
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
                  value={companyData.company_website || ''}
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
                  value={companyData.company_size || ''}
                  onChange={onChange}
                  placeholder="Ej: 1-10 empleados, 11-50 empleados, etc."
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const studentData = formData as StudentProfileFormData;
  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold mb-4">Información Personal</h2>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="full_name">Nombre Completo *</Label>
              <Input
                id="full_name"
                name="full_name"
                value={studentData.full_name || ''}
                onChange={onChange}
                placeholder="Ej: Juan Pérez"
                required
              />
            </div>

            <div>
              <Label htmlFor="university">Universidad *</Label>
              <Input
                id="university"
                name="university"
                value={studentData.university || ''}
                onChange={onChange}
                placeholder="Ej: Universidad Nacional"
                required
              />
            </div>

            <div>
              <Label htmlFor="career">Carrera *</Label>
              <Input
                id="career"
                name="career"
                value={studentData.career || ''}
                onChange={onChange}
                placeholder="Ej: Ingeniería Informática"
                required
              />
            </div>

            <div>
              <Label htmlFor="major">Especialidad</Label>
              <Input
                id="major"
                name="major"
                value={studentData.major || ''}
                onChange={onChange}
                placeholder="Ej: Desarrollo de Software"
              />
            </div>

            <div>
              <Label htmlFor="graduation_year">Año de Graduación</Label>
              <Input
                id="graduation_year"
                name="graduation_year"
                value={studentData.graduation_year || ''}
                onChange={onChange}
                placeholder="Ej: 2025"
              />
            </div>

            <div>
              <Label htmlFor="gpa">Promedio</Label>
              <Input
                id="gpa"
                name="gpa"
                value={studentData.gpa || ''}
                onChange={onChange}
                placeholder="Ej: 9.5"
              />
            </div>

            <div>
              <Label htmlFor="bio">Biografía</Label>
              <Textarea
                id="bio"
                name="bio"
                value={studentData.bio || ''}
                onChange={onChange}
                placeholder="Cuéntanos un poco sobre ti..."
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
