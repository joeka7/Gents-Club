import { useRouter } from '../router';
import { useProductPrice } from '../hooks/useProductPrice';
import { useLang } from '../context/LanguageContext';
import forAdultsImg from '../assets/imgs/for-adults.webp';
import secOneImg from '../assets/imgs/sec-one-for-adults.webp';
import crownImg from '../assets/imgs/crown.png';
import adultsIconImg from '../assets/imgs/adults-icon.png';
import giftImg from '../assets/imgs/gift.png';
import anniversaryImg from '../assets/imgs/anniversary.png';
import treatment1Img from '../assets/imgs/RevitaPearl HydraDermabrassion.webp';
import treatment2Img from '../assets/imgs/Revive 365 Deep Cleaning.webp';
import treatment3Img from '../assets/imgs/InnovaLux Peeling Therapy.webp';

const SERVICE_IMGS = [treatment1Img, treatment2Img, treatment3Img];

export function ForAdultsPage() {
  const { navigate } = useRouter();
  const { adults: adultsPrice } = useProductPrice();
  const { t } = useLang();

  return (
    <div className="page" id="adults-page">
      {/* HERO */}
      <section id="adults-hero" className="page-hero">
        <div className="page-hero-media">
          <img src={forAdultsImg} alt="For Adults" />
          <div className="page-hero-overlay" />
        </div>
        <div className="page-hero-body">
          <div className="page-hero-eyebrow">
            <img src={adultsIconImg} alt="" className="page-hero-icon" />
            <span className="page-hero-tag">{t.adults.heroTag}</span>
          </div>
          <h1 className="display page-hero-title">
            {t.adults.heroL1}<br /><em className="gold-em">{t.adults.heroEm}</em>
          </h1>
          <div className="page-hero-actions">
            <a className="btn btn-gold" href="https://everlastwellness.store/product/gents-facial-club/" target="_blank" rel="noopener noreferrer">
              {t.adults.joinBtn(adultsPrice)} <span className="arrow"></span>
            </a>
            <a className="btn btn-outline-ivory" onClick={() => navigate('contact')}>
              {t.adults.contactBtn} <span className="arrow"></span>
            </a>
          </div>
        </div>
      </section>

      {/* INTRO SPLIT */}
      <section id="adults-intro" className="section">
        <div className="container">
          <div className="split">
            <div className="split-text">
              <div className="eyebrow"><span className="dot"></span>{t.adults.introEyebrow}</div>
              <h2 className="display">{t.adults.introL1}<em>{t.adults.introEm}</em>{t.adults.introL2}</h2>
              <p>{t.adults.introP1}</p>
              <p>{t.adults.introP2}</p>
              <div className="membership-icons">
                <div className="membership-icon-item">
                  <img src={anniversaryImg} alt="1 Year" />
                  <div className="membership-icon-label">{t.adults.yearPlan}</div>
                </div>
                <div className="membership-icon-item">
                  <img src={giftImg} alt="Gift" />
                  <div className="membership-icon-label">{t.adults.giftSessions}</div>
                </div>
                <div className="membership-icon-item">
                  <img src={crownImg} alt="Premium" className="membership-icon-rounded" />
                  <div className="membership-icon-label">{t.adults.premiumCare}</div>
                </div>
              </div>
            </div>
            <div className="split-image">
              <img src={secOneImg} alt="Adult member" />
              <div className="stamp">{adultsPrice ?? <span className="price-shimmer" />} {t.adults.stampUnit}</div>
            </div>
          </div>
        </div>
      </section>

      {/* MAIN SERVICES */}
      <section id="adults-services" className="section section-parchment">
        <div className="container">
          <div className="section-head">
            <div className="meta">
              <div className="num">{t.adults.servicesNum}</div>
              <h2 className="display title">{t.adults.servicesL1}<em>{t.adults.servicesEm}</em><br />{t.adults.servicesL2}</h2>
            </div>
            <div>
              <p className="lede">{t.adults.servicesLede}</p>
            </div>
          </div>

          <div className="services-grid">
            {t.adults.services.map((s, i) => (
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
      <section id="adults-addons" className="section">
        <div className="container">
          <div className="section-head">
            <div className="meta">
              <div className="num">{t.adults.addonsNum}</div>
              <h2 className="display title">{t.adults.addonsL1}<em>{t.adults.addonsEm}</em><br />{t.adults.addonsL2}</h2>
            </div>
            <div>
              <p className="lede">{t.adults.addonsLede}</p>
            </div>
          </div>

          <div id="adults-addons-list">
            {t.adults.addons.map((s, i) => (
              <div key={i} className="service-row service-row-static">
                <div className="num">
                  <img src={giftImg} alt="" className="addon-icon" />
                </div>
                <div className="name addon-name">{s.name}</div>
                <div className="desc"></div>
                <div className="price-block">
                  <div className="addon-sessions">{s.sessions}</div>
                  <div className="duration">{t.adults.complimentary}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICE CTA */}
      <section id="adults-pricing" className="section section-dark section-pricing">
        <div className="container pricing-inner">
          <div className="eyebrow pricing-eyebrow">
            <span className="dot"></span>{t.adults.pricingEyebrow}
          </div>
          <div className="pricing-amount">{adultsPrice ?? <span className="price-shimmer" />}</div>
          <div className="pricing-unit">{t.adults.pricingUnit}</div>
          <p className="pricing-desc">{t.adults.pricingDesc}</p>
          <div className="pricing-actions">
            <a className="btn btn-gold" href="https://everlastwellness.store/product/gents-facial-club/" target="_blank" rel="noopener noreferrer">
              {t.adults.buyNow} <span className="arrow"></span>
            </a>
            <a className="btn btn-outline-ivory" onClick={() => navigate('contact')}>
              {t.adults.moreInfo} <span className="arrow"></span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
