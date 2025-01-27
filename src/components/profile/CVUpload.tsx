import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload } from "lucide-react";

type CVUploadProps = {
  cvUrl: string | null;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export const CVUpload = ({ cvUrl, onFileUpload }: CVUploadProps) => {
  return (
    <>
      <Input
        type="file"
        accept=".pdf,.doc,.docx"
        className="hidden"
        id="cv-upload"
        onChange={onFileUpload}
      />
      <label htmlFor="cv-upload">
        <Button variant="outline" className="mt-2 cursor-pointer" asChild>
          <span className="flex items-center gap-2">
            <Upload size={16} />
            {cvUrl ? 'Actualizar CV' : 'Subir CV'}
          </span>
        </Button>
      </label>
      {cvUrl && (
        <a
          href={cvUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 text-sm text-blue-600 hover:underline"
        >
          Ver CV actual
        </a>
      )}
    </>
  );
};