import { useOne } from "@refinedev/core";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import AdminLayout from "@components/_Admin/AdminLayout";
import TipTapEditor from "@components/_Admin/TipTapEditor";
import CategoryDataForm from "@components/_Admin/CategoryDataForm";
import Link from "next/link";
import { axiosInstance } from "../../../providers/djangoDataProvider";
import { flattenCategoryData } from "../../../utils/categoryDataTransform";

export default function ListingEdit() {
  const router = useRouter();
  const slugArr = router.query.slug;
  const slug = Array.isArray(slugArr) ? slugArr.join("/") : slugArr;

  const { query } = useOne({ resource: "listings", id: slug, queryOptions: { enabled: !!slug && router.isReady } });

  const isLoading = !router.isReady || (query?.isLoading ?? true);
  const listing = query?.data?.data;

  const [title, setTitle] = useState("");
  const [status, setStatus] = useState("draft");
  const [categorySlug, setCategorySlug] = useState("");
  const [content, setContent] = useState("");
  const [categoryData, setCategoryData] = useState({});
  const [listingId, setListingId] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!listing) return;
    setTitle(listing.title ?? "");
    setStatus(listing.status ?? "draft");
    setContent(listing.content ?? "");
    setCategorySlug(listing.category?.slug ?? "");
    setCategoryData(listing.category_data ?? {});
    setListingId(listing.id);
  }, [listing]);

  const handleCategoryFieldChange = (sectionKey, fieldKey, value) => {
    setCategoryData((prev) => {
      const updated = JSON.parse(JSON.stringify(prev));
      updated[sectionKey].fields[fieldKey].attributes.value = value;
      return updated;
    });
  };

  const handleSave = async () => {
    if (!listingId) return;
    setIsSaving(true);
    try {
      await axiosInstance.put(`/listings/${listingId}/`, {
        listing_data: {
          ...listing,
          title,
          status,
          content,
          category: categorySlug,
        },
        category_data: flattenCategoryData(categoryData),
      });
    } finally {
      setIsSaving(false);
    }
  };

  const categories = listing?.categories ?? [];

  const inputStyle = {
    width: "100%",
    padding: "8px 12px",
    fontSize: "13px",
    border: "1px solid #d1d5db",
    borderRadius: "6px",
    fontFamily: "Verdana, Arial, Geneva, Tahoma, sans-serif",
    color: "#221638",
    boxSizing: "border-box",
  };

  const labelStyle = {
    display: "block",
    fontSize: "12px",
    fontWeight: 600,
    color: "#555",
    marginBottom: "6px",
  };

  return (
    <AdminLayout>
      {/* Top bar */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <Link href="/admin/listings" style={{ fontSize: "13px", color: "#0281c4", textDecoration: "none" }}>
            ← Listings
          </Link>
          <span style={{ color: "#ccc" }}>|</span>
          <h2 style={{ margin: 0, fontSize: "18px", color: "#221638", fontWeight: 600 }}>Edit Listing</h2>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving || isLoading}
          style={{
            background: isSaving ? "#ccc" : "#0281c4",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            padding: "8px 20px",
            fontSize: "13px",
            fontWeight: 600,
            cursor: isSaving ? "not-allowed" : "pointer",
          }}
        >
          {isSaving ? "Saving…" : "Save"}
        </button>
      </div>

      {isLoading ? (
        <div style={{ padding: "60px", textAlign: "center", color: "#888", fontSize: "14px" }}>Loading…</div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {/* Core fields */}
          <div style={{
            background: "#fff",
            borderRadius: "8px",
            border: "1px solid #e5e7eb",
            padding: "20px",
            display: "grid",
            gridTemplateColumns: "1fr 180px 220px",
            gap: "16px",
          }}>
            <div>
              <label style={labelStyle}>Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Status</label>
              <select value={status} onChange={(e) => setStatus(e.target.value)} style={inputStyle}>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>Category</label>
              <select value={categorySlug} onChange={(e) => setCategorySlug(e.target.value)} style={inputStyle}>
                {categories.map((cat) => (
                  <option key={cat.slug} value={cat.slug}>
                    {cat.parent ? `${cat.parent.name} › ${cat.name}` : cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Content editor */}
          <div style={{ background: "#fff", borderRadius: "8px", border: "1px solid #e5e7eb", padding: "20px" }}>
            <label style={{ ...labelStyle, marginBottom: "12px" }}>Content</label>
            <TipTapEditor value={content} onChange={setContent} />
          </div>

          {/* Category-specific fields */}
          <div style={{ background: "#fff", borderRadius: "8px", border: "1px solid #e5e7eb", padding: "20px" }}>
            <label style={{ ...labelStyle, marginBottom: "16px" }}>Specifics</label>
            <CategoryDataForm
              categoryData={categoryData}
              onChange={handleCategoryFieldChange}
            />
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
