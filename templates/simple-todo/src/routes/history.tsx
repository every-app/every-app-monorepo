import { createFileRoute, Link } from "@tanstack/react-router";
import { useLiveQuery } from "@tanstack/react-db";
import { useMemo } from "react";
import { Calendar } from "lucide-react";
import { useIsMobile } from "@/client/hooks/use-mobile";
import { TabBar } from "@/client/components/TabBar";
import { todoCollection } from "@/client/tanstack-db";
import { HistoryItem } from "@/client/components/TodoHistoryItem";

export const Route = createFileRoute("/history")({
  component: History,
});

function History() {
  const isMobile = useIsMobile();

  // Live query that updates automatically when data changes
  const {
    data: todos,
    isLoading,
    isError,
  } = useLiveQuery((q) => q.from({ todo: todoCollection }));

  const completedTodos = useMemo(
    () => todos?.filter((todo) => todo.completed) ?? [],
    [todos],
  );

  if (isLoading) {
    return null;
  }

  if (isError) {
    return (
      <div className="p-4 overflow-auto">
        <div className="p-4 bg-white rounded-lg border border-gray-200">
          <p className="text-red-600">Error: Failed to load completed todos</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="p-4 overflow-auto">
        {completedTodos.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-lg border border-gray-200">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No completed todos yet
            </h3>
            <p className="text-gray-600 mb-4">
              Complete some todos to see them appear in your history.
            </p>
            <Link to="/">
              <button className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-700 focus:ring-2 focus:ring-black focus:ring-offset-2 focus:outline-none transition-all duration-200">
                See Todos
              </button>
            </Link>
          </div>
        ) : (
          <div className="space-y-2">
            {completedTodos.map((todo) => (
              <HistoryItem key={todo.id} todo={todo} />
            ))}
          </div>
        )}
      </div>
      {isMobile && (
        <div className="fixed bottom-0 left-0 right-0">
          <TabBar currentPath={location.pathname} />
        </div>
      )}
    </>
  );
}
