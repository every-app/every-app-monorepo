import { Trash2 } from "lucide-react";
import { useIsMobile } from "@/client/hooks/use-mobile";
import { todoCollection } from "@/client/tanstack-db";

interface HistoryItemProps {
  todo: Todo;
}

export function HistoryItem({ todo }: HistoryItemProps) {
  const isMobile = useIsMobile();

  return (
    <div
      className={`flex items-center gap-3 p-2 rounded-md hover:bg-gray-100 transition-colors ${!isMobile ? "group" : ""}`}
    >
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={(e) => {
          todoCollection.update(todo.id, (draft) => {
            draft.completed = e.target.checked;
          });
        }}
        className="w-4 h-4 rounded border-gray-300 focus:ring-2 focus:ring-black focus:ring-offset-2 transition-all duration-200 hover:ring-2 hover:ring-gray-300 hover:ring-offset-1"
        aria-label={`Mark "${todo.title}" as incomplete`}
      />

      <span className="flex-1 text-sm line-through text-gray-500">
        {todo.title}
      </span>

      <button
        onClick={() => todoCollection.delete(todo.id)}
        className={`${!isMobile ? "opacity-0 group-hover:opacity-100" : ""} p-2 transition-opacity hover:bg-red-50 hover:text-red-600 rounded-md`}
        aria-label={`Delete todo: ${todo.title}`}
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
}
