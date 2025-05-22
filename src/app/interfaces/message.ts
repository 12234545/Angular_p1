export interface Message {
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}


export interface Conversation {
  id: number;
  title: string;
  preview: string;
  messages: Message[];
  date: Date;
}
