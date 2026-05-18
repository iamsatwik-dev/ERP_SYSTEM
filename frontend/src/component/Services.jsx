import React from "react";

const Services = () => {
  // Common icon style
  const iconStyle = {
    width: 48,
    height: 48,
    marginBottom: 12,
  };

  return (
    <div style={{ padding: "40px 24px", maxWidth: "1200px", margin: "0 auto" }}>
      {/* EMBEDDED CSS 
        We use a style tag here to handle keyframes and nth-child selectors 
        which are not possible with standard inline React styles.
      */}
      <style>
        {`
          .services-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 24px;
            margin-top: 24px;
          }

          .service-card {
            background: #ffffff;
            padding: 24px;
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
            transition: transform 0.3s ease, box-shadow 0.3s ease;
            text-align: center;
            border: 1px solid #f0f0f0;
            
            /* Initial Animation State */
            opacity: 0;
            animation: fadeInUp 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
          }

          .service-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
          }

          .service-card h4 {
            margin: 10px 0;
            font-size: 1.1rem;
            color: #333;
          }

          .service-card p {
            color: #666;
            font-size: 0.9rem;
            line-height: 1.5;
          }

          /* Keyframes for the Slide Up Effect */
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(40px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          /* Staggered Delays for "Top to Bottom" flow */
          .service-card:nth-child(1) { animation-delay: 0.1s; }
          .service-card:nth-child(2) { animation-delay: 0.2s; }
          .service-card:nth-child(3) { animation-delay: 0.3s; }
          .service-card:nth-child(4) { animation-delay: 0.4s; }
          .service-card:nth-child(5) { animation-delay: 0.5s; }
          .service-card:nth-child(6) { animation-delay: 0.6s; }
          .service-card:nth-child(7) { animation-delay: 0.7s; }
          .service-card:nth-child(8) { animation-delay: 0.8s; }
          .service-card:nth-child(9) { animation-delay: 0.9s; }
        `}
      </style>

      {/* COMPONENT CONTENT */}
      <div style={{ textAlign: "center", marginBottom: 40 }}>
        <h2>Our Services</h2>
        <p style={{ color: "#666" }}>
          We provide a range of IT services to help your business build, grow and scale.
        </p>
      </div>

      <div className="services-grid">
        
        {/* 1. Custom Software Development */}
        <div className="service-card">
          <svg style={iconStyle} viewBox="0 0 48 48">
            <defs>
              <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ff7a18" />
                <stop offset="100%" stopColor="#af002d" />
              </linearGradient>
            </defs>
            <rect x="6" y="6" width="36" height="14" rx="3" fill="url(#grad1)" />
            <rect x="6" y="26" width="36" height="14" rx="3" fill="url(#grad1)" opacity="0.8" />
          </svg>
          <h4>Custom Software Development</h4>
          <p>End-to-end development for web and mobile platforms.</p>
        </div>

        {/* 2. Cloud & DevOps */}
        <div className="service-card">
          <svg style={iconStyle} viewBox="0 0 48 48">
            <defs>
              <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#00c6ff" />
                <stop offset="100%" stopColor="#0072ff" />
              </linearGradient>
            </defs>
            <circle cx="24" cy="24" r="16" fill="url(#grad2)" />
            <path d="M24 8v32M8 24h32" stroke="#fff" strokeWidth="3" />
          </svg>
          <h4>Cloud & DevOps</h4>
          <p>Cloud architecture, automation and platform engineering.</p>
        </div>

        {/* 3. Web Development */}
        <div className="service-card">
          <svg style={iconStyle} viewBox="0 0 48 48">
            <defs>
              <linearGradient id="grad3" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#8e2de2" />
                <stop offset="100%" stopColor="#4a00e0" />
              </linearGradient>
            </defs>
            <rect x="6" y="10" width="36" height="26" rx="4" fill="url(#grad3)" />
            <rect x="6" y="18" width="36" height="2" fill="#fff" opacity="0.8" />
          </svg>
          <h4>Web Development</h4>
          <p>Responsive and high-performance websites and PWAs.</p>
        </div>

        {/* 4. Mobile App Development */}
        <div className="service-card">
          <svg style={iconStyle} viewBox="0 0 48 48">
            <defs>
              <linearGradient id="grad4" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ff6a00" />
                <stop offset="100%" stopColor="#ee0979" />
              </linearGradient>
            </defs>
            <rect x="14" y="4" width="20" height="40" rx="6" fill="url(#grad4)" />
            <circle cx="24" cy="36" r="2" fill="#fff" />
          </svg>
          <h4>Mobile App Development</h4>
          <p>Native & cross-platform apps for Android and iOS.</p>
        </div>

        {/* 5. UI/UX Design */}
        <div className="service-card">
          <svg style={iconStyle} viewBox="0 0 48 48">
            <defs>
              <linearGradient id="grad5" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#00f260" />
                <stop offset="100%" stopColor="#0575e6" />
              </linearGradient>
            </defs>
            <circle cx="24" cy="16" r="10" fill="url(#grad5)" />
            <rect x="10" y="28" width="28" height="10" rx="5" fill="url(#grad5)" opacity="0.8" />
          </svg>
          <h4>UI/UX Design</h4>
          <p>Modern, user-centered designs and prototypes.</p>
        </div>

        {/* 6. E-commerce Development */}
        <div className="service-card">
          <svg style={iconStyle} viewBox="0 0 48 48">
            <defs>
              <linearGradient id="grad6" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f7971e" />
                <stop offset="100%" stopColor="#ffd200" />
              </linearGradient>
            </defs>
            <rect x="8" y="12" width="32" height="12" rx="4" fill="url(#grad6)" />
            <rect x="8" y="26" width="32" height="12" rx="4" fill="url(#grad6)" opacity="0.7" />
          </svg>
          <h4>E-commerce Development</h4>
          <p>Full-stack online store development & payment integration.</p>
        </div>

        {/* 7. AI & Machine Learning */}
        <div className="service-card">
          <svg style={iconStyle} viewBox="0 0 48 48">
            <defs>
              <linearGradient id="grad7" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#43cea2" />
                <stop offset="100%" stopColor="#185a9d" />
              </linearGradient>
            </defs>
            <circle cx="24" cy="24" r="16" fill="url(#grad7)" />
            <circle cx="24" cy="24" r="6" fill="#fff" />
          </svg>
          <h4>AI & Machine Learning</h4>
          <p>AI automation, chatbots, predictive analytics & NLP.</p>
        </div>

        {/* 8. Cyber Security */}
        <div className="service-card">
          <svg style={iconStyle} viewBox="0 0 48 48">
            <defs>
              <linearGradient id="grad8" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ff512f" />
                <stop offset="100%" stopColor="#dd2476" />
              </linearGradient>
            </defs>
            <path
              d="M24 4l14 6v10c0 10-6 18-14 22C16 38 10 30 10 20V10z"
              fill="url(#grad8)"
            />
          </svg>
          <h4>Cyber Security</h4>
          <p>Vulnerability assessment, penetration testing & monitoring.</p>
        </div>

        {/* 9. SEO & Digital Marketing */}
        <div className="service-card">
          <svg style={iconStyle} viewBox="0 0 48 48">
            <defs>
              <linearGradient id="grad9" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fc466b" />
                <stop offset="100%" stopColor="#3f5efb" />
              </linearGradient>
            </defs>
            <rect x="8" y="8" width="32" height="32" rx="8" fill="url(#grad9)" />
            <circle cx="24" cy="24" r="6" fill="#fff" />
          </svg>
          <h4>SEO & Digital Marketing</h4>
          <p>Boost visibility, rankings and ROI-driven marketing.</p>
        </div>

      </div>
    </div>
  );
};

export default Services;
