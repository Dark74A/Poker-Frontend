import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthShell } from "../components/AuthShell";
import { Field, TextInput } from "../components/Field";
import { Button } from "../components/Button";
import { FormError } from "../components/FormError";
import { useAuth } from "../context/AuthContext";
import { register } from "../api/auth";
import { getErrorMessage } from "../api/client";

export default function Register() {
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { setSession } = useAuth();
  const navigate = useNavigate();

  function update(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  function validate() {
    if (!form.username.trim()) return "Choose a username.";
    if (form.username.trim().length < 3)
      return "Username must be at least 3 characters.";
    if (!form.email.trim()) return "Enter your email.";
    if (form.password.length < 8)
      return "Password must be at least 8 characters.";
    return null;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }
    setError("");
    setLoading(true);
    try {
      const result = await register({
        username: form.username.trim(),
        email: form.email.trim(),
        password: form.password,
      });
      setSession(result);
      navigate("/", { replace: true });
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell
      eyebrow="Get started"
      title="Create an account"
      subtitle="Track buy-ins, cash-outs"
      footer={
        <>
          Already have an account? <Link to="/login">Log in</Link>
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
            value={form.username}
            onChange={update("username")}
          />
        </Field>
        <Field label="Email">
          <TextInput
            type="email"
            autoComplete="email"
            value={form.email}
            onChange={update("email")}
          />
        </Field>
        <Field label="Password" hint="At least 8 characters.">
          <TextInput
            type="password"
            autoComplete="new-password"
            value={form.password}
            onChange={update("password")}
          />
        </Field>
        <Button
          type="submit"
          variant="primary"
          size="lg"
          loading={loading}
          style={{ width: "100%" }}
        >
          Create account
        </Button>
      </form>
    </AuthShell>
  );
}
