import { userAppsCollection } from "@/client/tanstack-db";
import type { UserApp } from "@/types/user-app";
import { useCloseModalOnEscape } from "@/client/hooks/useCloseModalOnEscape";

interface DeleteAppModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  app: UserApp | null;
}

export function DeleteAppModal({
  open,
  onOpenChange,
  app,
}: DeleteAppModalProps) {
  const handleDelete = () => {
    if (!app) return;
    userAppsCollection.delete(app.id);
    onOpenChange(false);
  };

  const handleClose = () => {
    onOpenChange(false);
  };

  // Handle Escape key to close modal
  useCloseModalOnEscape(open, handleClose);

  return (
    <dialog className={`modal ${open ? "modal-open" : ""}`}>
      <div className="modal-box">
        <h3 className="font-bold text-lg">Delete App</h3>
        <p className="mt-4">
          Are you sure you want to delete{" "}
          <span className="font-semibold">{app?.name}</span>? This action cannot
          be undone.
        </p>

        <div className="modal-action">
          <button
            type="button"
            className="btn btn-outline"
            onClick={handleClose}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-error"
            onClick={handleDelete}
          >
            Delete
          </button>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop" onClick={handleClose}>
        <button type="button">close</button>
      </form>
    </dialog>
  );
}
