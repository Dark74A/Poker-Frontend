import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Modal } from "./Modal";
import { Field, TextInput } from "./Field";
import { Button } from "./Button";
import { FormError } from "./FormError";
import { joinSessionWithCode } from "../api/sessions";
import { getErrorMessage } from "../api/client";

export function JoinSessionModal({ open, onClose }) {
  const [inviteCode, setInviteCode] = useState("");
  const [error, setError] = useState("");
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: joinSessionWithCode,
    onSuccess: ({ sessionId }) => {
      queryClient.invalidateQueries({ queryKey: ["sessions"] });
      queryClient.invalidateQueries({ queryKey: ["session", sessionId] });
      handleClose();
      navigate(`/sessions/${sessionId}`);
    },
    onError: (err) => setError(getErrorMessage(err)),
  });

  function handleClose() {
    setInviteCode("");
    setError("");
    mutation.reset();
    onClose();
  }

  function handleSubmit(event) {
    event.preventDefault();
    const code = inviteCode.trim().toUpperCase();
    if (!code) {
      setError("Enter the session invite code.");
      return;
    }
    setError("");
    mutation.mutate(code);
  }

  return (
    <Modal open={open} onClose={handleClose} title="Join a session">
      <form onSubmit={handleSubmit} noValidate>
        <FormError>{error}</FormError>
        <Field label="Invite code" hint="Ask the session host for their code.">
          <TextInput
            type="text"
            autoComplete="off"
            autoCapitalize="characters"
            maxLength={12}
            placeholder="AB12CDE345FG"
            value={inviteCode}
            onChange={(event) => setInviteCode(event.target.value.toUpperCase())}
          />
        </Field>
        <Button type="submit" loading={mutation.isPending} style={{ width: "100%" }}>
          Join session
        </Button>
      </form>
    </Modal>
  );
}
