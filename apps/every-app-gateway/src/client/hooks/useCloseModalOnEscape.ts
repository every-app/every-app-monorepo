import { useEffect } from "react";

/**
 * Hook to close a modal when the Escape key is pressed
 * @param open - Whether the modal is currently open
 * @param onClose - Function to call to close the modal
 */
export function useCloseModalOnEscape(open: boolean, onClose: () => void) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) {
        onClose();
      }
    };

    if (open) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open, onClose]);
}
