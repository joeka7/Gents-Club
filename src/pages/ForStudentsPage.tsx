import { useRouter } from '../router';
import { useProductPrice } from '../hooks/useProductPrice';
import { useLang } from '../context/LanguageContext';
import studentsIconImg from '../assets/imgs/students-icon.png';
import giftImg from '../assets/imgs/gift.png';
import anniversaryImg from '../assets/imgs/anniversary.png';
import model2Img from '../assets/imgs/for-students.webp';
import wmRemoveImg from '../assets/imgs/for-students-banner.webp';
import treatment1Img from '../assets/imgs/BellaFace HydraDermabrassion.webp';
import treatment2Img from '../assets/imgs/Alive 365 Deep Cleaning.webp';
import erterImg from '../assets/imgs/SkinGlow Lab Peeling Therapy.webp';

const SERVICE_IMGS = [treatment1Img, treatment2Img, erterImg];

export function ForStudentsPage() {
  const { navigate } = useRouter();
  const { students: studentsPrice } = useProductPrice();
  const { t } = useLang();

  return (
    <div className="page" id="students-page">
      {/* HERO */}
      <section id="students-hero" className="page-hero">
        <div className="page-hero-media">
          <img src={wmRemoveImg} alt="For Students" />
          <div className="page-hero-overlay" />
        </div>
        <div className="page-hero-body">
          <div className="page-hero-eyebrow">
            <img src={studentsIconImg} alt="" className="page-hero-icon" />
            <span className="page-hero-tag">{t.students.heroTag}</span>
          </div>
          <h1 className="display page-hero-title">
            {t.students.heroL1}<br /><em className="gold-em">{t.students.heroEm}</em>
          </h1>
          <div className="page-hero-actions">
            <a className="btn btn-gold" href="https://everlastwellness.store/product/gents-facial-club/" target="_blank" rel="noopener noreferrer">
              {t.students.joinBtn(studentsPrice)} <span className="arrow"></span>
            </a>
            <a className="btn btn-outline-ivory" onClick={() => navigate('contact')}>
              {t.students.contactBtn} <span className="arrow"></span>
            </a>
          </div>
        </div>
      </section>

      {/* INTRO SPLIT */}
      <section id="students-intro" className="section">
        <div className="container">
          <div className="split">
            <div className="split-text">
              <div className="eyebrow"><span className="dot"></span>{t.students.introEyebrow}</div>
              <h2 className="display">{t.students.introL1}<em>{t.students.introEm}</em>{t.students.introL2}</h2>
              <p>{t.students.introP1}</p>
              <p>{t.students.introP2}</p>
              <div className="membership-icons">
                <div className="membership-icon-item">
                  <img src={anniversaryImg} alt="1 Year" />
                  <div className="membership-icon-label">{t.students.yearPlan}</div>
                </div>
                <div className="membership-icon-item">
                  <img src={giftImg} alt="Gift" />
                  <div className="membership-icon-label">{t.students.giftSessions}</div>
                </div>
                <div className="membership-icon-item">
                  <img src={studentsIconImg} alt="Students" />
                  <div className="membership-icon-label">{t.students.studentRate}</div>
                </div>
              </div>
            </div>
            <div id="students-intro-images" className="students-image-grid">
              <div className="students-image-top">
                <img src={model2Img} alt="Student member" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MAIN SERVICES */}
      <section id="students-services" className="section section-parchment">
        <div className="container">
          <div className="section-head">
            <div className="meta">
              <div className="num">{t.students.servicesNum}</div>
              <h2 className="display title">{t.students.servicesL1}<em>{t.students.servicesEm}</em><br />{t.students.servicesL2}</h2>
            </div>
            <div>
              <p className="lede">{t.students.servicesLede}</p>
            </div>
          </div>

          <div className="services-grid">
            {t.students.services.map((s, i) => (
              <div key={s.num} className="service">
                <div className="service-img">
                  <div className="num">№ {s.num}</div>
                  <img src={SERVICE_IMGS[i]} alt={s.name} />
                </div>
                <div className="service-meta">
                  <div className="service-name">{s.name}</div>
                  <div className="service-price">{'∞'}</div>
                </div>
                <p className="service-desc">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ADD-ON SERVICES */}
      <section id="students-addons" className="section">
        <div className="container">
          <div className="section-head">
            <div className="meta">
              <div className="num">{t.students.addonsNum}</div>
              <h2 className="display title">{t.students.addonsL1}<em>{t.students.addonsEm}</em><br />{t.students.addonsL2}</h2>
            </div>
            <div>
              <p className="lede">{t.students.addonsLede}</p>
            </div>
          </div>

          <div id="students-addons-list">
            {t.students.addons.map((s, i) => (
              <div key={i} className="service-row service-row-static">
                <div className="num">
                  <img src={giftImg} alt="" className="addon-icon" />
                </div>
                <div className="name addon-name">{s.name}</div>
                <div className="desc"></div>
                <div className="price-block">
                  <div className="addon-sessions">{s.sessions}</div>
                  <div className="duration">{t.students.complimentary}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section id="students-testimonials" className="section section-bone">
        <div className="container">
          <div className="eyebrow testimonials-eyebrow"><span className="dot"></span>{t.students.testimonialsEyebrow}</div>
          <h2 className="display testimonials-title">{t.students.testimonialsL1}<em>{t.students.testimonialsEm}</em>.</h2>
          <div className="journal-grid">
            {t.students.testimonials.map((item, i) => (
              <div key={i} className="testimonial-card">
                <div className="testimonial-quote">"</div>
                <p className="testimonial-text">{item.text}</p>
                <div className="testimonial-name">— {item.name}</div>
                <div className="testimonial-uni">{item.uni}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICE CTA */}
      <section id="students-pricing" className="section section-dark section-pricing">
        <div className="container pricing-inner">
          <div className="eyebrow pricing-eyebrow">
            <span className="dot"></span>{t.students.pricingEyebrow}
          </div>
          <div className="pricing-amount">{studentsPrice ?? <span className="price-shimmer" />}</div>
          <div className="pricing-unit">{t.students.pricingUnit}</div>
          <p className="pricing-desc">{t.students.pricingDesc}</p>
          <div className="pricing-actions">
            <a className="btn btn-gold" href="https://everlastwellness.store/product/gents-facial-club/" target="_blank" rel="noopener noreferrer">
              {t.students.buyNow} <span className="arrow"></span>
            </a>
            <a className="btn btn-outline-ivory" onClick={() => navigate('contact')}>
              {t.students.moreInfo} <span className="arrow"></span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
