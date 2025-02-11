
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

interface Message {
  id: string;
  content: string;
  created_at: string;
  sender: {
    full_name: string | null;
    avatar_url: string | null;
    company_name: string | null;
  };
  receiver: {
    full_name: string | null;
    avatar_url: string | null;
    company_name: string | null;
  };
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
      const { data, error } = await supabase
        .from("messages")
        .select(`
          *,
          sender:sender_id(
            full_name,
            avatar_url,
            company_name
          ),
          receiver:receiver_id(
            full_name,
            avatar_url,
            company_name
          )
        `)
        .or(`sender_id.eq.${session?.user.id},receiver_id.eq.${session?.user.id}`)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Message[];
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
              const otherPerson = isFromMe ? message.receiver : message.sender;
              const displayName = otherPerson.company_name || otherPerson.full_name || "Usuario";
              
              return (
                <div
                  key={message.id}
                  className={`flex gap-3 ${isFromMe ? "flex-row-reverse" : ""}`}
                >
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={otherPerson.avatar_url || undefined} />
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
                    <div
                      className={`mt-1 px-4 py-2 rounded-lg ${
                        isFromMe
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      }`}
                    >
                      {message.content}
                    </div>
                    {!isFromMe && (
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
