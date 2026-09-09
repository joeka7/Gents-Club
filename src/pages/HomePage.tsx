import { useRouter } from '../router';
import { useProductPrice } from '../hooks/useProductPrice';
import { useLang } from '../context/LanguageContext';
import { Marquee } from '../components/ui/Marquee';
import { SmokeBackground } from '../components/ui/SmokeBackground';
import mainModelImg from '../assets/imgs/hero-model.webp';
import sec1Img from '../assets/imgs/sec-1.webp';
import firstSectionImg from '../assets/imgs/Flawless Skin.webp';
import membershipImg from '../assets/imgs/Deep Hydration.webp';
import joinImg from '../assets/imgs/Club Membership.webp';
import forAdultsImg from '../assets/imgs/For Adults.webp';
import studentsIconImg from '../assets/imgs/students-icon.png';
import leadesIconImg from '../assets/imgs/leades-icon.png';
import giftImg from '../assets/imgs/gift.png';
import anniversaryImg from '../assets/imgs/anniversary.png';
import appDeviceImg from '../assets/imgs/responsive_device-i-phone14.webp';
import appStoreImg from '../assets/imgs/Download_on_the_App_Store_Badge_US-UK_RGB_wht_092917-1.png';
import googlePlayImg from '../assets/imgs/google-play-badge.png';
import crownImg from '../assets/imgs/For Students.webp';
import randomImg from '../assets/imgs/Glowing Complexion.webp';

