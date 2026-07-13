export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: string | null;
  user_id: string | null;
  unread_count: number;
  created_at: string | null;
  updated_at: string;
}

export interface MessageReply {
  id: string;
  message_id: string;
  sender_type: string;
  sender_id: string | null;
  body: string;
  created_at: string;
}

export function useClientMessages() {
  return {
    data: [] as ContactMessage[],
    isLoading: false,
    error: null,
  };
}

export function useMessageReplies(_messageId: string) {
  return {
    data: [] as MessageReply[],
    isLoading: false,
    error: null,
  };
}

export function useSendReply(_messageId: string) {
  return {
    mutate: (_payload: { body: string }) => {},
    isPending: false,
    error: null,
  };
}

export function useMarkMessageRead() {
  return {
    mutate: (_messageId: string) => {},
    isPending: false,
  };
}
