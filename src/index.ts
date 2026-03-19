import { TodoItem } from "./todoItem";
import { TodoCollection } from "./todoCollection";

let todos: TodoItem[] = [
    new TodoItem(1, "Buy Flowers"),
    new TodoItem(2, "Get Shoes"),
    new TodoItem(3, "Collect Tickets"),
    new TodoItem(4, "Call Joe", true)
];

let collection: TodoCollection = new TodoCollection("Adam", todos);

console.clear();
console.log(`${collection.userName}'s Todo List (${collection.getItemCounts().incomplete} items to do)`);
console.log("=".repeat(50));

console.log("\nAll tasks:");
collection.getTodoItems(true).forEach(item => item.printDetails());

console.log("\nAdding new task: 'Go for run'");
let newId: number = collection.addTodo("Go for run");
let newTodo: TodoItem | undefined = collection.getTodoById(newId);
if (newTodo) {
    newTodo.printDetails();
}

console.log("\nMarking task #2 as complete");
collection.markComplete(2, true);

console.log("\nPending tasks only:");
collection.getTodoItems(false).forEach(item => item.printDetails());

const counts = collection.getItemCounts();
console.log(`\nStats: ${counts.incomplete} of ${counts.total} tasks pending`);

console.log("\nRemoving completed tasks...");
collection.removeComplete();

console.log("\nFinal task list:");
collection.getTodoItems(true).forEach(item => item.printDetails());
console.log(`\nFinal stats: ${collection.getItemCounts().incomplete} of ${collection.getItemCounts().total} tasks pending`);