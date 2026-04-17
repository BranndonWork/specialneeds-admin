import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Navbar from "@components/_App/Navbar";
import Footer from "@components/_App/Footer";
import { authProvider } from "../../providers/authProvider";

const NAV_ITEMS = [
  { label: "Listings", href: "/admin/listings", icon: "bx bx-list-ul" },
  { label: "Articles", href: "/admin/articles", icon: "bx bx-news" },
  { label: "Messages", href: "/admin/messages", icon: "bx bx-message-dots" },
  { label: "Account", href: "/admin/account", icon: "bx bx-user" },
];

export default function AdminLayout({ children }) {
  const router = useRouter();
  const { pathname } = router;
  const [user, setUser] = useState(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    authProvider.check().then(({ authenticated, redirectTo }) => {
      if (!authenticated) {
        router.replace(redirectTo || "/admin/login");
      } else {
        authProvider.getIdentity().then((identity) => {
          setUser(identity);
          setChecked(true);
        });
      }
    });
  }, []);

  const handleSignOut = async (e) => {
    e.preventDefault();
    const { redirectTo } = await authProvider.logout();
    router.replace(redirectTo || "/admin/login");
  };

  if (!checked) return null;

  return (
    <div style={{ fontFamily: "Verdana, Arial, Geneva, Tahoma, sans-serif", display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Navbar classes="" />

      <div style={{ display: "flex", flex: 1, background: "#f4f6f9" }}>
        {/* Sidebar */}
        <aside style={{
          width: "220px",
          flexShrink: 0,
          background: "#ffffff",
          borderRight: "1px solid #e5e7eb",
          padding: "24px 0",
          position: "relative",
        }}>
          <div style={{ padding: "0 16px 16px", borderBottom: "1px solid #f0f0f0", marginBottom: "12px" }}>
            <div style={{ fontSize: "11px", fontWeight: 600, color: "#888", textTransform: "uppercase", letterSpacing: "0.08em" }}>
              Dashboard
            </div>
          </div>

          <nav>
            {NAV_ITEMS.map((item) => {
              const isActive = pathname.startsWith(item.href);
              return (
                <Link key={item.href} href={item.href} style={{ textDecoration: "none", display: "block" }}>
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "10px 16px",
                    margin: "2px 8px",
                    borderRadius: "6px",
                    fontSize: "13px",
                    fontWeight: isActive ? 600 : 400,
                    color: isActive ? "#0281c4" : "#444",
                    background: isActive ? "#e8f4fb" : "transparent",
                    borderLeft: isActive ? "3px solid #0281c4" : "3px solid transparent",
                  }}>
                    <i className={item.icon} style={{ fontSize: "16px" }} />
                    {item.label}
                  </div>
                </Link>
              );
            })}
          </nav>

          <div style={{ position: "absolute", bottom: "80px", left: 0, width: "220px", padding: "16px", borderTop: "1px solid #f0f0f0" }}>
            <div style={{ fontSize: "11px", color: "#999", marginBottom: "4px" }}>Signed in as</div>
            <div style={{ fontSize: "12px", color: "#555", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {user?.email || ""}
            </div>
            <a href="#" onClick={handleSignOut} style={{ display: "block", marginTop: "8px", fontSize: "12px", color: "#0281c4", textDecoration: "none" }}>
              Sign out
            </a>
          </div>
        </aside>

        {/* Content area */}
        <main style={{ flex: 1, padding: "28px", overflowY: "auto" }}>
          {children}
        </main>
      </div>

      <Footer />
    </div>
  );
}
