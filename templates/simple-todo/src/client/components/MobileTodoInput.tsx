import { useState } from "react";
import { todoCollection } from "@/client/tanstack-db";

export function MobileTodoInput() {
  const [newTodoTitle, setNewTodoTitle] = useState<string>("");

  return (
    <div
      className="fixed left-0 right-0 bg-white p-4 z-40"
      style={{ bottom: "70px" }}
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (newTodoTitle.trim()) {
            todoCollection.insert({
              id: crypto.randomUUID(),
              title: newTodoTitle.trim(),
              completed: false,
            });
            setNewTodoTitle("");
          }
        }}
        className="flex gap-2 max-w-md mx-auto"
      >
        <input
          type="text"
          name="title"
          placeholder="New todo..."
          value={newTodoTitle}
          onChange={(e) => setNewTodoTitle(e.target.value)}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:border-blue-500 focus:bg-blue-50 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all duration-200"
          aria-label="Enter new todo"
        />
        <button
          type="submit"
          disabled={!newTodoTitle.trim()}
          className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-700 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed focus:ring-2 focus:ring-black focus:ring-offset-2 focus:outline-none transition-all duration-200 whitespace-nowrap"
          aria-label="Add new todo"
        >
          Add
        </button>
      </form>
    </div>
  );
}
