import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Modal } from "./Modal";
import { Field, TextInput } from "./Field";
import { Button } from "./Button";
import { FormError } from "./FormError";
import { createSession } from "../api/sessions";
import { getErrorMessage } from "../api/client";

export function NewSessionModal({ open, onClose }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: createSession,
    onSuccess: ({ sessionId }) => {
      queryClient.invalidateQueries({ queryKey: ["sessions"] });
      handleClose();
      navigate(`/sessions/${sessionId}`);
    },
    onError: (err) => setError(getErrorMessage(err)),
  });

  function handleClose() {
    setName("");
    setDescription("");
    setError("");
    mutation.reset();
    onClose();
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim()) {
      setError("Give the session a name.");
      return;
    }
    setError("");
    mutation.mutate({ name: name.trim(), description: description.trim() });
  }

  return (
    <Modal open={open} onClose={handleClose} title="New session">
      <form onSubmit={handleSubmit} noValidate>
        <FormError>{error}</FormError>
        <Field label="Session name">
          <TextInput
            type="text"
            placeholder="Friday Night High Stakes"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </Field>
        <Field label="Description">
          <TextInput
            type="text"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Field>
        <Button
          type="submit"
          variant="primary"
          loading={mutation.isPending}
          style={{ width: "100%" }}
        >
          Start session
        </Button>
      </form>
    </Modal>
  );
}
