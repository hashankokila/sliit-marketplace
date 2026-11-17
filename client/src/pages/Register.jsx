import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "", campus: "Malabe" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const { data } = await api.post("/auth/register", form);
      setSuccess(data.message);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  if (success)
    return (
      <div className="card">
        <h2>Check your email</h2>
        <p>{success}</p>
        <Link to="/login">Go to login</Link>
      </div>
    );

  return (
    <form className="card" onSubmit={handleSubmit}>
      <h2>Create account</h2>
      {error && <p className="error">{error}</p>}
      <input name="name" placeholder="Full name" onChange={handleChange} required />
      <input name="email" type="email" placeholder="IT2xxxxxxx@my.sliit.lk" onChange={handleChange} required />
      <input name="password" type="password" placeholder="Password (min 6)" minLength={6} onChange={handleChange} required />
      <select name="campus" value={form.campus} onChange={handleChange}>
        <option value="Malabe">Malabe</option>
        <option value="Metro">Metro</option>
      </select>
      <button type="submit">Register</button>
      <p>Already have an account? <Link to="/login">Log in</Link></p>
    </form>
  );
}