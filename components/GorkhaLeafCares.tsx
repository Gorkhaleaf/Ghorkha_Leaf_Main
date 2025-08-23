import React from 'react';
import './GorkhaLeafCares.css';

type Props = {
  imageSrc: string;
  imageAlt?: string;
};

const GorkhaLeafCares: React.FC<Props> = ({ imageSrc, imageAlt = 'Tea plucker in Darjeeling hills' }) => {
  return (
    <section className="glc-section compact" aria-labelledby="glc-title">
      <div className="glc-inner">
        <div className="glc-left">
          <figure className="glc-figure glc-figure--lift" aria-hidden="true">
            <img className="glc-image" src={imageSrc} alt={imageAlt} />
          </figure>

          <div className="glc-figure-caption glc-figure-caption--below" aria-hidden="false">
            <p>At Gorkha Leaf, we believe that great tea begins with great people. As a brand born from the soil and stories of Darjeeling, we are committed to giving back.</p>
            <p>We're not just building a brand — we're nurturing a community, culture, and cause.</p>
            <p>We are in our early days, but our vision is clear:</p>
            <p>Within the next 12 months, we aim to launch <strong>🍃 Gorkha Leaf Impact Circle</strong>, a purpose-driven initiative that brings social good back to the community that nurtures our leaves.</p>
          </div>
        </div>

        <div className="glc-content">
          <p className="glc-kicker">We care for</p>
          <h2 id="glc-title" className="glc-heading">
            <span className="glc-brand">Gorkha Leaf Cares:</span> <span className="glc-subtle">Small Steps, Big Vision</span>
          </h2>

          <div className="glc-intro-compact">
            <p className="glc-vision-line">Our immediate focus is community-led programs that create measurable impact — education, meals, and seasonal gifting.</p>
          </div>

          <h3 className="glc-what-title">What We’re Building Toward</h3>

          <ul className="glc-list" role="list">
            <li className="glc-item">
              <span className="glc-icon" aria-hidden="true">📚</span>
              <div className="glc-item-body">
                <div className="glc-item-title">Educate to Elevate</div>
                <p className="glc-item-text">Support the education of tea estate workers’ children through scholarships and school support programs.</p>
              </div>
            </li>

            <li className="glc-item">
              <span className="glc-icon" aria-hidden="true">🍛</span>
              <div className="glc-item-body">
                <div className="glc-item-title">Unity Through Community Meals</div>
                <p className="glc-item-text">Host festive community lunches that celebrate togetherness, gratitude, and Gorkha hospitality.</p>
              </div>
            </li>

            <li className="glc-item">
              <span className="glc-icon" aria-hidden="true">🎁</span>
              <div className="glc-item-body">
                <div className="glc-item-title">Seasonal Gifting Drives</div>
                <p className="glc-item-text">Organize gifting campaigns during festivals — small gestures, big smiles.</p>
              </div>
            </li>
          </ul>

          <div className="glc-badges" aria-label="Initiatives and logos">
            <div className="glc-badge glc-badge-icon" role="img" aria-label="Impact Circle logo">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C7.58 2 4 5.58 4 10c0 5 6 11 8 12 2-1 8-7 8-12 0-4.42-3.58-8-8-8z" fill="#0F7B55"/>
                <path d="M9 11c1-2 3-3 3-3s-1 2-3 3z" fill="#ffffff" opacity="0.12"/>
              </svg>
              <span>Impact Circle</span>
            </div>

            <div className="glc-badge glc-badge-icon" role="img" aria-label="Community First logo">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="8" r="3.2" fill="#7A5C2E"/>
                <path d="M4 20c1.8-3 5-5 8-5s6.2 2 8 5H4z" fill="#0F7B55" opacity="0.95"/>
                <path d="M8.5 11.5c0 .83-.67 1.5-1.5 1.5S5.5 12.33 5.5 11.5 6.17 10 7 10s1.5.67 1.5 1.5z" fill="#fff" opacity="0.06"/>
              </svg>
              <span>Community First</span>
            </div>

            <div className="glc-badge glc-badge-icon" role="img" aria-label="Darjeeling Roots logo">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg">
                <path d="M2 20c3-6 9-9 10-9s7 3 10 9H2z" fill="#7A5C2E"/>
                <path d="M7 13c1-2 3-3 5-3s4 1 5 3" stroke="#fff" strokeWidth="0.5" opacity="0.18"/>
              </svg>
              <span>Darjeeling Roots</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GorkhaLeafCares;