import fs from "fs"; //ES6
import { v4 as uuid } from "uuid";

const DB_FILE_PATH = "./core/db";

console.log("[CRUD]");

type UUID = string;

interface Todo {
  id: UUID;
  date: string;
  content: string;
  done: boolean;
}

function create(content: string): Todo {
  // salvar o content no sistema usando a lib fs
  const todo: Todo = {
    id: uuid(),
    date: new Date().toISOString(),
    content: content,
    done: false,
  };

  const todos: Array<Todo> = [...read(), todo];

  // console.log(todo)

  fs.writeFileSync(DB_FILE_PATH, JSON.stringify({ todos, dogs: [] }, null, 2));
  return todo;
}

function read(): Array<Todo> {
  const dbString = fs.readFileSync(DB_FILE_PATH, "utf-8");
  const db = JSON.parse(dbString || "{}");
  if (!db.todos) {
    //Fail Fast Validation
    return [];
  }
  return db.todos;
}

function update(id: UUID, partialTodo: Partial<Todo>): Todo {
  let updatedTodo;

  const todos = read();
  todos.forEach((currentTodo) => {
    console.log(currentTodo);
    const isToUpdate = currentTodo.id === id;
    if (isToUpdate) {
      updatedTodo = Object.assign(currentTodo, partialTodo);
    }
  });
  fs.writeFileSync(DB_FILE_PATH, JSON.stringify({ todos }, null, 2));
  console.log("Todos atualizadas", todos);

  if (!updatedTodo) {
    throw new Error("Please, provide another ID!");
  }
  return updatedTodo;
}

function updateContentById(id: UUID, content: string): Todo {
  return update(id, { content });
}

function deleteById(id: UUID) {
  const todos = read();

  const todosWithoutOne = todos.filter((todo) => {
    if (id === todo.id) {
      return false;
    }
    return true;
  });

  fs.writeFileSync(
    DB_FILE_PATH,
    JSON.stringify({ todos: todosWithoutOne }, null, 2)
  );
}

function CLEAR_DB() {
  fs.writeFileSync(DB_FILE_PATH, "");
}
// [SIMULATION]

CLEAR_DB();
const firstTodo = create("salvando 1");
const secondTodo = create("salvando 2");
deleteById(secondTodo.id);

const thirdTodo = create("salvando 3");

// update(de quem, o que)
update(thirdTodo.id, {
  content: "salvando 3 novamente",
  done: true,
});

// updateContentById(terceiraTodo.id, "atualizando 3");

const todos = read();
console.log(todos);
console.log(todos.length);
