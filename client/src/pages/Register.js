import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const invitedOrg = queryParams.get("org");
  const isInvited = Boolean(invitedOrg);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "admin",
    organization: invitedOrg || ""
  });

  useEffect(() => {
    if (invitedOrg) {
      setForm(prev => ({ ...prev, organization: invitedOrg }));
    }
  }, [invitedOrg]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password || !form.organization || !form.role) {
      alert("Please fill in all fields");
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/auth/register", form);
      alert("Registered successfully! Now login.");
      navigate("/login");
    } catch (err) {
      alert("Error: " + (err.response?.data?.message || err.response?.data?.error || "Unknown error"));
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>📝 Register</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input name="name" placeholder="Name" onChange={handleChange} style={styles.input} required />
        <input name="email" type="email" placeholder="Email" onChange={handleChange} style={styles.input} required />
        <input name="password" type="password" placeholder="Password" onChange={handleChange} style={styles.input} required />
        <input
          name="organization"
          placeholder="Organization"
          onChange={handleChange}
          style={styles.input}
          value={form.organization}
          required
          disabled={isInvited}
        />
        <select name="role" value={form.role} onChange={handleChange} style={styles.input}>
          <option value="admin">Admin</option>
          <option value="manager">Manager</option>
          <option value="member">Member</option>
        </select>
        <button type="submit" style={styles.button}>Register</button>
      </form>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "400px",
    margin: "60px auto",
    padding: "30px",
    border: "1px solid #ccc",
    borderRadius: "8px",
    backgroundColor: "#f9f9f9",
    fontFamily: "Segoe UI"
  },
  title: {
    textAlign: "center",
    marginBottom: "20px"
  },
  form: {
    display: "flex",
    flexDirection: "column"
  },
  input: {
    padding: "10px",
    marginBottom: "15px",
    borderRadius: "4px",
    border: "1px solid #ccc",
    fontSize: "16px"
  },
  button: {
    padding: "10px",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "4px",
    fontSize: "16px",
    cursor: "pointer"
  }
};
