import { useOne, useUpdate } from "@refinedev/core";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import AdminLayout from "@components/_Admin/AdminLayout";
import TipTapEditor from "@components/_Admin/TipTapEditor";
import Link from "next/link";

export default function ArticleEdit() {
  const router = useRouter();
  const slugArr = router.query.slug;
  const slug = Array.isArray(slugArr) ? slugArr.join("/") : slugArr;

  const { query } = useOne({ resource: "articles", id: slug, queryOptions: { enabled: !!slug && router.isReady } });
  const { mutate: update, isLoading: isSaving } = useUpdate();

  const isLoading = !router.isReady || (query?.isLoading ?? true);
  const article = query?.data?.data;

  const [title, setTitle] = useState("");
  const [status, setStatus] = useState("draft");
  const [categoryId, setCategoryId] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    if (!article) return;
    setTitle(article.title ?? "");
    setStatus(article.status ?? "draft");
    setContent(article.content ?? "");
    setCategoryId(article.category?.slug ?? "");
  }, [article]);

  const handleSave = () => {
    update({
      resource: "articles",
      id: slug,
      values: {
        title,
        status,
        category: { id: categoryId },
        content,
      },
      successNotification: false,
    });
  };

  // Build grouped structure: only child categories are selectable;
  // parent categories serve as <optgroup> labels.
  const allCategories = article?.categories ?? [];
  const categoryGroups = allCategories.reduce((groups, cat) => {
    if (!cat.parent) return groups; // skip top-level parents
    const parentSlug = cat.parent.slug;
    if (!groups[parentSlug]) groups[parentSlug] = { name: cat.parent.name, children: [] };
    groups[parentSlug].children.push(cat);
    return groups;
  }, {});

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
          <Link
            href="/admin/articles"
            style={{ fontSize: "13px", color: "#0281c4", textDecoration: "none" }}
          >
            ← Articles
          </Link>
          <span style={{ color: "#ccc" }}>|</span>
          <h2 style={{ margin: 0, fontSize: "18px", color: "#221638", fontWeight: 600 }}>Edit Article</h2>
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
          {/* Metadata row */}
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
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                style={inputStyle}
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>Category</label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                style={inputStyle}
              >
                {Object.entries(categoryGroups).map(([parentSlug, group]) => (
                  <optgroup key={parentSlug} label={group.name}>
                    {group.children.map((cat) => (
                      <option key={cat.slug} value={cat.slug}>{cat.name}</option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </div>
          </div>

          {/* Content editor */}
          <div style={{ background: "#fff", borderRadius: "8px", border: "1px solid #e5e7eb", padding: "20px" }}>
            <label style={{ ...labelStyle, marginBottom: "12px" }}>Content</label>
            <TipTapEditor value={content} onChange={setContent} />
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
