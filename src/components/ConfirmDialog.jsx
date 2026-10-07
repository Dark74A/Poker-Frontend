import { Modal } from "./Modal";
import { Button } from "./Button";
import { FormError } from "./FormError";

export function ConfirmDialog({
  open,
  onClose,
  title,
  description,
  confirmLabel,
  onConfirm,
  isSubmitting,
  error,
}) {
  return (
    <Modal open={open} onClose={onClose} title={title}>
      <p
        style={{
          color: "var(--color-ink-dim)",
          fontSize: 14,
          lineHeight: 1.6,
          marginBottom: 20,
        }}
      >
        {description}
      </p>
      <FormError>{error}</FormError>
      <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
        <Button variant="ghost" onClick={onClose} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button variant="danger" onClick={onConfirm} loading={isSubmitting}>
          {confirmLabel}
        </Button>
      </div>
    </Modal>
  );
}
