import { useTable } from "@refinedev/core";
import Navbar from "@components/_App/Navbar";
import Footer from "@components/_App/Footer";

export default function PostList() {
  const { tableQuery } = useTable({ resource: "posts" });
  const posts = tableQuery?.data?.data ?? [];
  const isLoading = tableQuery?.isLoading;

  return (
    <>
      <Navbar />
      <div style={{ padding: "2rem", minHeight: "60vh" }}>
        <h1>Posts (Refine POC)</h1>
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={{ textAlign: "left", borderBottom: "1px solid #ccc", padding: "8px" }}>ID</th>
                <th style={{ textAlign: "left", borderBottom: "1px solid #ccc", padding: "8px" }}>Title</th>
                <th style={{ textAlign: "left", borderBottom: "1px solid #ccc", padding: "8px" }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr key={post.id}>
                  <td style={{ padding: "8px", borderBottom: "1px solid #eee" }}>{post.id}</td>
                  <td style={{ padding: "8px", borderBottom: "1px solid #eee" }}>{post.title}</td>
                  <td style={{ padding: "8px", borderBottom: "1px solid #eee" }}>{post.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <Footer />
    </>
  );
}
