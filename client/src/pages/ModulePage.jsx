
import { Link, useLocation } from "react-router-dom";

const moduleContent = {
  "/room": {
    title: "My Room",
    description: "View your room assignment and accommodation details.",
    stats: [
      ["Room number", "B-204"],
      ["Block", "Block B"],
      ["Room type", "Shared"],
      ["Bed", "Bed 2"],
    ],
    items: [
      ["Room allocation", "Your room details will appear here."],
      ["Room facilities", "Facilities and accommodation information."],
    ],
  },
  "/fees": {
    title: "Fee Management",
    description: "Review fee summaries and payment records.",
    stats: [
      ["Total fee", "₹45,000"],
      ["Paid", "₹30,000"],
      ["Balance", "₹15,000"],
      ["Next due", "To be confirmed"],
    ],
    items: [
      ["Fee schedule", "View upcoming fee instalments."],
      ["Payment history", "Your payment records will appear here."],
    ],
  },
  "/complaints": {
    title: "Complaints",
    description: "Track maintenance requests and hostel concerns.",
    stats: [
      ["Status", "Complaint centre"],
      ["Next step", "Open your dashboard"],
    ],
    items: [
      ["Student complaints", "Submit and track complaints from your student dashboard."],
      ["Admin complaints", "Review and update complaints from your admin dashboard."],
    ],
  },
  "/notices": {
    title: "Notices & Announcements",
    description: "Stay updated with hostel announcements.",
    stats: [
      ["Latest notices", "Sample content"],
      ["Updates", "Coming soon"],
    ],
    items: [
      ["Hostel announcement", "Welcome to the HostelHub notice centre."],
      ["Important reminder", "Official announcements will appear here once connected."],
    ],
  },
  "/leave": {
    title: "Leave Requests",
    description: "View leave requests and their approval status.",
    stats: [
      ["Pending requests", "0"],
      ["Approved", "0"],
      ["Rejected", "0"],
    ],
    items: [
      ["Request leave", "Leave request submission will be added in a later step."],
      ["Request history", "Your submitted requests will appear here."],
    ],
  },
  "/visitors": {
    title: "Visitor Management",
    description: "View visitor records and visit information.",
    stats: [
      ["Today's visitors", "0"],
      ["Records", "Sample view"],
    ],
    items: [
      ["Visitor register", "Visitor records will appear here when connected."],
      ["Visit guidelines", "Please follow your hostel's visitor policy."],
    ],
  },
  "/profile": {
    title: "My Profile",
    description: "Review your account information.",
    stats: [
      ["Name", "From your account"],
      ["Account type", "Student"],
    ],
    items: [
      ["Personal information", "Your registered information is managed through your account."],
      ["Account security", "Password and profile editing can be added later."],
    ],
  },
  "/students": {
    title: "Student Management",
    description: "A workspace for managing hostel residents.",
    stats: [
      ["Total students", "—"],
      ["Active residents", "—"],
      ["New admissions", "—"],
    ],
    items: [
      ["Student directory", "Student records will appear when the management API is connected."],
      ["Admissions", "Admission management will be added in a later step."],
    ],
  },
  "/rooms": {
    title: "Room Management",
    description: "Manage room assignments and occupancy.",
    stats: [
      ["Total rooms", "—"],
      ["Occupied beds", "—"],
      ["Available beds", "—"],
    ],
    items: [
      ["Room directory", "Room inventory will appear when the room module is connected."],
      ["Room allocation", "Allocation tools will be added in a later step."],
    ],
  },
  "/settings": {
    title: "Settings",
    description: "Manage hostel system preferences.",
    stats: [
      ["Account", "Active session"],
      ["Configuration", "Coming soon"],
    ],
    items: [
      ["System preferences", "Configuration options will be added later."],
      ["Security", "Keep your login details private and sign out on shared devices."],
    ],
  },
};

function ModulePage() {
  const location = useLocation();
  const page = moduleContent[location.pathname] || {
    title: "Workspace",
    description: "Hostel management tools.",
    stats: [],
    items: [],
  };

  return (
    <div className="module-page">
      <section className="welcome-banner">
        <div>
          <span className="eyebrow">HOSTEL MANAGEMENT</span>
          <h2>{page.title}</h2>
          <p>{page.description}</p>
        </div>
        <div className="banner-symbol">H</div>
      </section>

      <div className="sample-notice">
        <span>ⓘ</span>
        <p>
          Preview mode: these are sample UI values, not live records.
          Backend integration for this module comes later.
        </p>
      </div>

      {page.stats.length > 0 && (
        <section className="module-stat-grid">
          {page.stats.map(([label, value]) => (
            <article className="module-stat-card" key={label}>
              <span>{label}</span>
              <strong>{value}</strong>
            </article>
          ))}
        </section>
      )}

      <section className="panel module-panel">
        <div className="panel-heading">
          <div>
            <h3>{page.title} workspace</h3>
            <p>Tools and information for this section.</p>
          </div>
          <span className="preview-badge">UI PREVIEW</span>
        </div>

        <div className="module-item-list">
          {page.items.map(([title, description]) => (
            <article className="module-item" key={title}>
              <div className="module-item-icon">✦</div>
              <div>
                <h4>{title}</h4>
                <p>{description}</p>
              </div>
            </article>
          ))}
        </div>

        {(location.pathname === "/complaints" ||
          location.pathname === "/fees") && (
          <Link className="primary-link-button" to="/dashboard">
            Go to student dashboard
          </Link>
        )}
      </section>
    </div>
  );
}

export default ModulePage;
