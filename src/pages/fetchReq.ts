import axios from "axios";

export interface Todo {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
}

export const fetchData = async (): Promise<Todo> => {
  const response = await axios.get<Todo>(
    "https://jsonplaceholder.typicode.com/todo/1",
  );
  return response.data;
};
