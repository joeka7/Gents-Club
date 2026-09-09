import { useRouter } from '../router';
import { useProductPrice } from '../hooks/useProductPrice';
import { useLang } from '../context/LanguageContext';
import ewmcImg from '../assets/imgs/about-us.webp';
import heroImg from '../assets/imgs/hero.webp';
import membershipImg from '../assets/imgs/membership.webp';

export function AboutPage() {
  const { navigate } = useRouter();
  const { adults: adultsPrice, students: studentsPrice } = useProductPrice();
  const { t } = useLang();

  return (
    <div className="page" id="about-page">
      {/* HERO */}
      <section id="about-hero" className="page-hero">
        <div className="page-hero-media">
          <img src={heroImg} alt="Aljameela Club" className="hero-img-offset" />
          <div className="page-hero-overlay" />
        </div>
        <div className="page-hero-body">
          <div className="eyebrow page-hero-eyebrow-text">
            <span className="dot"></span>{t.about.eyebrow}
          </div>
          <h1 className="display page-hero-title">
            {t.about.heroL1}<br /><em className="gold-em">{t.about.heroEm}</em>.
          </h1>
        </div>
      </section>

      {/* INTRO */}
      <section id="about-story" className="section">
        <div className="container">
          <div className="split">
            <div className="split-text">
              <div className="eyebrow"><span className="dot"></span>{t.about.storyEyebrow}</div>
              <h2 className="display">{t.about.storyL1}<br /><em>{t.about.storyEm}</em>{t.about.storyL2}</h2>
              <p>{t.about.storyP1}</p>
              <p>{t.about.storyP2}</p>
              <p>{t.about.storyP3}</p>
            </div>
            <div className="split-image">
              <img src={ewmcImg} alt="Aljameela Club — Al Bateen, Abu Dhabi" />
              <div className="stamp">{t.about.stamp}</div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section id="about-stats" className="section section-dark">
        <div className="container">
          <div className="stats-grid">
            {t.about.stats.map((s, i) => (
              <div key={i} className="stat-item">
                <div className="stat-value">{s.value}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* VALUES */}
      <section id="about-values" className="section section-parchment">
        <div className="container">
          <div className="section-head">
            <div className="meta">
              <div className="num">{t.about.valuesNum}</div>
              <h2 className="display title">{t.about.valuesL1}<em>{t.about.valuesEm}</em><br />{t.about.valuesL2}</h2>
            </div>
            <div>
              <p className="lede">{t.about.valuesLede}</p>
            </div>
          </div>

          <div className="values-grid">
            {t.about.values.map((v, i) => (
              <div key={i} className="value-item">
                <div className="value-num">{v.num}</div>
                <h3 className="value-title">{v.title}</h3>
                <p className="value-body">{v.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MEMBERSHIP SPLIT */}
      <section id="about-memberships" className="section">
        <div className="container">
          <div className="split">
            <div className="split-image split-image-portrait">
              <img src={membershipImg} alt="Membership" />
            </div>
            <div className="split-text">
              <div className="eyebrow"><span className="dot"></span>{t.about.membershipsEyebrow}</div>
              <h2 className="display">{t.about.membershipsL1}<em>{t.about.membershipsEm}</em><br />{t.about.membershipsL2}</h2>
              <p>{t.about.membershipsP1}</p>
              <p>{t.about.membershipsP2}</p>
              <div className="about-membership-actions">
                <a className="btn btn-gold" href="https://everlastwellness.store/product/aljameela-club/" target="_blank" rel="noopener noreferrer">
                  {t.about.forAdultsBtn(adultsPrice)} <span className="arrow"></span>
                </a>
                <a className="btn" href="https://everlastwellness.store/product/aljameela-club/" target="_blank" rel="noopener noreferrer">
                  {t.about.forStudentsBtn(studentsPrice)} <span className="arrow"></span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="about-cta" className="section section-dark section-cta-centered">
        <div className="container">
          <div className="eyebrow cta-eyebrow"><span className="dot"></span>{t.about.ctaEyebrow}</div>
          <h2 className="display cta-title">
            {t.about.ctaL1}<br /><em className="gold-em">{t.about.ctaEm}</em>?
          </h2>
          <p className="cta-desc">{t.about.ctaDesc}</p>
          <div className="cta-actions">
            <a className="btn btn-gold" onClick={() => navigate('contact')}>{t.about.contactBtn} <span className="arrow"></span></a>
            <a className="btn btn-outline-ivory" onClick={() => navigate('for-adults')}>{t.about.membershipsBtn} <span className="arrow"></span></a>
          </div>
        </div>
      </section>
    </div>
  );
}
