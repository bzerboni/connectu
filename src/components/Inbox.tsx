
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Profile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  company_name: string | null;
  user_type: string;
}

interface Message {
  id: string;
  content: string;
  created_at: string;
  sender_id: string;
  receiver_id: string;
  conversation_id: string;
  sender_info: Profile | null;
  receiver_info: Profile | null;
  related_opportunity_id?: string | null;
  opportunity?: {
    title: string;
  } | null;
}

interface Conversation {
  id: string;
  otherPerson: Profile;
  lastMessage: Message;
  unreadCount: number;
}

interface InboxProps {
  isOpen: boolean;
  onClose: () => void;
}

const Inbox = ({ isOpen, onClose }: InboxProps) => {
  const { session } = useAuth();
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<string>("all");

  const { data: inboxData, refetch: refetchMessages } = useQuery({
    queryKey: ["messages", session?.user.id],
    queryFn: async () => {
      const { data: messagesData, error: messagesError } = await supabase
        .from("messages")
        .select(`
          id,
          content,
          created_at,
          sender_id,
          receiver_id,
          conversation_id
        `)
        .order("created_at", { ascending: true });

      if (messagesError) throw messagesError;

      const userIds = new Set(
        messagesData.flatMap(msg => [msg.sender_id, msg.receiver_id])
      );

      const { data: profilesData, error: profilesError } = await supabase
        .from("profiles")
        .select("id, full_name, avatar_url, company_name, user_type")
        .in("id", Array.from(userIds));

      if (profilesError) throw profilesError;

      const profilesMap = new Map(
        profilesData.map(profile => [profile.id, profile])
      );

      const messages = messagesData.map(message => ({
        ...message,
        sender_info: profilesMap.get(message.sender_id) || null,
        receiver_info: profilesMap.get(message.receiver_id) || null,
      })) as Message[];

      const conversationsMap = new Map<string, Conversation>();
      
      messages.forEach(message => {
        const isFromMe = message.sender_id === session?.user.id;
        const otherPersonId = isFromMe ? message.receiver_id : message.sender_id;
        const otherPerson = isFromMe ? message.receiver_info : message.sender_info;

        if (!conversationsMap.has(message.conversation_id) && otherPerson) {
          conversationsMap.set(message.conversation_id, {
            id: message.conversation_id,
            otherPerson,
            lastMessage: message,
            unreadCount: 0
          });
        } else if (otherPerson) {
          const conversation = conversationsMap.get(message.conversation_id)!;
          // Actualizar el último mensaje solo si es más reciente
          if (new Date(message.created_at) > new Date(conversation.lastMessage.created_at)) {
            conversation.lastMessage = message;
          }
        }
      });

      const conversations = Array.from(conversationsMap.values());
      return {
        messages,
        conversations: conversations.sort((a, b) => 
          new Date(b.lastMessage.created_at).getTime() - 
          new Date(a.lastMessage.created_at).getTime()
        ),
      };
    },
    enabled: !!session?.user.id,
  });

  const handleSendReply = async () => {
    if (!selectedConversation || !replyContent.trim()) return;

    const selectedConversationData = inboxData?.conversations.find(
      c => c.id === selectedConversation
    );

    if (!selectedConversationData) return;

    try {
      const { error } = await supabase.from("messages").insert({
        sender_id: session?.user.id,
        receiver_id: selectedConversationData.otherPerson.id,
        content: replyContent,
        conversation_id: selectedConversation,
      });

      if (error) throw error;

      setReplyContent("");
      refetchMessages();
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

  const filteredConversations = inboxData?.conversations.filter(conversation => {
    if (activeTab === "all") return true;
    return conversation.unreadCount > 0;
  });

  const selectedMessages = inboxData?.messages.filter(
    message => message.conversation_id === selectedConversation
  );

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-[90vw] max-w-[800px] h-full flex flex-col p-0">
        <SheetHeader className="p-6 pb-2">
          <SheetTitle>Mensajes</SheetTitle>
        </SheetHeader>
        
        <Tabs defaultValue="all" className="flex-grow flex flex-col" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mx-4">
            <TabsTrigger value="all">Todos</TabsTrigger>
            <TabsTrigger value="unread">No leídos</TabsTrigger>
          </TabsList>

          <div className="flex flex-grow h-[calc(100vh-10rem)]">
            <div className="w-1/4 border-r overflow-hidden">
              <ScrollArea className="h-full">
                {filteredConversations?.map((conversation) => (
                  <div
                    key={conversation.id}
                    className={`p-4 cursor-pointer hover:bg-muted ${
                      selectedConversation === conversation.id ? "bg-muted" : ""
                    }`}
                    onClick={() => setSelectedConversation(conversation.id)}
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={conversation.otherPerson.avatar_url || undefined} />
                        <AvatarFallback>
                          {conversation.otherPerson.full_name?.[0] || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-grow min-w-0">
                        <div className="flex justify-between items-center gap-2">
                          <span className="font-medium truncate">
                            {conversation.otherPerson.user_type === 'ai_builder' 
                              ? conversation.otherPerson.full_name 
                              : conversation.otherPerson.company_name}
                          </span>
                          {conversation.unreadCount > 0 && (
                            <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full flex-shrink-0">
                              {conversation.unreadCount}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground truncate">
                          {conversation.lastMessage.content}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </ScrollArea>
            </div>

            <div className="flex-grow flex flex-col h-full">
              {selectedConversation && inboxData?.conversations && (
                <div className="border-b p-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage 
                        src={inboxData.conversations.find(c => c.id === selectedConversation)?.otherPerson.avatar_url || undefined} 
                      />
                      <AvatarFallback>
                        {inboxData.conversations.find(c => c.id === selectedConversation)?.otherPerson.full_name?.[0] || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-lg font-medium">
                      {inboxData.conversations.find(c => c.id === selectedConversation)?.otherPerson.user_type === 'ai_builder'
                        ? inboxData.conversations.find(c => c.id === selectedConversation)?.otherPerson.full_name
                        : inboxData.conversations.find(c => c.id === selectedConversation)?.otherPerson.company_name}
                    </span>
                  </div>
                </div>
              )}

              <ScrollArea className="flex-grow px-6 py-4">
                <div className="space-y-4">
                  {selectedMessages?.map((message) => {
                    const isFromMe = message.sender_id === session?.user.id;
                    return (
                      <div
                        key={message.id}
                        className={`flex gap-3 ${isFromMe ? "flex-row-reverse" : ""}`}
                      >
                        <Avatar className="h-8 w-8 flex-shrink-0">
                          <AvatarImage
                            src={
                              isFromMe
                                ? message.sender_info?.avatar_url
                                : message.sender_info?.avatar_url
                            }
                          />
                          <AvatarFallback>
                            {(isFromMe
                              ? message.sender_info?.full_name?.[0]
                              : message.sender_info?.full_name?.[0]) || "U"}
                          </AvatarFallback>
                        </Avatar>
                        <div className={`flex flex-col ${isFromMe ? "items-end" : ""} max-w-[70%]`}>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">
                              {isFromMe
                                ? "Tú"
                                : message.sender_info?.user_type === 'ai_builder'
                                  ? message.sender_info.full_name
                                  : message.sender_info?.company_name}
                            </span>
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
                            className={`mt-1 px-4 py-2 rounded-lg break-words ${
                              isFromMe
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted"
                            }`}
                          >
                            {message.content}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>

              {selectedConversation && (
                <div className="p-4 border-t mt-auto">
                  <Textarea
                    placeholder="Escribe tu mensaje..."
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    className="mb-2 resize-none"
                    rows={3}
                  />
                  <div className="flex justify-end">
                    <Button onClick={handleSendReply}>
                      Enviar
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
};

export default Inbox;
