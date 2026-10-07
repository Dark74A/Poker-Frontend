import { useState } from "react";
import { Modal } from "./Modal";
import { Field, TextInput } from "./Field";
import { Button } from "./Button";
import { FormError } from "./FormError";

export function AmountModal({
  open,
  onClose,
  kind,
  playerName,
  onSubmit,
  isSubmitting,
  error,
}) {
  const [amount, setAmount] = useState("");
  const [localError, setLocalError] = useState("");
  const isBuyIn = kind === "buyin";
  const title = isBuyIn ? "Add buy-in" : "Add cash-out";
  const actionLabel = isBuyIn ? "Record buy-in" : "Record cash-out";

  function handleClose() {
    setAmount("");
    setLocalError("");
    onClose();
  }

  function handleSubmit(e) {
    e.preventDefault();
    const parsed = Number(amount);
    if (!amount || Number.isNaN(parsed) || parsed <= 0) {
      setLocalError("Enter an amount greater than zero.");
      return;
    }
    setLocalError("");
    onSubmit(parsed);
  }

  return (
    <Modal open={open} onClose={handleClose} title={title}>
      <form onSubmit={handleSubmit} noValidate>
        <FormError>{localError || error}</FormError>
        <Field label={`Amount for ${playerName ?? "this player"}`}>
          <TextInput
            type="number"
            inputMode="decimal"
            min="0.01"
            step="0.01"
            placeholder="500"
            autoFocus
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </Field>
        <Button
          type="submit"
          variant="primary"
          loading={isSubmitting}
          style={{ width: "100%" }}
        >
          {actionLabel}
        </Button>
      </form>
    </Modal>
  );
}
