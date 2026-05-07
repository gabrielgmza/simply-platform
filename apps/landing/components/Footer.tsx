import Link from 'next/link';
import Logo from './Logo';
import { common, hero, footerCols, ADDRESS, EMAIL, COMPANY } from '@/lib/content';

export default function Footer() {
  return (
    <footer>
      <div className="footer-grid">
        <div>
          <Logo asLink={false} />
          <p>{hero.text}</p>
          <p className="micro">{common.legal}</p>
        </div>
        {footerCols.map(([title, items]) => (
          <div key={title}>
            <h4>{title}</h4>
            {items.map(([href, label]) => (
              <Link key={href} href={href}>{label}</Link>
            ))}
          </div>
        ))}
      </div>
      <div className="subfooter">
        <span>© 2026 Simply / {COMPANY}. {common.rights}</span>
        <span>{ADDRESS}</span>
        <span>{EMAIL}</span>
      </div>
    </footer>
  );
}
