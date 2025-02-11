
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "./AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { useToast } from "@/components/ui/use-toast";
import { CheckCircle2, XCircle } from "lucide-react";

interface Profile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  company_name: string | null;
}

interface Message {
  id: string;
  content: string;
  created_at: string;
  sender_id: string;
  receiver_id: string;
  sender_info: Profile | null;
  receiver_info: Profile | null;
  related_opportunity_id?: string | null;
  opportunity?: {
    title: string;
  } | null;
}

interface InboxProps {
  isOpen: boolean;
  onClose: () => void;
}

const Inbox = ({ isOpen, onClose }: InboxProps) => {
  const { session } = useAuth();
  const [replyContent, setReplyContent] = useState("");
  const [selectedReceiverId, setSelectedReceiverId] = useState<string | null>(null);
  const { toast } = useToast();

  const { data: messages } = useQuery({
    queryKey: ["messages", session?.user.id],
    queryFn: async () => {
      // Primero obtenemos los mensajes
      const { data: messagesData, error: messagesError } = await supabase
        .from("messages")
        .select(`
          id,
          content,
          created_at,
          sender_id,
          receiver_id,
          related_opportunity_id,
          opportunity:opportunities(
            title
          )
        `)
        .or(`sender_id.eq.${session?.user.id},receiver_id.eq.${session?.user.id}`)
        .order("created_at", { ascending: false });

      if (messagesError) throw messagesError;

      // Luego obtenemos los perfiles de todos los usuarios involucrados
      const userIds = new Set(
        messagesData.flatMap(msg => [msg.sender_id, msg.receiver_id])
      );

      const { data: profilesData, error: profilesError } = await supabase
        .from("profiles")
        .select("id, full_name, avatar_url, company_name")
        .in("id", Array.from(userIds));

      if (profilesError) throw profilesError;

      // Luego obtenemos los mensajes de las aplicaciones
      const { data: applications, error: applicationsError } = await supabase
        .from("applications")
        .select(`
          id,
          message,
          created_at,
          opportunity_id,
          user_id,
          status,
          opportunities (
            id,
            title,
            company_id
          )
        `)
        .eq("opportunities.company_id", session?.user.id);

      if (applicationsError) throw applicationsError;

      // Convertimos las aplicaciones en mensajes
      const applicationMessages = applications.map(app => ({
        id: `app-${app.id}`,
        content: app.message || "Ha aplicado a esta oportunidad",
        created_at: app.created_at,
        sender_id: app.user_id,
        receiver_id: app.opportunities.company_id,
        related_opportunity_id: app.opportunity_id,
        opportunity: {
          title: app.opportunities.title
        }
      }));

      // Creamos un mapa de perfiles para fácil acceso
      const profilesMap = new Map(
        profilesData.map(profile => [profile.id, profile])
      );

      // Combinamos los datos
      const allMessages = [...messagesData, ...applicationMessages].map(message => ({
        ...message,
        sender_info: profilesMap.get(message.sender_id) || null,
        receiver_info: profilesMap.get(message.receiver_id) || null,
      }));

      // Ordenamos por fecha
      return allMessages.sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      ) as Message[];
    },
    enabled: !!session?.user.id,
  });

  const handleSendReply = async () => {
    if (!selectedReceiverId || !replyContent.trim()) return;

    try {
      const { error } = await supabase.from("messages").insert({
        sender_id: session?.user.id,
        receiver_id: selectedReceiverId,
        content: replyContent,
      });

      if (error) throw error;

      setReplyContent("");
      toast({
        title: "Mensaje enviado",
        description: "Tu mensaje ha sido enviado correctamente.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-[400px] sm:w-[540px] h-full flex flex-col">
        <SheetHeader>
          <SheetTitle>Mensajes</SheetTitle>
        </SheetHeader>
        
        <ScrollArea className="flex-grow">
          <div className="space-y-4 p-4">
            {messages?.map((message) => {
              const isFromMe = message.sender_id === session?.user.id;
              const otherPerson = isFromMe ? message.receiver_info : message.sender_info;
              const displayName = otherPerson?.company_name || otherPerson?.full_name || "Usuario";
              const isApplication = message.id.toString().startsWith('app-');
              
              return (
                <div
                  key={message.id}
                  className={`flex gap-3 ${isFromMe ? "flex-row-reverse" : ""}`}
                >
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={otherPerson?.avatar_url || undefined} />
                    <AvatarFallback>
                      {displayName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className={`flex flex-col ${isFromMe ? "items-end" : ""}`}>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{displayName}</span>
                      <span className="text-xs text-gray-500">
                        {formatDistanceToNow(new Date(message.created_at), {
                          addSuffix: true,
                          locale: es,
                        })}
                      </span>
                    </div>
                    {message.opportunity && (
                      <div className="text-xs text-primary mb-1">
                        Aplicación para: {message.opportunity.title}
                      </div>
                    )}
                    <div
                      className={`mt-1 px-4 py-2 rounded-lg ${
                        isFromMe
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      }`}
                    >
                      {message.content}
                    </div>
                    {!isFromMe && !isApplication && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="mt-1"
                        onClick={() => setSelectedReceiverId(message.sender_id)}
                      >
                        Responder
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>

        {selectedReceiverId && (
          <div className="p-4 border-t">
            <Textarea
              placeholder="Escribe tu respuesta..."
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              className="mb-2 resize-none"
              rows={3}
            />
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedReceiverId(null);
                  setReplyContent("");
                }}
              >
                Cancelar
              </Button>
              <Button onClick={handleSendReply}>
                Enviar
              </Button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default Inbox;
