
import { Message } from '@/components/ChatMessage';

export type ModelType = "Claude 3.7 Sonnet" | "Claude 3.5 Sonnet";
export type StyleType = "Normal" | "Concise" | "Explanatory" | "Formal";

export interface ChatHistory {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
  messages: Message[];
}
