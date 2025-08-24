export type Requests = {
  id: string;
  requester: {
    name: string | null;
    id: string;
    email: string;
  };
};

export type User = {
  name: string | null;
  id: string;
  email: string;
};

export type Friend = {
  name: string | null;
  id: string;
  email: string;
};

export type Message = {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  createdAt: string;
};
