import { useRouter } from '../../router';
import type { Route } from '../../router';
import logoImg from '../../assets/imgs/gents-logo.png';
import { useLang } from '../../context/LanguageContext';

export function Footer() {
  const { navigate } = useRouter();
  const { t } = useLang();

  const go = (r: Route) => () => navigate(r);

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-top">
          <div className="footer-brand">
            <div className="nav-mark" onClick={go('home')}>
              <img src={logoImg} alt="Gents Facial Club" className="footer-logo-img" />
            </div>
            <p>{t.footer.tagline}</p>
          </div>
          <div className="footer-col">
            <h4>{t.footer.explore}</h4>
            <ul>
              <li><a onClick={go('home')}>{t.footer.home}</a></li>
              <li><a onClick={go('for-adults')}>{t.footer.forAdults}</a></li>
              <li><a onClick={go('for-students')}>{t.footer.forStudents}</a></li>
              <li><a onClick={go('about')}>{t.footer.about}</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>{t.footer.visit}</h4>
            <ul>
              <li><a>{t.footer.address1}</a></li>
              <li><a>{t.footer.address2}</a></li>
              <li><a>{t.footer.sunFri}</a></li>
              <li><a>{t.footer.sat}</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>{t.footer.correspond}</h4>
            <ul>
              <li><a href="mailto:customer.service@everlastwellness.com">customer.service@everlastwellness.com</a></li>
              <li><a href="tel:+971600551615">+971 600 551 615</a></li>
              <li><a onClick={go('contact')}>{t.footer.contact}</a></li>
              <li><a href="https://everlastwellness.store/product/aljameela-club/" target="_blank" rel="noopener noreferrer">{t.footer.joinClub}</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <div>© {new Date().getFullYear()} Aljameela Facial Club · {t.footer.rights} · Al Bateen, Abu Dhabi</div>
          <div className="socials">
            <a href="https://www.snapchat.com/@everlastwmc" target="_blank" rel="noopener noreferrer">Snapchat</a>
            <a href="https://www.tiktok.com/@everlastwellness" target="_blank" rel="noopener noreferrer">TikTok</a>
            <a href="https://www.instagram.com/everlastwellness/" target="_blank" rel="noopener noreferrer">Instagram</a>
            <a href="https://www.youtube.com/channel/UC8BxCEjG34knpcKLoFLNUgg" target="_blank" rel="noopener noreferrer">YouTube</a>
            <a href="https://www.linkedin.com/company/everlastwellnessmc/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
