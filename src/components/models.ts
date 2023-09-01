export interface Todo {
  id: number;
  name: string;
  deadline: string;
  info: number;
}

export interface ExtendedTodo extends Todo {
  edited: boolean;
}

export interface ContainerType {
  newIndex: number;
  oldIndex: number;
  item: HTMLElement;
  to: HTMLElement;
  from: HTMLElement;
  item_id: number;
}
