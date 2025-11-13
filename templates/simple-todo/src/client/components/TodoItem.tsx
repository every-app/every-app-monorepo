import { useState, useRef, useEffect } from "react";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useIsMobile } from "@/client/hooks/use-mobile";
import { todoCollection } from "@/client/tanstack-db";

interface TodoItemProps {
  todo: Todo;
  editingTodoId: string | null;
  setEditingTodoId: React.Dispatch<React.SetStateAction<string | null>>;
}

export function TodoItem({
  todo,
  editingTodoId,
  setEditingTodoId,
}: TodoItemProps) {
  const isMobile = useIsMobile();
  const [localTitle, setLocalTitle] = useState(todo.title);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleTitleChange = (newTitle: string) => {
    if (todo.completed) return;
    setLocalTitle(newTitle);
  };

  const handleTitleSave = () => {
    const currentValue = localTitle.trim();

    if (todo.completed) {
      toast.error("Cannot edit completed todos. Unmark as completed first.");
      setLocalTitle(todo.title);
      return;
    }

    if (currentValue !== todo.title) {
      if (currentValue) {
        todoCollection.update(todo.id, (draft) => {
          draft.title = currentValue;
        });
      } else {
        toast.error("Todo title cannot be empty");
        setLocalTitle(todo.title);
      }
    }
  };

  const handleInputFocus = () => {
    if (todo.completed) return;
    setEditingTodoId(todo.id);
  };

  const handleInputBlur = () => {
    if (todo.completed) return;
    setEditingTodoId(null);
    handleTitleSave();
  };

  const handleClickEditTodo = () => {
    if (todo.completed) {
      toast.error("Cannot edit completed todos. Unmark as completed first.");
      return;
    }

    setEditingTodoId(todo.id);
    requestAnimationFrame(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        const textLength = textareaRef.current.value.length;
        textareaRef.current.setSelectionRange(textLength, textLength);
        adjustTextareaHeight();
      }
    });
  };

  const handleTextClick = () => {
    if (todo.completed) return;
    handleClickEditTodo();
  };

  const handleTextKeyDown = (e: React.KeyboardEvent) => {
    if (todo.completed) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleClickEditTodo();
    }
  };

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  useEffect(() => {
    if (editingTodoId === todo.id) {
      adjustTextareaHeight();
    }
  }, [editingTodoId, localTitle, todo.id]);

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
        aria-label={
          todo.completed
            ? `Mark as incomplete: "${todo.title}"`
            : `Mark as complete ${todo.title}`
        }
      />

      <div className="flex-1">
        {editingTodoId === todo.id ? (
          <textarea
            ref={textareaRef}
            id={formatInlineEditId(todo.id)}
            value={localTitle}
            onChange={(e) => handleTitleChange(e.target.value)}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                setEditingTodoId(null);
                e.currentTarget.blur();
              } else if (e.key === "Escape") {
                setLocalTitle(todo.title);
                setEditingTodoId(null);
                e.currentTarget.blur();
              }
            }}
            className="w-full border-none bg-transparent focus:ring-0 focus:border-none focus:outline-none shadow-none px-2 py-1 text-sm leading-6 transition-all duration-200 cursor-text focus:cursor-text focus:bg-blue-50 resize-none overflow-hidden"
            rows={1}
            autoFocus
            aria-label={`Edit todo: ${todo.title}`}
          />
        ) : (
          <div
            role="button"
            tabIndex={todo.completed ? -1 : 0}
            onClick={handleTextClick}
            onKeyDown={handleTextKeyDown}
            className={`px-2 py-1 text-sm leading-6 rounded transition-all duration-200 break-words ${
              todo.completed
                ? "line-through text-gray-500 cursor-default"
                : "cursor-text hover:bg-gray-50 focus:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-200"
            }`}
            aria-label={
              todo.completed
                ? `Completed todo: ${todo.title}`
                : `Edit todo: ${todo.title}`
            }
          >
            {todo.title}
          </div>
        )}
      </div>

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

function formatInlineEditId(id: string) {
  return `todo-inline-edit-id-${id}`;
}
