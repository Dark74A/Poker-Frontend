import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthShell } from "../components/AuthShell";
import { Field, TextInput } from "../components/Field";
import { Button } from "../components/Button";
import { FormError } from "../components/FormError";
import { useAuth } from "../context/AuthContext";
import { login } from "../api/auth";
import { getErrorMessage } from "../api/client";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { setSession } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (!username.trim() || !password) {
      setError("Enter your username and password.");
      return;
    }
    setLoading(true);
    try {
      const result = await login({ username: username.trim(), password });
      setSession(result);
      navigate(location.state?.from?.pathname || "/", { replace: true });
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell
      eyebrow="Welcome back"
      title="Log in"
      subtitle="Pick up where the ledger left off."
      footer={
        <>
          New to the table? <Link to="/register">Create an account</Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} noValidate>
        <FormError>{error}</FormError>
        <Field label="Username">
          <TextInput
            type="text"
            autoComplete="username"
            autoFocus
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            aria-invalid={Boolean(error)}
          />
        </Field>
        <Field label="Password">
          <TextInput
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            aria-invalid={Boolean(error)}
          />
        </Field>
        <Button
          type="submit"
          variant="primary"
          size="lg"
          loading={loading}
          style={{ width: "100%" }}
        >
          Log in
        </Button>
      </form>
    </AuthShell>
  );
}
