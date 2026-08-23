import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Api } from "../api";

export default function AuthModal() {
  const { modalMode, closeModal, openSignup, openLogin, setUser } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [msg, setMsg] = useState(null); // { type: 'error'|'success', text }
  const [submitting, setSubmitting] = useState(false);

  if (!modalMode) return null;

  const isSignup = modalMode === "signup";

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    setMsg(null);
    setSubmitting(true);
    try {
      if (isSignup) {
        const data = await Api.signup(form);
        setUser(data.user);
        setMsg({ type: "success", text: "Account created! You're signed in — enjoy 20% off your first order 🎉" });
      } else {
        const data = await Api.login({ email: form.email, password: form.password });
        setUser(data.user);
        setMsg({ type: "success", text: `Welcome back, ${data.user.name}!` });
      }
      setTimeout(() => {
        closeModal();
        setForm({ name: "", email: "", password: "" });
        setMsg(null);
      }, 1200);
    } catch (err) {
      setMsg({ type: "error", text: err.message || "Something went wrong" });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="modal-overlay" onClick={closeModal}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={closeModal} aria-label="Close">✕</button>
        <h2>{isSignup ? "Create your account" : "Log in"}</h2>
        <p className="modal-sub">
          {isSignup ? "Sign up and get 20% off your first order." : "Welcome back to SHOP.CO."}
        </p>

        <form onSubmit={onSubmit}>
          {isSignup && (
            <div className="form-field">
              <label htmlFor="name">Full name</label>
              <input
                id="name"
                type="text"
                required
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
                placeholder="Ayesha Khan"
              />
            </div>
          )}
          <div className="form-field">
            <label htmlFor="email">Email address</label>
            <input
              id="email"
              type="email"
              required
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
              placeholder="you@example.com"
            />
          </div>
          <div className="form-field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              required
              minLength={4}
              value={form.password}
              onChange={(e) => update("password", e.target.value)}
              placeholder="••••••••"
            />
          </div>

          {msg && <div className={`form-msg ${msg.type}`}>{msg.text}</div>}

          <button type="submit" className="btn btn-black btn-full" disabled={submitting}>
            {submitting ? "Please wait…" : isSignup ? "Sign Up" : "Log In"}
          </button>
        </form>

        <div className="modal-switch">
          {isSignup ? (
            <>Already have an account? <button onClick={openLogin}>Log in</button></>
          ) : (
            <>Don't have an account? <button onClick={openSignup}>Sign up</button></>
          )}
        </div>
      </div>
    </div>
  );
}
