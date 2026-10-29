
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:5000/api";
const STATUSES = ["Pending", "In Progress", "Resolved"];

function AdminDashboard() {
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState("");
  const [message, setMessage] = useState("");
  const [filter, setFilter] = useState("All");

  const logout = useCallback(() => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    navigate("/login", { replace: true });
  }, [navigate]);

  const loadComplaints = useCallback(async () => {
    const token = sessionStorage.getItem("token");

    if (!token) {
      logout();
      return;
    }

    try {
      setError("");

      const response = await fetch(`${API_URL}/complaints`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 401) {
        logout();
        return;
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not load complaints.");
      }

      setComplaints(data.complaints || []);
    } catch (err) {
      setError(
        err.message === "Failed to fetch"
          ? "Cannot connect to the server."
          : err.message
      );
    } finally {
      setLoading(false);
    }
  }, [logout]);

  useEffect(() => {
    loadComplaints();
  }, [loadComplaints]);

  async function updateStatus(id, status) {
    const token = sessionStorage.getItem("token");

    if (!token) {
      logout();
      return;
    }

    setUpdatingId(id);
    setMessage("");
    setError("");

    try {
      const response = await fetch(`${API_URL}/complaints/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });

      if (response.status === 401) {
        logout();
        return;
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not update complaint.");
      }

      setComplaints((previous) =>
        previous.map((complaint) =>
          complaint._id === id ? data.complaint : complaint
        )
      );

      setMessage("Complaint status updated successfully.");
    } catch (err) {
      setError(
        err.message === "Failed to fetch"
          ? "Cannot connect to the server."
          : err.message
      );
    } finally {
      setUpdatingId("");
    }
  }

  const visibleComplaints =
    filter === "All"
      ? complaints
      : complaints.filter((complaint) => complaint.status === filter);

  const user = JSON.parse(sessionStorage.getItem("user") || "null");

  return (
    <main className="auth-page">
      <section className="auth-card">
        <h1>Admin Dashboard</h1>
        <p>Welcome, {user?.name || "Admin"}!</p>
        <p>Manage and track hostel complaints.</p>

        <h2>Complaint Overview</h2>
        <p>Total complaints: {complaints.length}</p>
        <p>
          Pending: {complaints.filter((c) => c.status === "Pending").length}
        </p>
        <p>
          In progress:{" "}
          {complaints.filter((c) => c.status === "In Progress").length}
        </p>
        <p>
          Resolved: {complaints.filter((c) => c.status === "Resolved").length}
        </p>

        <label htmlFor="status-filter">Filter complaints</label>
        <select
          id="status-filter"
          value={filter}
          onChange={(event) => setFilter(event.target.value)}
        >
          <option value="All">All statuses</option>
          {STATUSES.map((status) => (
            <option key={status} value={status}>{status}</option>
          ))}
        </select>

        {loading && <p>Loading complaints...</p>}
        {error && <p className="form-error" role="alert">{error}</p>}
        {message && <p role="status">{message}</p>}

        {!loading && !error && visibleComplaints.length === 0 && (
          <p>No complaints found for this filter.</p>
        )}

        {visibleComplaints.map((complaint) => (
          <article key={complaint._id}>
            <hr />
            <h3>{complaint.title}</h3>
            <p>{complaint.description}</p>
            <p>Category: {complaint.category}</p>
            <p>
              Student:{" "}
              {complaint.student?.name || "Student details unavailable"}
            </p>
            <p>Email: {complaint.student?.email || "Not available"}</p>
            <p>Current status: {complaint.status}</p>

            <label htmlFor={`status-${complaint._id}`}>
              Update status
            </label>
            <select
              id={`status-${complaint._id}`}
              value={complaint.status}
              disabled={updatingId === complaint._id}
              onChange={(event) =>
                updateStatus(complaint._id, event.target.value)
              }
            >
              {STATUSES.map((status) => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
            {updatingId === complaint._id && <p>Updating...</p>}
          </article>
        ))}

        <button type="button" onClick={loadComplaints} disabled={loading}>
          Refresh complaints
        </button>

        <button type="button" onClick={logout}>
          Sign out
        </button>
      </section>
    </main>
  );
}

export default AdminDashboard;
