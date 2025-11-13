interface MobileHeaderProps {
  currentPath: string;
}

export function MobileHeader({ currentPath }: MobileHeaderProps) {
  const getPageTitle = (path: string) => {
    switch (path) {
      case "/":
        return "Todos";
      case "/history":
        return "History";
      default:
        return "Todos";
    }
  };

  return (
    <div className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 px-4 py-3 z-50">
      <h1 className="text-xl font-semibold text-gray-900">
        {getPageTitle(currentPath)}
      </h1>
    </div>
  );
}
