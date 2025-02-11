
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload } from "lucide-react";

type CVUploadProps = {
  cvUrl: string | null;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export const CVUpload = ({ cvUrl, onFileUpload }: CVUploadProps) => {
  return (
    <div className="mt-4 flex flex-col items-center gap-2">
      <Input
        type="file"
        accept=".pdf,.doc,.docx"
        className="hidden"
        id="cv-upload"
        onChange={onFileUpload}
      />
      <label htmlFor="cv-upload">
        <Button variant="outline" className="cursor-pointer" asChild>
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
          className="text-sm text-blue-600 hover:underline flex items-center gap-1"
        >
          Ver CV actual
          <Upload size={14} className="rotate-45" />
        </a>
      )}
    </div>
  );
};
