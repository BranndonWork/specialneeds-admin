import { useOne, useGetIdentity } from "@refinedev/core";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import AdminLayout from "@components/_Admin/AdminLayout";
import Link from "next/link";
import { axiosInstance } from "../../../providers/djangoDataProvider";

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

export default function MessageDetail() {
  const router = useRouter();
  const { uuid } = router.query;

  const { data: identity } = useGetIdentity();
  const currentUserId = identity?.id ? String(identity.id) : null;

  const { query } = useOne({
    resource: "conversations",
    id: uuid,
    queryOptions: { enabled: !!uuid && router.isReady },
  });

  const isLoading = !router.isReady || (query?.isLoading ?? true);
  const conversation = query?.data?.data;
  const refetch = query?.refetch;

  const [replyContent, setReplyContent] = useState("");
  const [isInternal, setIsInternal] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [statusValue, setStatusValue] = useState("");
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [reassignOpen, setReassignOpen] = useState(false);
  const [staffList, setStaffList] = useState([]);
  const [isReassigning, setIsReassigning] = useState(false);

  useEffect(() => {
    if (conversation) {
      setStatusValue(conversation.status);
    }
  }, [conversation]);

  const handleSendMessage = async () => {
    if (!replyContent.trim() || !uuid) return;
    setIsSending(true);
    try {
      await axiosInstance.post(`/conversations/${uuid}/messages/`, {
        content: replyContent,
        is_internal: isInternal,
      });
      setReplyContent("");
      setIsInternal(false);
      if (refetch) await refetch();
    } catch (error) {
      console.error("Failed to send message:", error);
      alert("Failed to send message. Please try again.");
    } finally {
      setIsSending(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    if (!uuid || newStatus === statusValue) return;
    setIsUpdatingStatus(true);
    try {
      await axiosInstance.patch(`/conversations/${uuid}/status/`, { status: newStatus });
      setStatusValue(newStatus);
      if (refetch) await refetch();
    } catch (error) {
      console.error("Failed to update status:", error);
      alert("Failed to update status. Please try again.");
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const openReassign = async () => {
    setReassignOpen(true);
    if (staffList.length === 0) {
      try {
        const { data } = await axiosInstance.get(`/conversations/staff/`);
        setStaffList(data.results || []);
      } catch (error) {
        console.error("Failed to load staff list:", error);
        alert("Failed to load staff list.");
        setReassignOpen(false);
      }
    }
  };

  const handleReassign = async (assigneeId) => {
    if (!uuid || !assigneeId) return;
    setIsReassigning(true);
    try {
      await axiosInstance.post(`/conversations/${uuid}/reassign/`, {
        assignee_id: assigneeId,
      });
      setReassignOpen(false);
      if (refetch) await refetch();
    } catch (error) {
      console.error("Failed to reassign conversation:", error);
      alert("Failed to reassign. Please try again.");
    } finally {
      setIsReassigning(false);
    }
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  const getSenderDisplay = (sender) => {
    if (!sender) return "Unknown";
    if (sender.user_data?.displayname) return sender.user_data.displayname;
    if (sender.email) return sender.email;
    return "User";
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div style={{ padding: "60px", textAlign: "center", color: "#888", fontSize: "14px" }}>Loading…</div>
      </AdminLayout>
    );
  }

  if (!conversation) {
    return (
      <AdminLayout>
        <div style={{ padding: "60px", textAlign: "center", color: "#888", fontSize: "14px" }}>
          Conversation not found
        </div>
      </AdminLayout>
    );
  }

  const statusStyle = STATUS_STYLES[statusValue] || { bg: "#f3f4f6", color: "#4b5563", label: statusValue };
  const assignee = conversation.assignee_data;
  const assignedToMe = assignee && currentUserId && String(assignee.id) === currentUserId;
  const assigneeLabel = !assignee
    ? "Unassigned"
    : assignedToMe
      ? "Assigned to you"
      : `Assigned to ${assignee.displayname}`;

  return (
    <AdminLayout>
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
        <Link href="/admin/messages" style={{ fontSize: "13px", color: "#0281c4", textDecoration: "none" }}>
          ← Messages
        </Link>
        <span style={{ color: "#ccc" }}>|</span>
        <h2 style={{ margin: 0, fontSize: "18px", color: "#221638", fontWeight: 600 }}>
          {conversation.subject}
        </h2>
      </div>

      <div style={{ background: "#fff", borderRadius: "8px", border: "1px solid #e5e7eb", padding: "20px", marginBottom: "20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", gap: "12px", flexWrap: "wrap" }}>
          <div style={{ display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap", position: "relative" }}>
            <span style={{
              padding: "4px 12px",
              borderRadius: "20px",
              fontSize: "11px",
              fontWeight: 600,
              background: "#f0f0f0",
              color: "#555",
            }}>
              {TYPE_LABELS[conversation.type] || conversation.type}
            </span>
            <span style={{
              padding: "4px 12px",
              borderRadius: "20px",
              fontSize: "11px",
              fontWeight: 600,
              background: statusStyle.bg,
              color: statusStyle.color,
            }}>
              {statusStyle.label}
            </span>

            <span style={{
              padding: "4px 12px",
              borderRadius: "20px",
              fontSize: "11px",
              fontWeight: 600,
              background: assignedToMe ? "#e0f2fe" : "#f3f4f6",
              color: assignedToMe ? "#075985" : "#4b5563",
              fontStyle: !assignee ? "italic" : "normal",
            }}>
              {assigneeLabel}
            </span>

            <button
              onClick={openReassign}
              disabled={isReassigning}
              style={{
                padding: "6px 14px",
                fontSize: "12px",
                fontWeight: 600,
                borderRadius: "6px",
                border: "1px solid #d1d5db",
                background: "#fff",
                color: "#4b5563",
                cursor: isReassigning ? "not-allowed" : "pointer",
              }}
            >
              Reassign
            </button>

            {reassignOpen && (
              <div
                style={{
                  position: "absolute",
                  top: "100%",
                  left: 0,
                  marginTop: "8px",
                  background: "#fff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "6px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                  minWidth: "240px",
                  padding: "4px",
                  zIndex: 10,
                }}
              >
                <div style={{ padding: "8px 12px", fontSize: "11px", fontWeight: 600, color: "#888", borderBottom: "1px solid #f0f0f0" }}>
                  Reassign to…
                </div>
                {staffList.length === 0 ? (
                  <div style={{ padding: "12px", fontSize: "12px", color: "#888" }}>Loading…</div>
                ) : (
                  staffList.map((u) => {
                    const isCurrent = assignee && String(assignee.id) === String(u.id);
                    return (
                      <button
                        key={u.id}
                        onClick={() => handleReassign(u.id)}
                        disabled={isReassigning || isCurrent}
                        style={{
                          display: "block",
                          width: "100%",
                          textAlign: "left",
                          padding: "8px 12px",
                          fontSize: "13px",
                          border: "none",
                          background: isCurrent ? "#f9fafb" : "#fff",
                          color: isCurrent ? "#888" : "#221638",
                          cursor: isCurrent || isReassigning ? "not-allowed" : "pointer",
                          borderRadius: "4px",
                        }}
                      >
                        {u.displayname}
                        {isCurrent && <span style={{ fontSize: "11px", color: "#888", marginLeft: "6px" }}>(current)</span>}
                      </button>
                    );
                  })
                )}
                <div style={{ borderTop: "1px solid #f0f0f0", padding: "4px" }}>
                  <button
                    onClick={() => setReassignOpen(false)}
                    style={{
                      display: "block",
                      width: "100%",
                      textAlign: "left",
                      padding: "6px 8px",
                      fontSize: "12px",
                      border: "none",
                      background: "#fff",
                      color: "#888",
                      cursor: "pointer",
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
          <select
            value={statusValue}
            onChange={(e) => handleStatusChange(e.target.value)}
            disabled={isUpdatingStatus}
            style={{
              padding: "6px 12px",
              fontSize: "13px",
              border: "1px solid #d1d5db",
              borderRadius: "6px",
              fontFamily: "Verdana, Arial, Geneva, Tahoma, sans-serif",
              color: "#221638",
              cursor: isUpdatingStatus ? "not-allowed" : "pointer",
            }}
          >
            {Object.entries(STATUS_STYLES).map(([key, { label }]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
        </div>

        {conversation.related_object && (
          <div style={{ fontSize: "12px", color: "#666", marginBottom: "12px" }}>
            Related: {conversation.related_object.type} - {conversation.related_object.title}
          </div>
        )}

        <div style={{ fontSize: "12px", color: "#888" }}>
          Created: {formatTimestamp(conversation.created_at)} | Participants: {conversation.participants?.length || 0}
        </div>
      </div>

      <div style={{ background: "#fff", borderRadius: "8px", border: "1px solid #e5e7eb", padding: "20px", marginBottom: "20px" }}>
        <h3 style={{ margin: "0 0 16px 0", fontSize: "14px", fontWeight: 600, color: "#221638" }}>Messages</h3>
        {conversation.messages && conversation.messages.length > 0 ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {conversation.messages.map((message) => (
              <div
                key={message.id}
                style={{
                  padding: "12px 16px",
                  borderRadius: "6px",
                  background: message.is_internal ? "#fffbea" : "#fafafa",
                  border: message.is_internal ? "1px solid #fde68a" : "1px solid #e5e7eb",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                  <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                    <span style={{ fontSize: "13px", fontWeight: 600, color: "#221638" }}>
                      {getSenderDisplay(message.sender)}
                    </span>
                    {message.is_internal && (
                      <span style={{
                        fontSize: "10px",
                        fontWeight: 600,
                        padding: "2px 6px",
                        borderRadius: "4px",
                        background: "#fbbf24",
                        color: "#78350f",
                      }}>
                        Internal Note
                      </span>
                    )}
                  </div>
                  <span style={{ fontSize: "11px", color: "#888" }}>
                    {formatTimestamp(message.created_at)}
                  </span>
                </div>
                <div style={{ fontSize: "13px", color: "#444", whiteSpace: "pre-wrap" }}>
                  {message.content}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ padding: "20px", textAlign: "center", color: "#888", fontSize: "13px" }}>
            No messages yet
          </div>
        )}
      </div>

      <div style={{ background: "#fff", borderRadius: "8px", border: "1px solid #e5e7eb", padding: "20px" }}>
        <h3 style={{ margin: "0 0 12px 0", fontSize: "14px", fontWeight: 600, color: "#221638" }}>Reply</h3>
        <textarea
          value={replyContent}
          onChange={(e) => setReplyContent(e.target.value)}
          placeholder="Type your message..."
          style={{
            width: "100%",
            minHeight: "120px",
            padding: "12px",
            fontSize: "13px",
            border: "1px solid #d1d5db",
            borderRadius: "6px",
            fontFamily: "Verdana, Arial, Geneva, Tahoma, sans-serif",
            color: "#221638",
            resize: "vertical",
            marginBottom: "12px",
          }}
        />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "#555", cursor: "pointer" }}>
            <input
              type="checkbox"
              checked={isInternal}
              onChange={(e) => setIsInternal(e.target.checked)}
              style={{ cursor: "pointer" }}
            />
            Internal note (staff only) — does not claim the ticket
          </label>
          <button
            onClick={handleSendMessage}
            disabled={isSending || !replyContent.trim()}
            style={{
              background: isSending || !replyContent.trim() ? "#ccc" : "#0281c4",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              padding: "8px 20px",
              fontSize: "13px",
              fontWeight: 600,
              cursor: isSending || !replyContent.trim() ? "not-allowed" : "pointer",
            }}
          >
            {isSending ? "Sending…" : "Send"}
          </button>
        </div>
      </div>
    </AdminLayout>
  );
}
