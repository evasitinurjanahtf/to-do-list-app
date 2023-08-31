export interface Todo {
  id: number;
  name: string;
  status: boolean;
  edited: boolean;
  deadline: string;
  info: string;
}

export interface Todone {
  id: number;
  name: string;
  status: boolean;
  edited: boolean;
  deadline: string;
  info: string;
}

export interface CardlistItem {
  id: string;
  name: string;
  status: boolean;
  deadline: string;
  info: string;
}

export interface Cardlist {
  id: number;
  name: string;
  input: CardlistItem[];
}
