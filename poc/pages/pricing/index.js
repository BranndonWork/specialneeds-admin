import PageBanner from "@components/Common/PageBanner";
import Footer from "@components/_App/Footer";
import HTMLHeaderMetaData from "@components/_App/HTMLHeaderMetaData";
import Navbar from "@components/_App/Navbar";
import Link from "next/link";
import { useState } from "react";
import pricing from "@data/texts/en/pricing.json";

export default function Pricing() {
  const [isAnnual, setIsAnnual] = useState(true);

  const flipBilling = () => setIsAnnual((v) => !v);

  return (
    <>
      <HTMLHeaderMetaData title={pricing.pageTitle} />
      <Navbar />
      <PageBanner
        bannerFilename="pricing"
        pageTitle={pricing.pageTitle}
        pageName={pricing.pageTitle}
      />

      <div className="pv2-page">

        {/* Hero */}
        <div className="pv2-hero">
          <div className="pv2-social-proof">2,400+ providers already on the waitlist</div>
          <h1 className="pv2-hero-h1">Grow your reach.<br />Reach more families.</h1>
          <p className="pv2-hero-p">Plans designed for special needs service providers. Pick your level of visibility and start connecting with families today.</p>
        </div>

        {/* Billing toggle */}
        <div className="pv2-billing-wrap">
          <span className={`pv2-billing-label ${isAnnual ? "pv2-inactive" : "pv2-active"}`}>Monthly</span>
          <div
            className={`pv2-toggle-track${isAnnual ? " pv2-annual" : ""}`}
            onClick={flipBilling}
            role="switch"
            aria-checked={isAnnual}
            aria-label="Toggle between monthly and annual billing"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === " " || e.key === "Enter") {
                e.preventDefault();
                flipBilling();
              }
            }}
          >
            <div className="pv2-toggle-knob"></div>
          </div>
          <span className={`pv2-billing-label ${isAnnual ? "pv2-active" : "pv2-inactive"}`}>Annually</span>
          {isAnnual && <span className="pv2-savings-tag">Save up to 20%</span>}
        </div>

        {/* Plans */}
        <main className="pv2-main">

          {/* Monthly panel */}
          <div style={{ display: isAnnual ? "none" : "block" }}>
            <div className="pv2-plans-wrap">

              {/* Free */}
              <div className="pv2-plan-card">
                <div className="pv2-plan-name">Free</div>
                <div className="pv2-plan-price">$0</div>
                <div className="pv2-plan-period">forever free</div>
                <div className="pv2-plan-save">&nbsp;</div>
                <div className="pv2-divider"></div>
                <ul className="pv2-features">
                  <li><span className="pv2-fi-check pv2-n">—</span><span>1–2 photos</span></li>
                  <li><span className="pv2-fi-check pv2-n">—</span><span>200 word description</span></li>
                  <li className="pv2-included"><span className="pv2-fi-check pv2-y">✓</span><span>Monthly view count</span></li>
                  <li><span className="pv2-fi-check pv2-n">—</span><span>Verified badge</span></li>
                  <li><span className="pv2-fi-check pv2-n">—</span><span>Analytics</span></li>
                  <li><span className="pv2-fi-check pv2-n">—</span><span>Review response</span></li>
                  <li><span className="pv2-fi-check pv2-n">—</span><span>Priority placement</span></li>
                  <li><span className="pv2-fi-check pv2-n">—</span><span>Featured placement</span></li>
                  <li><span className="pv2-fi-check pv2-n">—</span><span>Account support</span></li>
                </ul>
                <Link href="/waitlist" className="pv2-btn pv2-btn-outline">Get Started Free</Link>
              </div>

              {/* Professional monthly */}
              <div className="pv2-plan-card">
                <div className="pv2-plan-name">Professional</div>
                <div className="pv2-plan-price">$49</div>
                <div className="pv2-plan-period">per month</div>
                <div className="pv2-plan-save">&nbsp;</div>
                <div className="pv2-divider"></div>
                <ul className="pv2-features">
                  <li className="pv2-included"><span className="pv2-fi-check pv2-y">✓</span><span>Up to 10 photos</span></li>
                  <li className="pv2-included"><span className="pv2-fi-check pv2-y">✓</span><span>1,000 word description</span></li>
                  <li className="pv2-included"><span className="pv2-fi-check pv2-y">✓</span><span>Monthly view count</span></li>
                  <li className="pv2-included"><span className="pv2-fi-check pv2-y">✓</span><span>Verified badge</span></li>
                  <li className="pv2-included"><span className="pv2-fi-check pv2-y">✓</span><span>Analytics: views, searches &amp; clicks</span></li>
                  <li className="pv2-included"><span className="pv2-fi-check pv2-y">✓</span><span>Review response</span></li>
                  <li><span className="pv2-fi-check pv2-n">—</span><span>Priority placement</span></li>
                  <li><span className="pv2-fi-check pv2-n">—</span><span>Featured placement</span></li>
                  <li><span className="pv2-fi-check pv2-n">—</span><span>Account support</span></li>
                </ul>
                <Link href="/waitlist" className="pv2-btn pv2-btn-primary">Start Growing Today</Link>
              </div>

              {/* Premium monthly — recommended */}
              <div className="pv2-plan-card pv2-recommended">
                <div className="pv2-rec-badge">Most Popular</div>
                <div className="pv2-plan-name">Premium</div>
                <div className="pv2-plan-price">$99</div>
                <div className="pv2-plan-period">per month</div>
                <div className="pv2-plan-save">&nbsp;</div>
                <div className="pv2-divider"></div>
                <ul className="pv2-features">
                  <li className="pv2-included"><span className="pv2-fi-check pv2-y">✓</span><span>Unlimited photos</span></li>
                  <li className="pv2-included"><span className="pv2-fi-check pv2-y">✓</span><span>Unlimited description</span></li>
                  <li className="pv2-included"><span className="pv2-fi-check pv2-y">✓</span><span>Monthly view count</span></li>
                  <li className="pv2-included"><span className="pv2-fi-check pv2-y">✓</span><span>Verified badge</span></li>
                  <li className="pv2-included"><span className="pv2-fi-check pv2-y">✓</span><span>Detailed analytics + competitive benchmarking</span></li>
                  <li className="pv2-included"><span className="pv2-fi-check pv2-y">✓</span><span>Review response</span></li>
                  <li className="pv2-included"><span className="pv2-fi-check pv2-y">✓</span><span>Priority placement in search</span></li>
                  <li><span className="pv2-fi-check pv2-n">—</span><span>Featured placement</span></li>
                  <li><span className="pv2-fi-check pv2-n">—</span><span>Account support</span></li>
                </ul>
                <Link href="/waitlist" className="pv2-btn pv2-btn-gold">Start Growing Today</Link>
              </div>

              {/* Featured monthly */}
              <div className="pv2-plan-card">
                <div className="pv2-plan-name">Featured</div>
                <div className="pv2-plan-price">$149</div>
                <div className="pv2-plan-period">per month</div>
                <div className="pv2-plan-save">&nbsp;</div>
                <div className="pv2-divider"></div>
                <ul className="pv2-features">
                  <li className="pv2-included"><span className="pv2-fi-check pv2-y">✓</span><span>Unlimited photos</span></li>
                  <li className="pv2-included"><span className="pv2-fi-check pv2-y">✓</span><span>Unlimited description</span></li>
                  <li className="pv2-included"><span className="pv2-fi-check pv2-y">✓</span><span>Monthly view count</span></li>
                  <li className="pv2-included"><span className="pv2-fi-check pv2-y">✓</span><span>Verified badge</span></li>
                  <li className="pv2-included"><span className="pv2-fi-check pv2-y">✓</span><span>Detailed analytics + competitive benchmarking</span></li>
                  <li className="pv2-included"><span className="pv2-fi-check pv2-y">✓</span><span>Review response</span></li>
                  <li className="pv2-included"><span className="pv2-fi-check pv2-y">✓</span><span>Priority placement in search</span></li>
                  <li className="pv2-included"><span className="pv2-fi-check pv2-y">✓</span><span>Featured on homepage &amp; category pages</span></li>
                  <li className="pv2-included"><span className="pv2-fi-check pv2-y">✓</span><span>Dedicated account support</span></li>
                </ul>
                <Link href="/waitlist" className="pv2-btn pv2-btn-primary">Start Growing Today</Link>
              </div>

            </div>
          </div>

          {/* Annual panel */}
          <div style={{ display: isAnnual ? "block" : "none" }}>
            <div className="pv2-plans-wrap">

              {/* Free annual */}
              <div className="pv2-plan-card">
                <div className="pv2-plan-name">Free</div>
                <div className="pv2-plan-price">$0</div>
                <div className="pv2-plan-period">forever free</div>
                <div className="pv2-plan-save">&nbsp;</div>
                <div className="pv2-divider"></div>
                <ul className="pv2-features">
                  <li><span className="pv2-fi-check pv2-n">—</span><span>1–2 photos</span></li>
                  <li><span className="pv2-fi-check pv2-n">—</span><span>200 word description</span></li>
                  <li className="pv2-included"><span className="pv2-fi-check pv2-y">✓</span><span>Monthly view count</span></li>
                  <li><span className="pv2-fi-check pv2-n">—</span><span>Verified badge</span></li>
                  <li><span className="pv2-fi-check pv2-n">—</span><span>Analytics</span></li>
                  <li><span className="pv2-fi-check pv2-n">—</span><span>Review response</span></li>
                  <li><span className="pv2-fi-check pv2-n">—</span><span>Priority placement</span></li>
                  <li><span className="pv2-fi-check pv2-n">—</span><span>Featured placement</span></li>
                  <li><span className="pv2-fi-check pv2-n">—</span><span>Account support</span></li>
                </ul>
                <Link href="/waitlist" className="pv2-btn pv2-btn-outline">Get Started Free</Link>
              </div>

              {/* Professional annual */}
              <div className="pv2-plan-card">
                <div className="pv2-plan-name">Professional</div>
                <div className="pv2-plan-price">$470</div>
                <div className="pv2-plan-period">per year <span style={{ fontWeight: 400 }}>(~$39/mo)</span></div>
                <div className="pv2-plan-save">Save $118 vs. monthly</div>
                <div className="pv2-divider"></div>
                <ul className="pv2-features">
                  <li className="pv2-included"><span className="pv2-fi-check pv2-y">✓</span><span>Up to 10 photos</span></li>
                  <li className="pv2-included"><span className="pv2-fi-check pv2-y">✓</span><span>1,000 word description</span></li>
                  <li className="pv2-included"><span className="pv2-fi-check pv2-y">✓</span><span>Monthly view count</span></li>
                  <li className="pv2-included"><span className="pv2-fi-check pv2-y">✓</span><span>Verified badge</span></li>
                  <li className="pv2-included"><span className="pv2-fi-check pv2-y">✓</span><span>Analytics: views, searches &amp; clicks</span></li>
                  <li className="pv2-included"><span className="pv2-fi-check pv2-y">✓</span><span>Review response</span></li>
                  <li><span className="pv2-fi-check pv2-n">—</span><span>Priority placement</span></li>
                  <li><span className="pv2-fi-check pv2-n">—</span><span>Featured placement</span></li>
                  <li><span className="pv2-fi-check pv2-n">—</span><span>Account support</span></li>
                </ul>
                <Link href="/waitlist" className="pv2-btn pv2-btn-primary">Start Growing Today</Link>
              </div>

              {/* Premium annual — recommended */}
              <div className="pv2-plan-card pv2-recommended">
                <div className="pv2-rec-badge">Most Popular</div>
                <div className="pv2-plan-name">Premium</div>
                <div className="pv2-plan-price">$950</div>
                <div className="pv2-plan-period">per year <span style={{ fontWeight: 400 }}>(~$79/mo)</span></div>
                <div className="pv2-plan-save">Save $238 vs. monthly</div>
                <div className="pv2-divider"></div>
                <ul className="pv2-features">
                  <li className="pv2-included"><span className="pv2-fi-check pv2-y">✓</span><span>Unlimited photos</span></li>
                  <li className="pv2-included"><span className="pv2-fi-check pv2-y">✓</span><span>Unlimited description</span></li>
                  <li className="pv2-included"><span className="pv2-fi-check pv2-y">✓</span><span>Monthly view count</span></li>
                  <li className="pv2-included"><span className="pv2-fi-check pv2-y">✓</span><span>Verified badge</span></li>
                  <li className="pv2-included"><span className="pv2-fi-check pv2-y">✓</span><span>Detailed analytics + competitive benchmarking</span></li>
                  <li className="pv2-included"><span className="pv2-fi-check pv2-y">✓</span><span>Review response</span></li>
                  <li className="pv2-included"><span className="pv2-fi-check pv2-y">✓</span><span>Priority placement in search</span></li>
                  <li><span className="pv2-fi-check pv2-n">—</span><span>Featured placement</span></li>
                  <li><span className="pv2-fi-check pv2-n">—</span><span>Account support</span></li>
                </ul>
                <Link href="/waitlist" className="pv2-btn pv2-btn-gold">Start Growing Today</Link>
              </div>

              {/* Featured annual */}
              <div className="pv2-plan-card">
                <div className="pv2-plan-name">Featured</div>
                <div className="pv2-plan-price">$1,430</div>
                <div className="pv2-plan-period">per year <span style={{ fontWeight: 400 }}>(~$119/mo)</span></div>
                <div className="pv2-plan-save">Save $358 vs. monthly</div>
                <div className="pv2-divider"></div>
                <ul className="pv2-features">
                  <li className="pv2-included"><span className="pv2-fi-check pv2-y">✓</span><span>Unlimited photos</span></li>
                  <li className="pv2-included"><span className="pv2-fi-check pv2-y">✓</span><span>Unlimited description</span></li>
                  <li className="pv2-included"><span className="pv2-fi-check pv2-y">✓</span><span>Monthly view count</span></li>
                  <li className="pv2-included"><span className="pv2-fi-check pv2-y">✓</span><span>Verified badge</span></li>
                  <li className="pv2-included"><span className="pv2-fi-check pv2-y">✓</span><span>Detailed analytics + competitive benchmarking</span></li>
                  <li className="pv2-included"><span className="pv2-fi-check pv2-y">✓</span><span>Review response</span></li>
                  <li className="pv2-included"><span className="pv2-fi-check pv2-y">✓</span><span>Priority placement in search</span></li>
                  <li className="pv2-included"><span className="pv2-fi-check pv2-y">✓</span><span>Featured on homepage &amp; category pages</span></li>
                  <li className="pv2-included"><span className="pv2-fi-check pv2-y">✓</span><span>Dedicated account support</span></li>
                </ul>
                <Link href="/waitlist" className="pv2-btn pv2-btn-primary">Start Growing Today</Link>
              </div>

            </div>
          </div>

          {/* Trust bar */}
          <div className="pv2-trust-bar">
            <div className="pv2-trust-item">
              <span className="pv2-trust-icon">🔒</span>
              <div className="pv2-trust-text"><strong>No lock-in</strong>Cancel anytime</div>
            </div>
            <div className="pv2-trust-item">
              <span className="pv2-trust-icon">✅</span>
              <div className="pv2-trust-text"><strong>Verified listings</strong>Trusted by families</div>
            </div>
            <div className="pv2-trust-item">
              <span className="pv2-trust-icon">⚡</span>
              <div className="pv2-trust-text"><strong>Instant setup</strong>Live in minutes</div>
            </div>
            <div className="pv2-trust-item">
              <span className="pv2-trust-icon">📍</span>
              <div className="pv2-trust-text"><strong>2,400+ providers</strong>on the waitlist</div>
            </div>
          </div>

          {/* Volume section */}
          <section style={{ marginBottom: "4rem" }}>
            <h2 className="pv2-section-title">Multiple Locations?</h2>
            <p className="pv2-section-desc">Volume discounts apply automatically. The more locations you list, the less you pay per location.</p>
            <div className="pv2-volume">
              <div className="pv2-vol-card">
                <div className="pv2-vol-range">1–5 locations</div>
                <div className="pv2-vol-label">Standard rate</div>
              </div>
              <div className="pv2-vol-card">
                <div className="pv2-vol-range">6–15 locations</div>
                <div className="pv2-vol-label">15% off per location</div>
              </div>
              <div className="pv2-vol-card">
                <div className="pv2-vol-range">16–50 locations</div>
                <div className="pv2-vol-label">25% off per location</div>
              </div>
              <div className="pv2-vol-card pv2-enterprise">
                <div className="pv2-vol-range">50+ locations</div>
                <div className="pv2-vol-label">Custom enterprise pricing</div>
              </div>
            </div>
          </section>

          {/* CTA section */}
          <div className="pv2-cta-section">
            <h2>Have questions about pricing?</h2>
            <p>We&apos;re happy to help you find the right plan for your organization.</p>
            <Link href="/waitlist" className="pv2-btn pv2-btn-gold pv2-cta-btn">Join the Waitlist →</Link>
          </div>

        </main>
      </div>

      <Footer />

      <style jsx global>{`
        .pv2-page {
          font-family: 'Plus Jakarta Sans', -apple-system, sans-serif;
          background: #F5F9FC;
          color: #1B2559;
        }

        /* Hero */
        .pv2-hero {
          text-align: center;
          padding: 5rem 2rem 3rem;
          max-width: 720px;
          margin: 0 auto;
        }
        .pv2-social-proof {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(34, 197, 94, 0.12);
          border: 1px solid rgba(34, 197, 94, 0.3);
          color: #22C55E;
          padding: 0.4rem 1rem;
          border-radius: 100px;
          font-size: 0.85rem;
          font-weight: 700;
          margin-bottom: 1.75rem;
        }
        .pv2-social-proof::before {
          content: '●';
          font-size: 0.6rem;
        }
        .pv2-hero-h1 {
          font-size: 3.25rem;
          font-weight: 800;
          letter-spacing: -0.04em;
          line-height: 1.1;
          margin-bottom: 1rem;
          color: #1B2559;
        }
        .pv2-hero-p {
          font-size: 1.15rem;
          color: #64748B;
          max-width: 500px;
          margin: 0 auto 2.5rem;
        }

        /* Billing toggle */
        .pv2-billing-wrap {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 1rem;
          margin-bottom: 3.5rem;
        }
        .pv2-billing-label {
          font-size: 0.95rem;
          font-weight: 700;
        }
        .pv2-billing-label.pv2-active { color: #1B2559; }
        .pv2-billing-label.pv2-inactive { color: #64748B; }
        .pv2-toggle-track {
          position: relative;
          width: 52px;
          height: 28px;
          background: #D1E4F0;
          border-radius: 100px;
          cursor: pointer;
          transition: background 0.2s;
        }
        .pv2-toggle-track.pv2-annual { background: #3B82F6; }
        .pv2-toggle-knob {
          position: absolute;
          top: 3px;
          left: 3px;
          width: 22px;
          height: 22px;
          background: #fff;
          border-radius: 50%;
          transition: left 0.2s;
        }
        .pv2-toggle-track.pv2-annual .pv2-toggle-knob { left: 27px; }
        .pv2-savings-tag {
          background: #F0A500;
          color: #000;
          font-size: 0.75rem;
          font-weight: 800;
          padding: 0.2rem 0.6rem;
          border-radius: 100px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        /* Main */
        .pv2-main {
          max-width: 1220px;
          margin: 0 auto;
          padding: 0 2rem 5rem;
        }

        /* Plans grid */
        .pv2-plans-wrap {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr 1fr;
          gap: 1.25rem;
          align-items: start;
          margin-bottom: 1.5rem;
        }
        @media (max-width: 960px) {
          .pv2-plans-wrap { grid-template-columns: 1fr 1fr; }
        }
        @media (max-width: 560px) {
          .pv2-plans-wrap { grid-template-columns: 1fr; }
        }

        /* Plan card */
        .pv2-plan-card {
          background: #FFFFFF;
          border: 1px solid #D1E4F0;
          border-radius: 12px;
          padding: 2rem 1.75rem;
          display: flex;
          flex-direction: column;
        }
        .pv2-recommended {
          background: #EEF5FF;
          border: 2px solid #F0A500;
          position: relative;
          box-shadow: 0 0 40px rgba(240, 165, 0, 0.15);
          transform: scale(1.02);
        }

        /* Badge */
        .pv2-rec-badge {
          position: absolute;
          top: -14px;
          left: 50%;
          transform: translateX(-50%);
          background: #F0A500;
          color: #000;
          font-size: 0.8rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.07em;
          padding: 0.3rem 1rem;
          border-radius: 100px;
          white-space: nowrap;
        }

        /* Plan name */
        .pv2-plan-name {
          font-size: 1.1rem;
          font-weight: 700;
          color: #64748B;
          margin-bottom: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }
        .pv2-recommended .pv2-plan-name { color: #F0A500; }

        /* Price */
        .pv2-plan-price {
          font-size: 3rem;
          font-weight: 800;
          letter-spacing: -0.04em;
          line-height: 1;
          color: #1B2559;
        }
        .pv2-plan-period {
          font-size: 0.9rem;
          color: #64748B;
          margin-bottom: 0.375rem;
        }
        .pv2-plan-save {
          font-size: 0.85rem;
          color: #22C55E;
          font-weight: 700;
          margin-bottom: 1.75rem;
          min-height: 1.25rem;
        }

        /* Divider */
        .pv2-divider {
          height: 1px;
          background: #D1E4F0;
          margin-bottom: 1.5rem;
        }

        /* Features */
        .pv2-features {
          list-style: none;
          flex: 1;
          margin: 0 0 2rem;
          padding: 0;
        }
        .pv2-features li {
          display: flex;
          gap: 0.625rem;
          align-items: flex-start;
          padding: 0.5rem 0;
          font-size: 0.9rem;
          color: #64748B;
          border-bottom: 1px solid rgba(0, 0, 0, 0.05);
        }
        .pv2-features li.pv2-included { color: #1B2559; }
        .pv2-fi-check {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          flex-shrink: 0;
          margin-top: 0.1em;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.75rem;
          font-weight: 900;
        }
        .pv2-fi-check.pv2-y { background: rgba(34, 197, 94, 0.15); color: #22C55E; }
        .pv2-fi-check.pv2-n { background: rgba(0, 0, 0, 0.05); color: #64748B; }

        /* Buttons */
        .pv2-btn {
          display: block;
          width: 100%;
          padding: 0.9rem 1.5rem;
          text-align: center;
          font-size: 1rem;
          font-weight: 800;
          text-decoration: none;
          border-radius: 8px;
          transition: all 0.15s;
          border: 2px solid transparent;
          cursor: pointer;
        }
        .pv2-btn-primary { background: #22C55E; color: #fff; border-color: #22C55E; }
        .pv2-btn-primary:hover { background: #16A34A; border-color: #16A34A; color: #fff; }
        .pv2-btn-gold { background: #F0A500; color: #000; border-color: #F0A500; }
        .pv2-btn-gold:hover { background: #D4920A; border-color: #D4920A; color: #000; }
        .pv2-btn-outline { background: transparent; color: #1B2559; border-color: #D1E4F0; }
        .pv2-btn-outline:hover { border-color: #64748B; }

        /* Trust bar */
        .pv2-trust-bar {
          display: flex;
          justify-content: center;
          gap: 3rem;
          flex-wrap: wrap;
          padding: 2rem;
          margin-bottom: 4rem;
          border-top: 1px solid #D1E4F0;
          border-bottom: 1px solid #D1E4F0;
        }
        .pv2-trust-item {
          display: flex;
          align-items: center;
          gap: 0.625rem;
        }
        .pv2-trust-icon { font-size: 1.25rem; }
        .pv2-trust-text { font-size: 0.9rem; color: #64748B; }
        .pv2-trust-text strong { color: #1B2559; display: block; }

        /* Volume */
        .pv2-section-title {
          font-size: 2rem;
          font-weight: 800;
          letter-spacing: -0.03em;
          margin-bottom: 0.5rem;
          text-align: center;
          color: #1B2559;
        }
        .pv2-section-desc {
          font-size: 1rem;
          color: #64748B;
          text-align: center;
          max-width: 560px;
          margin: 0 auto 2.5rem;
        }
        .pv2-volume {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1rem;
          margin-bottom: 5rem;
        }
        @media (max-width: 700px) {
          .pv2-volume { grid-template-columns: repeat(2, 1fr); }
        }
        .pv2-vol-card {
          background: #EEF3F8;
          border: 1px solid #D1E4F0;
          border-radius: 10px;
          padding: 1.5rem 1.25rem;
          text-align: center;
        }
        .pv2-vol-range {
          font-size: 1.05rem;
          font-weight: 800;
          margin-bottom: 0.375rem;
          color: #1B2559;
        }
        .pv2-vol-label {
          font-size: 0.9rem;
          color: #64748B;
        }
        .pv2-enterprise { border-color: #F0A500; }
        .pv2-enterprise .pv2-vol-label { color: #F0A500; font-weight: 600; }

        /* CTA */
        .pv2-cta-section {
          background: linear-gradient(135deg, #1C3461 0%, #13274D 100%);
          border: 1px solid #253452;
          border-radius: 16px;
          padding: 4rem 2rem;
          text-align: center;
        }
        .pv2-cta-section h2 {
          font-size: 2rem;
          font-weight: 800;
          letter-spacing: -0.03em;
          margin-bottom: 0.75rem;
          color: #E8EEFF;
        }
        .pv2-cta-section p {
          font-size: 1rem;
          color: #8A9BB8;
          margin-bottom: 2rem;
        }
        .pv2-cta-btn {
          width: auto;
          display: inline-block;
          padding: 1rem 3rem;
          font-size: 1.1rem;
        }
      `}</style>
    </>
  );
}

export async function getStaticProps() {
  return { props: {} };
}
