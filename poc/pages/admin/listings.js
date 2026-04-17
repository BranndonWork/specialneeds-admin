import { useTable } from "@refinedev/core";
import AdminLayout from "@components/_Admin/AdminLayout";
import Link from "next/link";

export default function ListingList() {
  const { tableQuery, current, setCurrent, pageCount } = useTable({ resource: "listings" });
  const listings = tableQuery?.data?.data ?? [];
  const isLoading = tableQuery?.isLoading;

  return (
    <AdminLayout>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h2 style={{ margin: 0, fontSize: "18px", color: "#221638", fontWeight: 600 }}>Listings</h2>
        <button style={{
          background: "#0281c4",
          color: "#fff",
          border: "none",
          borderRadius: "6px",
          padding: "8px 16px",
          fontSize: "13px",
          fontWeight: 600,
          cursor: "pointer",
        }}>
          + Add Listing
        </button>
      </div>

      <div style={{ background: "#fff", borderRadius: "8px", border: "1px solid #e5e7eb", overflow: "hidden" }}>
        {isLoading ? (
          <div style={{ padding: "40px", textAlign: "center", color: "#888", fontSize: "14px" }}>Loading…</div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
            <thead>
              <tr style={{ background: "#f9fafb", borderBottom: "1px solid #e5e7eb" }}>
                <th style={{ textAlign: "left", padding: "10px 16px", color: "#555", fontWeight: 600 }}>Title</th>
                <th style={{ textAlign: "left", padding: "10px 16px", color: "#555", fontWeight: 600 }}>Category</th>
                <th style={{ textAlign: "left", padding: "10px 16px", color: "#555", fontWeight: 600 }}>Status</th>
                <th style={{ textAlign: "left", padding: "10px 16px", color: "#555", fontWeight: 600 }}>Published</th>
                <th style={{ textAlign: "left", padding: "10px 16px", color: "#555", fontWeight: 600 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {listings.map((item, i) => (
                <tr key={item.id} style={{ borderBottom: "1px solid #f0f0f0", background: i % 2 === 0 ? "#fff" : "#fafafa" }}>
                  <td style={{ padding: "10px 16px", color: "#221638", fontWeight: 500, maxWidth: "360px" }}>
                    <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.title}</div>
                  </td>
                  <td style={{ padding: "10px 16px", color: "#666", fontSize: "12px" }}>
                    {item.category?.parent ? `${item.category.parent.name} › ${item.category.name}` : item.category?.name ?? "—"}
                  </td>
                  <td style={{ padding: "10px 16px" }}>
                    <span style={{
                      display: "inline-block",
                      padding: "2px 10px",
                      borderRadius: "20px",
                      fontSize: "11px",
                      fontWeight: 600,
                      background: item.status === "published" ? "#e6f4ea" : "#fff3e0",
                      color: item.status === "published" ? "#1e7e34" : "#e65100",
                    }}>
                      {item.status ?? "draft"}
                    </span>
                  </td>
                  <td style={{ padding: "10px 16px", color: "#888", fontSize: "12px" }}>
                    {item.published_at ? new Date(item.published_at).toLocaleDateString() : "—"}
                  </td>
                  <td style={{ padding: "10px 16px" }}>
                    <Link href={`/admin/listings/${item.slug}`} style={{ color: "#0281c4", fontSize: "12px", marginRight: "12px", textDecoration: "none" }}>Edit</Link>
                    <a href="#" style={{ color: "#cc3333", fontSize: "12px", textDecoration: "none" }}>Delete</a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {pageCount > 1 && (
        <div style={{ marginTop: "16px", display: "flex", gap: "8px", justifyContent: "flex-end" }}>
          <button
            onClick={() => setCurrent(c => Math.max(1, c - 1))}
            disabled={current === 1}
            style={{ padding: "6px 14px", borderRadius: "6px", border: "1px solid #e5e7eb", background: "#fff", cursor: "pointer", fontSize: "13px" }}
          >
            Previous
          </button>
          <span style={{ padding: "6px 10px", fontSize: "13px", color: "#555" }}>
            Page {current} of {pageCount}
          </span>
          <button
            onClick={() => setCurrent(c => Math.min(pageCount, c + 1))}
            disabled={current === pageCount}
            style={{ padding: "6px 14px", borderRadius: "6px", border: "1px solid #e5e7eb", background: "#fff", cursor: "pointer", fontSize: "13px" }}
          >
            Next
          </button>
        </div>
      )}
    </AdminLayout>
  );
}
