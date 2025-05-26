import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Dashboard() {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "Feature",
    priority: "Medium",
    dueDate: "",
    assignedTo: ""
  });

  const isAdminOrManager = user?.role === "admin" || user?.role === "manager";

  const fetchTasks = async () => {
    if (!user || !token) return;
    const res = await axios.get("http://localhost:5000/api/tasks", {
      headers: { Authorization: `Bearer ${token}` }
    });

    const visibleTasks =
      user.role === "member"
        ? res.data.filter((task) => task.assignedTo === user.id)
        : res.data;

    setTasks(visibleTasks);
  };

  const fetchUsers = async () => {
    if (!isAdminOrManager || !token) return;
    const res = await axios.get("http://localhost:5000/api/auth/users", {
      headers: { Authorization: `Bearer ${token}` }
    });
    setUsers(res.data);
  };

  useEffect(() => {
    if (!user || !token) {
      window.location.href = "/";
    } else {
      fetchTasks();
      fetchUsers();
    }
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/tasks", form, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setForm({
        title: "",
        description: "",
        category: "Feature",
        priority: "Medium",
        dueDate: "",
        assignedTo: ""
      });
      fetchTasks();
    } catch (err) {
      alert("Task creation failed: " + (err.response?.data?.message || err.message));
    }
  };

  if (!user || !token) return <div>Redirecting to login...</div>;

  return (
    <div style={{ maxWidth: "800px", margin: "auto", padding: "20px", fontFamily: "Segoe UI" }}>
      {/* Top bar */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "20px",
        background: "#f0f0f0",
        padding: "10px 20px",
        borderRadius: "10px"
      }}>
        <div>
        👤 <b>{user.name}</b> ({user.role})  
      🏢 <i>{user.organization}</i>

        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          {isAdminOrManager && user.organization && (
            <button
              onClick={() => {
                const inviteLink = `${window.location.origin}/register?org=${user.organization}`;
                navigator.clipboard.writeText(inviteLink);
                alert(`📎 Invite link copied!\n\n${inviteLink}`);
              }}
              style={{
                backgroundColor: "#28a745",
                color: "white",
                border: "none",
                padding: "8px 16px",
                borderRadius: "5px",
                cursor: "pointer"
              }}
            >
              📎 Invite
            </button>
          )}
          <button
            style={{
              backgroundColor: "#ff4d4d",
              color: "white",
              border: "none",
              padding: "8px 16px",
              cursor: "pointer",
              borderRadius: "5px"
            }}
            onClick={() => {
              localStorage.clear();
              window.location.href = "/";
            }}
          >
            Logout
          </button>
        </div>
      </div>

      <h2 style={{ textAlign: "center" }}>📝 Task Dashboard</h2>

      {isAdminOrManager && (
        <>
          <h3 style={{ marginTop: "30px" }}>➕ Create New Task</h3>
          <form onSubmit={handleCreate} style={{
            background: "#fafafa",
            padding: "15px",
            borderRadius: "10px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.1)"
          }}>
            <input name="title" placeholder="Title" value={form.title} onChange={handleChange}
              style={{ width: "100%", padding: "8px", marginBottom: "10px" }} />
            <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange}
              style={{ width: "100%", padding: "8px", marginBottom: "10px" }} />
            <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
              <select name="category" value={form.category} onChange={handleChange} style={{ flex: 1, padding: "8px" }}>
                <option>Bug</option>
                <option>Feature</option>
                <option>Improvement</option>
              </select>
              <select name="priority" value={form.priority} onChange={handleChange} style={{ flex: 1, padding: "8px" }}>
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </select>
            </div>
            <input name="dueDate" type="date" value={form.dueDate} onChange={handleChange}
              style={{ width: "100%", padding: "8px", marginBottom: "10px" }} />
            <select name="assignedTo" value={form.assignedTo} onChange={handleChange}
              style={{ width: "100%", padding: "8px", marginBottom: "10px" }}>
              <option value="">-- Assign To --</option>
              {users.map(u => (
                <option key={u._id} value={u._id}>{u.name} ({u.role})</option>
              ))}
            </select>
            <button type="submit" style={{
              width: "100%", padding: "10px", backgroundColor: "#4CAF50",
              color: "white", border: "none", borderRadius: "5px", cursor: "pointer"
            }}>Create Task</button>
          </form>
        </>
      )}

      <h3 style={{ marginTop: "40px" }}>📋 Your Tasks</h3>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {tasks.map(task => (
          <li key={task._id} style={{
            background: "#fff",
            borderLeft: `5px solid ${task.status === "Expired" ? "red" : "#2196f3"}`,
            padding: "15px",
            marginBottom: "15px",
            borderRadius: "8px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
            color: task.status === "Expired" ? "red" : "#333"
          }}>
            <b>{task.title}</b> <br />
            <div style={{ marginTop: "5px" }}>
              Status:
              <select
                value={task.status}
                onChange={async (e) => {
                  try {
                    await axios.patch(`http://localhost:5000/api/tasks/${task._id}/status`,
                      { status: e.target.value },
                      { headers: { Authorization: `Bearer ${token}` } }
                    );
                    fetchTasks();
                  } catch {
                    alert("Failed to update status");
                  }
                }}
                style={{ marginLeft: "10px", padding: "4px" }}
              >
                <option>Todo</option>
                <option>In Progress</option>
                <option>Completed</option>
                <option>Expired</option>
              </select>
            </div>
            <div style={{ marginTop: "5px" }}>
              Due: {task.dueDate?.split("T")[0]} <br />
              Assigned To: {task.assignedTo || "Not assigned"}
            </div>

            {isAdminOrManager && (
              <button
                style={{
                  marginTop: "10px",
                  padding: "6px 12px",
                  background: "#e53935",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer"
                }}
                onClick={async () => {
                  if (window.confirm("Are you sure you want to delete this task?")) {
                    try {
                      await axios.delete(`http://localhost:5000/api/tasks/${task._id}`, {
                        headers: { Authorization: `Bearer ${token}` }
                      });
                      fetchTasks();
                    } catch {
                      alert("Failed to delete");
                    }
                  }
                }}
              >
                🗑️ Delete
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
