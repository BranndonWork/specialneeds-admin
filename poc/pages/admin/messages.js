import { useTable, useGetIdentity } from "@refinedev/core";
import AdminLayout from "@components/_Admin/AdminLayout";
import Link from "next/link";
import { useState } from "react";

const TYPE_LABELS = {
  listing_moderation: "Listing Moderation",
  article_moderation: "Article Moderation",
  listing_claim: "Listing Claim",
  listing_contact: "Listing Contact",
  article_contact: "Article Contact",
  user_support: "User Support",
  general_contact: "General Contact",
};

const STATUS_STYLES = {
  new: { bg: "#fee2e2", color: "#b91c1c", label: "New" },
  waiting_on_staff: { bg: "#fef3c7", color: "#92400e", label: "Waiting on Staff" },
  waiting_on_user: { bg: "#dbeafe", color: "#1e40af", label: "Waiting on User" },
  resolved: { bg: "#d1fae5", color: "#065f46", label: "Resolved" },
  closed: { bg: "#f3f4f6", color: "#4b5563", label: "Closed" },
  spam: { bg: "#fce7f3", color: "#9d174d", label: "Spam" },
};

export default function MessagesList() {
  const [typeFilter, setTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [assignedFilter, setAssignedFilter] = useState("");

  const { data: identity } = useGetIdentity();
  const currentUserId = identity?.id ? String(identity.id) : null;

  const filters = [];
  if (typeFilter) filters.push({ field: "type", operator: "eq", value: typeFilter });
  if (statusFilter) filters.push({ field: "status", operator: "eq", value: statusFilter });
  if (assignedFilter === "me" && currentUserId) {
    filters.push({ field: "assignee", operator: "eq", value: currentUserId });
  } else if (assignedFilter === "unassigned") {
    filters.push({ field: "assignee", operator: "eq", value: "null" });
  }

  const { tableQuery, current, setCurrent, pageCount } = useTable({
    resource: "conversations",
    filters: { permanent: filters },
  });

  const conversations = tableQuery?.data?.data ?? [];
  const isLoading = tableQuery?.isLoading;

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "—";
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const renderAssignee = (conv) => {
    const data = conv.assignee_data;
    if (!data) {
      return <span style={{ color: "#888", fontStyle: "italic" }}>Unassigned</span>;
    }
    const isMe = currentUserId && String(data.id) === currentUserId;
    return (
      <span style={{ color: isMe ? "#0281c4" : "#444", fontWeight: isMe ? 600 : 400 }}>
        {isMe ? "You" : data.displayname}
      </span>
    );
  };

  const selectStyle = {
    padding: "8px 12px",
    fontSize: "13px",
    border: "1px solid #d1d5db",
    borderRadius: "6px",
    fontFamily: "Verdana, Arial, Geneva, Tahoma, sans-serif",
    color: "#221638",
  };

  return (
    <AdminLayout>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h2 style={{ margin: 0, fontSize: "18px", color: "#221638", fontWeight: 600 }}>Messages</h2>
      </div>

      <div style={{ display: "flex", gap: "12px", marginBottom: "16px", flexWrap: "wrap" }}>
        <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} style={selectStyle}>
          <option value="">All Types</option>
          {Object.entries(TYPE_LABELS).map(([key, label]) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </select>

        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={selectStyle}>
          <option value="">All Statuses</option>
          {Object.entries(STATUS_STYLES).map(([key, { label }]) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </select>

        <select value={assignedFilter} onChange={(e) => setAssignedFilter(e.target.value)} style={selectStyle}>
          <option value="">All Assignments</option>
          <option value="me">Assigned to me</option>
          <option value="unassigned">Unassigned</option>
        </select>
      </div>

      <div style={{ background: "#fff", borderRadius: "8px", border: "1px solid #e5e7eb", overflow: "hidden" }}>
        {isLoading ? (
          <div style={{ padding: "40px", textAlign: "center", color: "#888", fontSize: "14px" }}>Loading…</div>
        ) : conversations.length === 0 ? (
          <div style={{ padding: "60px", textAlign: "center", color: "#888", fontSize: "14px" }}>
            No messages to display
          </div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
            <thead>
              <tr style={{ background: "#f9fafb", borderBottom: "1px solid #e5e7eb" }}>
                <th style={{ textAlign: "left", padding: "10px 16px", color: "#555", fontWeight: 600 }}>Subject</th>
                <th style={{ textAlign: "left", padding: "10px 16px", color: "#555", fontWeight: 600 }}>Type</th>
                <th style={{ textAlign: "left", padding: "10px 16px", color: "#555", fontWeight: 600 }}>Status</th>
                <th style={{ textAlign: "left", padding: "10px 16px", color: "#555", fontWeight: 600 }}>Assignee</th>
                <th style={{ textAlign: "left", padding: "10px 16px", color: "#555", fontWeight: 600 }}>Last Message</th>
                <th style={{ textAlign: "left", padding: "10px 16px", color: "#555", fontWeight: 600 }}>Participants</th>
                <th style={{ textAlign: "left", padding: "10px 16px", color: "#555", fontWeight: 600 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {conversations.map((item, i) => {
                const statusStyle = STATUS_STYLES[item.status] || { bg: "#f3f4f6", color: "#4b5563", label: item.status };
                return (
                  <tr key={item.id} style={{ borderBottom: "1px solid #f0f0f0", background: i % 2 === 0 ? "#fff" : "#fafafa" }}>
                    <td style={{ padding: "10px 16px", color: "#221638", fontWeight: 500, maxWidth: "360px" }}>
                      <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {item.subject}
                      </div>
                      {item.last_message_preview && (
                        <div style={{ fontSize: "11px", color: "#888", marginTop: "2px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {item.last_message_preview}
                        </div>
                      )}
                    </td>
                    <td style={{ padding: "10px 16px", color: "#666", fontSize: "12px" }}>
                      {TYPE_LABELS[item.type] || item.type}
                    </td>
                    <td style={{ padding: "10px 16px" }}>
                      <span style={{
                        display: "inline-block",
                        padding: "2px 10px",
                        borderRadius: "20px",
                        fontSize: "11px",
                        fontWeight: 600,
                        background: statusStyle.bg,
                        color: statusStyle.color,
                      }}>
                        {statusStyle.label}
                      </span>
                    </td>
                    <td style={{ padding: "10px 16px", fontSize: "12px" }}>
                      {renderAssignee(item)}
                    </td>
                    <td style={{ padding: "10px 16px", color: "#888", fontSize: "12px" }}>
                      {formatTimestamp(item.last_message_at)}
                    </td>
                    <td style={{ padding: "10px 16px", color: "#888", fontSize: "12px" }}>
                      {item.participant_count || 0}
                    </td>
                    <td style={{ padding: "10px 16px" }}>
                      <Link href={`/admin/messages/${item.id}`} style={{ color: "#0281c4", fontSize: "12px", textDecoration: "none" }}>
                        View
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {pageCount > 1 && (
        <div style={{ marginTop: "16px", display: "flex", gap: "8px", justifyContent: "flex-end" }}>
          <button
            onClick={() => setCurrent(c => Math.max(1, c - 1))}
            disabled={current === 1}
            style={{
              padding: "6px 14px",
              borderRadius: "6px",
              border: "1px solid #e5e7eb",
              background: "#fff",
              cursor: current === 1 ? "not-allowed" : "pointer",
              fontSize: "13px",
            }}
          >
            Previous
          </button>
          <span style={{ padding: "6px 10px", fontSize: "13px", color: "#555" }}>
            Page {current} of {pageCount}
          </span>
          <button
            onClick={() => setCurrent(c => Math.min(pageCount, c + 1))}
            disabled={current === pageCount}
            style={{
              padding: "6px 14px",
              borderRadius: "6px",
              border: "1px solid #e5e7eb",
              background: "#fff",
              cursor: current === pageCount ? "not-allowed" : "pointer",
              fontSize: "13px",
            }}
          >
            Next
          </button>
        </div>
      )}
    </AdminLayout>
  );
}
