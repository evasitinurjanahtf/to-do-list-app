export interface Todo {
  id: number;
  name: string;
  status: boolean;
  edited: boolean;
  deadline: string;
  info: string;
}

export interface ContainerType {
  newIndex: number;
  oldIndex: number;
  item: HTMLElement;
  to: HTMLElement;
  item_id: number;
}
