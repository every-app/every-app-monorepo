import { useNavigate } from "@tanstack/react-router";
import { User } from "lucide-react";
import { authClient } from "@/client/auth-client";
import { clearQueryCache } from "@/client/tanstack-db";
import { useQueryClient } from "@tanstack/react-query";

interface HeaderProps {
  email?: string | null;
}

export function Header({ email }: HeaderProps) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const handleSignOut = async () => {
    await authClient.signOut();
    // Invalidate session query immediately
    await queryClient.invalidateQueries({ queryKey: ["auth", "session"] });
    // Clear all cached query data for security/privacy
    clearQueryCache();
    navigate({ to: "/sign-in" });
  };

  return (
    <div className="navbar">
      <div className="max-w-4xl justify-between mx-auto w-full flex items-center">
        <div className="flex items-center flex-row">
          <img src="/transparent-logo.png" alt="Logo" className="h-9 w-auto" />
        </div>
        <div className="flex-none flex items-center gap-6">
          <a
            href="https://everyapp.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="link link-hover"
          >
            Docs
          </a>
          {email && (
            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-circle"
              >
                <User className="w-5 h-5" />
              </div>
              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content z-1 mt-3 w-auto min-w-52"
              >
                <li className="menu-title">
                  <span className="text-base-content">{email}</span>
                </li>
                <li>
                  <a onClick={handleSignOut} className="text-error">
                    Sign Out
                  </a>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
