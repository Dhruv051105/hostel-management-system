
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:5000/api";

function Dashboard() {
  const navigate = useNavigate();

  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Maintenance");
  const [submitting, setSubmitting] = useState(false);
  const [formMessage, setFormMessage] = useState("");

  let user = null;

  try {
    user = JSON.parse(sessionStorage.getItem("user") || "null");
  } catch {
    user = null;
  }

  function logout() {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    navigate("/login", { replace: true });
  }

  async function handleUnauthorized(response) {
    if (response.status === 401) {
      logout();
      return true;
    }

    return false;
  }

  useEffect(() => {
    async function fetchComplaints() {
      const token = sessionStorage.getItem("token");

      if (!token) {
        logout();
        return;
      }

      try {
        const response = await fetch(`${API_URL}/complaints`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (await handleUnauthorized(response)) return;

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to load complaints.");
        }

        setComplaints(data.complaints || []);
      } catch (err) {
        setError(
          err.message === "Failed to fetch"
            ? "Cannot connect to the server. Check that the backend is running."
            : err.message
        );
      } finally {
        setLoading(false);
      }
    }

    fetchComplaints();
  }, []);

  async function handleComplaintSubmit(event) {
    event.preventDefault();
    setFormMessage("");

    if (!title.trim() || !description.trim()) {
      setFormMessage("Please fill in all complaint fields.");
      return;
    }

    const token = sessionStorage.getItem("token");

    if (!token) {
      logout();
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch(`${API_URL}/complaints`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          category,
        }),
      });

      if (await handleUnauthorized(response)) return;

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not submit complaint.");
      }

      setComplaints((previous) => [data.complaint, ...previous]);
      setTitle("");
      setDescription("");
      setCategory("Maintenance");
      setFormMessage("Complaint submitted successfully!");
    } catch (err) {
      setFormMessage(
        err.message === "Failed to fetch"
          ? "Cannot connect to the server."
          : err.message
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-card">
        <h1>Hostel Dashboard</h1>
        <p>Welcome, {user?.name || "Student"}!</p>
        <p>Role: {user?.role || "student"}</p>

        <h2>Submit a Complaint</h2>

        <form onSubmit={handleComplaintSubmit}>
          <label htmlFor="complaint-title">Title</label>
          <input
            id="complaint-title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            maxLength={120}
            placeholder="e.g. Broken bathroom tap"
            required
          />

          <label htmlFor="complaint-category">Category</label>
          <select
            id="complaint-category"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            required
          >
            <option value="Maintenance">Maintenance</option>
            <option value="Cleanliness">Cleanliness</option>
            <option value="Electrical">Electrical</option>
            <option value="Other">Other</option>
          </select>

          <label htmlFor="complaint-description">Description</label>
          <textarea
            id="complaint-description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            maxLength={2000}
            rows={4}
            placeholder="Describe the issue..."
            required
          />

          {formMessage && <p role="status">{formMessage}</p>}

          <button type="submit" disabled={submitting}>
            {submitting ? "Submitting..." : "Submit Complaint"}
          </button>
        </form>

        <h2>Your Complaints</h2>

        {loading && <p>Loading complaints...</p>}
        {error && <p className="form-error" role="alert">{error}</p>}

        {!loading && !error && complaints.length === 0 && (
          <p>You haven't submitted any complaints yet.</p>
        )}

        {complaints.map((complaint) => (
          <article key={complaint._id}>
            <h3>{complaint.title}</h3>
            <p>{complaint.description}</p>
            <p>Category: {complaint.category}</p>
            <p>Status: {complaint.status}</p>
            <hr />
          </article>
        ))}

        <button type="button" onClick={logout}>
          Sign out
        </button>
      </section>
    </main>
  );
}

export default Dashboard;
