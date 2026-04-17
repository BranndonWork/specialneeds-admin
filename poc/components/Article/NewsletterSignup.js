import { useState } from "react";
import config from "@config/config";

const NewsletterSignup = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!config.newsletterEnabled) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/v1/subscribers/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, subscription_type: "newsletter", source: "article_sidebar" }),
      });

      const json = await response.json();

      if (!response.ok) {
        throw new Error("Something went wrong. Please try again.");
      }

      if (json.success) {
        setSubmitted(true);
        setEmail("");
      } else {
        throw new Error("Something went wrong. Please try again.");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="widget widget-newsletter">
      <h3 className="widget-title">Stay Informed</h3>
      <p>Get the latest special needs resources delivered to your inbox.</p>
      {submitted ? (
        <p className="newsletter-success">
          Thanks! We&apos;ll keep you updated.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="newsletter-form">
          <input
            type="email"
            className="newsletter-input"
            placeholder="Your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
            aria-label="Email address"
          />
          <button type="submit" className="newsletter-btn" disabled={loading}>
            {loading ? "Sending..." : "Stay in Touch"}
          </button>
          {error && (
            <p className="text-red-600 text-sm mt-2" role="alert">
              {error}
            </p>
          )}
        </form>
      )}
    </div>
  );
};

export default NewsletterSignup;
