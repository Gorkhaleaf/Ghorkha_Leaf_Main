import React from 'react';
import './bulksection.css';

const BulkSection: React.FC = () => {
  return (
    <div className="bulk-section-container">
      <div className="bulk-content">
        <div className="header-section">
          <h1 className="main-title">Bulk Orders & Corporate Gifting</h1>
        </div>

        <div className="content-body">
          <p className="intro-paragraph">
            With <span className="highlight-text">small steps, big vision</span>, Gorkha Leaf is the first Darjeeling tea brand
            to launch a comprehensive <span className="highlight-text">community impact program</span>. We are a conscious brand that
            cares for its customers, tea workers & the environment. Gorkha Leaf is committed to being a <span className="highlight-text">Climate
            Conscious and Community Neutral</span> brand, and our vision extends towards nurturing the community that nurtures our leaves
            through our flagship <span className="highlight-text">Impact Circle program</span>, <span className="brand-highlight">🍃 GORKHA LEAF CARES</span>.
          </p>

          <p className="mission-statement">
            If you are considering <span className="highlight-text">partnership opportunities</span> for social impact initiatives,
            community engagement programs, or any cause-driven collaboration, we're here to build something meaningful together.
          </p>

          <div className="initiatives-list">
            <div className="initiative-item">
              <span className="initiative-icon">📚</span>
              <strong>Educate to Elevate :</strong> Support education of tea estate workers' children through scholarships and school programs
            </div>
            <div className="initiative-item">
              <span className="initiative-icon">🍛</span>
              <strong>Unity Through Community Meals :</strong> Host festive community lunches celebrating togetherness and Gorkha hospitality
            </div>
            <div className="initiative-item">
              <span className="initiative-icon">🎁</span>
              <strong>Seasonal Gifting Drives :</strong> Organize festival gifting campaigns - small gestures, big smiles
            </div>
          </div>

          <div className="timeline-highlight">
            <strong>Coming in 12 months:</strong> Launch of "🍃 Gorkha Leaf Impact Circle" - our purpose-driven initiative
            bringing social good back to the community.
          </div>

          <div className="contact-details">
            <div className="contact-item">
              <strong>Call/WhatsApp :</strong> +91 98765-43210 / +91 87654-32109
            </div>
            <div className="contact-item">
              <strong>Email :</strong> impact@gorkhaleaf.com / partnerships@gorkhaleaf.com
            </div>
            <div className="contact-item">
              <strong>Impact Hours :</strong> 9 AM to 6 PM IST
            </div>
          </div>

          <p className="footer-contact">
            You can also reach out to us through our <a href="/contact-us" className="contact-link">Contact Us</a> page.
            Our representative will connect you to our community impact team!
          </p>
        </div>

        <div className="achievements-banner">
          <div className="achievement-item">🌱 Community First Approach</div>
          <div className="separator">•</div>
          <div className="achievement-item">📚 Education Support Programs</div>
          <div className="separator">•</div>
          <div className="achievement-item">🤝 Darjeeling Heritage Preservation</div>
          <div className="separator">•</div>
          <div className="achievement-item">🍃 Impact Circle Launching Soon</div>
        </div>
      </div>
    </div>
  );
};

export default BulkSection;