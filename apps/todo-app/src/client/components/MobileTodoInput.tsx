import { useState } from "react";
import { Input } from "@/client/components/ui/input";
import { Button } from "@/client/components/ui/button";
import { generateDefaultSortKey } from "@/client/lib/fractional-indexing";
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
              sortKey: generateDefaultSortKey(),
              completed: false,
              completedAt: null,
            });
            setNewTodoTitle("");
          }
        }}
        className="flex gap-2 max-w-md mx-auto"
      >
        <Input
          name="title"
          placeholder="New todo..."
          value={newTodoTitle}
          onChange={(e) => setNewTodoTitle(e.target.value)}
          className="focus:border-blue-500 focus:bg-blue-50 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
          aria-label="Enter new todo"
        />
        <Button
          type="submit"
          disabled={!newTodoTitle.trim()}
          className="bg-black text-white hover:bg-gray-700 hover:shadow-lg disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 focus-visible:outline-none transition-all duration-200 transform hover:scale-[1.02] whitespace-nowrap"
          aria-label="Add new todo"
        >
          Add
        </Button>
      </form>
    </div>
  );
}
