import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type AvatarUploadProps = {
  avatarUrl: string | null;
  fullName: string | null;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export const AvatarUpload = ({ avatarUrl, fullName, onFileUpload }: AvatarUploadProps) => {
  return (
    <div className="flex flex-col items-center">
      <Avatar className="w-32 h-32">
        <AvatarImage src={avatarUrl || "https://github.com/shadcn.png"} />
        <AvatarFallback>
          {fullName?.charAt(0) || 'U'}
        </AvatarFallback>
      </Avatar>
      <Input
        type="file"
        accept="image/*"
        className="hidden"
        id="avatar-upload"
        onChange={onFileUpload}
      />
      <label htmlFor="avatar-upload">
        <Button variant="outline" className="mt-4 cursor-pointer" asChild>
          <span>Cambiar Foto</span>
        </Button>
      </label>
    </div>
  );
};