export function HomePage() {
  const { navigate } = useRouter();
  const { adults: adultsPrice, students: studentsPrice } = useProductPrice();
  const { t } = useLang();

  return (
    <div className="page" id="home-page">
      {/* HERO */}
      <section id="hero" className="hero">
        <div className="hero-media">
          <SmokeBackground smokeColor="#4a6d90" />
        </div>
        <div className="hero-inner">
          <div className="container hero-columns">
            <div className="hero-headline">
              <div className="hero-eyebrow">
                <span className="hero-eyebrow-line"></span>
                <span className="hero-eyebrow-text">{t.home.heroEyebrow(new Date().getFullYear())}</span>
              </div>
              <h1>
                {t.home.heroTitleL1}<br /><em>{t.home.heroTitleEm}</em>
              </h1>
            </div>
            <div className="hero-model">
              <img src={mainModelImg} alt="Aljameela Club Member" />
            </div>
          </div>
          <div className="hero-meta">
            <div className="container hero-meta-inner">
              <div className="hero-meta-item">
                <div className="label">{t.home.speciality}</div>
                <div className="value">{t.home.facialTherapy}</div>
              </div>
              <div className="hero-meta-item">
                <div className="label">{t.home.location}</div>
                <div className="value">{t.home.alBateen}</div>
              </div>
              <div className="hero-meta-item">
                <div className="label">{t.home.membership}</div>
                <div className="value">{t.home.yearPlan}</div>
              </div>
              <div className="hero-meta-btns">
                <a className="btn btn-gold" onClick={() => navigate('about')}>
                  {t.home.aboutBtn} <span className="arrow"></span>
                </a>
                <a className="btn btn-outline-ivory" onClick={() => navigate('contact')}>
                  {t.home.contactBtn} <span className="arrow"></span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Marquee items={t.home.marquee} />

      {/* WELCOME SPLIT */}
      <section id="welcome" className="section">
        <div className="container">
          <div className="split">
            <div className="split-image">
              <img src={sec1Img} alt="Al Jameela Club" />
              <div className="stamp">{t.home.stamp(new Date().getFullYear())}</div>
            </div>
            <div className="split-text">
              <div className="eyebrow"><span className="dot"></span>{t.home.welcomeEyebrow}</div>
              <h2 className="display">{t.home.welcomeL1}<br /><em>{t.home.welcomeL2}</em>.</h2>
              <p>{t.home.welcomeP1}</p>
              <p>{t.home.welcomeP2}</p>
              <div className="split-actions">
                <a className="btn btn-solid" onClick={() => navigate('for-adults')}>
                  {t.home.forAdultsBtn} <span className="arrow"></span>
                </a>
                <a className="btn" onClick={() => navigate('for-students')}>
                  {t.home.forStudentsBtn} <span className="arrow"></span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3 SKIN GOALS */}
      <section id="skin-goals" className="section section-parchment">
        <div className="container">
          <div className="section-head">
            <div className="meta">
              <div className="num">{t.home.goalsNum}</div>
              <h2 className="display title">{t.home.goalsTitleL1}<em>{t.home.goalsTitleEm}</em>{t.home.goalsTitleL2}</h2>
            </div>
            <div>
              <p className="lede">{t.home.goalsLede}</p>
            </div>
          </div>
          <div className="services-grid">
            {[
              { ...t.home.goals[0], img: randomImg },
              { ...t.home.goals[1], img: firstSectionImg },
              { ...t.home.goals[2], img: membershipImg },
            ].map((s, i) => (
              <div key={i} className="service">
                <div className="service-img">
                  <div className="num">№ {String(i + 1).padStart(2, '0')}</div>
                  <img src={s.img} alt={s.title} />
                </div>
                <div className="service-meta">
                  <div className="service-name">{s.title}</div>
                </div>
                <p className="service-desc">{s.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MEMBERSHIP OVERVIEW */}
      <section id="membership-overview" className="section section-ivory">
        <div className="container">
          <div className="split reverse">
            <div className="split-text">
              <div className="eyebrow"><span className="dot"></span>{t.home.membershipEyebrow}</div>
              <h2 className="display">{t.home.membershipL1}<em>{t.home.membershipEm}</em>.</h2>
              <p>{t.home.membershipP}</p>
              <ul className="benefit-list">
                {t.home.benefits.map((item, i) => (
                  <li key={i} className="benefit-item">
                    <img src={giftImg} alt="" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="split-image">
              <img src={joinImg} alt="Join Aljameela Club" />
              <div className="stamp">
                <img src={anniversaryImg} alt="1 Year" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOR ADULTS / FOR STUDENTS CARDS */}
      <section id="memberships" className="section section-dark">
        <div className="container">
          <div className="section-cta-center">
            <div className="eyebrow"><span className="dot"></span>{t.home.tiersEyebrow}</div>
            <h2 className="display">
              {t.home.tiersTitleL1}<em>{t.home.tiersTitleEm}</em>{t.home.tiersTitleQ}
            </h2>
          </div>
          <div className="tier-cards">
            <div className="tier-card" id="tier-adults">
              <div className="tier-card-img">
                <img src={forAdultsImg} alt="For Adults" />
              </div>
              <div className="tier-card-body">
                <div className="tier-card-header">
                  <img src={leadesIconImg} alt="" />
                  <div>
                    <div className="tier-card-age">{t.home.adultsAge}</div>
                    <div className="tier-card-name">{t.home.adultsName}</div>
                  </div>
                </div>
                <p className="tier-card-desc">{t.home.adultsDesc}</p>
                <div className="tier-card-price">
                  <div className="tier-card-price-num">{adultsPrice ?? <span className="price-shimmer" />}</div>
                  <div className="tier-card-price-unit">{t.home.aedYear}</div>
                </div>
                <a className="btn btn-solid" onClick={() => navigate('for-adults')}>
                  {t.home.learnMore} <span className="arrow"></span>
                </a>
              </div>
            </div>

            <div className="tier-card" id="tier-students">
              <div className="tier-card-img">
                <img src={crownImg} alt="For Students" />
              </div>
              <div className="tier-card-body">
                <div className="tier-card-header">
                  <img src={studentsIconImg} alt="" />
                  <div>
                    <div className="tier-card-age">{t.home.studentsAge}</div>
                    <div className="tier-card-name">{t.home.studentsName}</div>
                  </div>
                </div>
                <p className="tier-card-desc">{t.home.studentsDesc}</p>
                <div className="tier-card-price">
                  <div className="tier-card-price-num">{studentsPrice ?? <span className="price-shimmer" />}</div>
                  <div className="tier-card-price-unit">{t.home.aedYear}</div>
                </div>
                <a className="btn btn-solid" onClick={() => navigate('for-students')}>
                  {t.home.learnMore} <span className="arrow"></span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section id="testimonials" className="section">
        <div className="container">
          <div className="section-head">
            <div className="meta">
              <div className="num">{t.home.testimonialsNum}</div>
              <h2 className="display title">{t.home.testimonialsL1}<em>{t.home.testimonialsEm}</em><br />{t.home.testimonialsL2}</h2>
            </div>
            <div>
              <p className="lede">{t.home.testimonialsLede}</p>
            </div>
          </div>
          <div className="journal-grid">
            {t.home.testimonials.map((item, i) => (
              <div key={i} className="testimonial-card">
                <div className="testimonial-quote">"</div>
                <p className="testimonial-text">{item.text}</p>
                <div className="testimonial-name">— {item.name} · {item.role}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PULL QUOTE */}
      <section id="mission" className="section section-parchment">
        <div className="container">
          <div className="pull">
            <div className="mark">"</div>
            <blockquote>{t.home.pullQuote}</blockquote>
            <cite>{t.home.pullCite}</cite>
          </div>
        </div>
      </section>

      {/* APP DOWNLOAD */}
      <section id="app" className="section section-dark">
        <div className="container">
          <div className="split">
            <div className="split-text">
              <div className="eyebrow"><span className="dot"></span>{t.home.appEyebrow}</div>
              <h2 className="display">
                {t.home.appL1}<br />{t.home.appL2}<em>{t.home.appEm}</em>.
              </h2>
              <p>{t.home.appP}</p>
              <div className="app-badges">
                <a href="https://apps.apple.com/eg/app/everlast-wellness/id6737142880" target="_blank" rel="noopener noreferrer">
                  <img src={appStoreImg} alt="Download on the App Store" />
                </a>
                <a href="https://play.google.com/store/apps/details?id=com.everlast.wellness&hl=en&pli=1" target="_blank" rel="noopener noreferrer">
                  <img src={googlePlayImg} alt="Get it on Google Play" />
                </a>
              </div>
            </div>
            <div className="app-device">
              <img src={appDeviceImg} alt="Aljameela App" />
            </div>
          </div>
        </div>
      </section>

      {/* CTA STRIP */}
      <section id="cta" className="section section-oxblood">
        <div className="container">
          <div className="eyebrow">{t.home.ctaEyebrow}</div>
          <h2 className="display">
            {t.home.ctaL1}<em>{t.home.ctaEm}</em>.
          </h2>
          <p className="cta-body">{t.home.ctaBody}</p>
          <div className="pricing-actions">
            <a className="btn btn-gold" href="https://everlastwellness.store/product/aljameela-club/" target="_blank" rel="noopener noreferrer">
              {t.home.ctaAdults(adultsPrice)} <span className="arrow"></span>
            </a>
            <a className="btn btn-outline-ivory" href="https://everlastwellness.store/product/aljameela-club/" target="_blank" rel="noopener noreferrer">
              {t.home.ctaStudents(studentsPrice)} <span className="arrow"></span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}