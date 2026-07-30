import { Link } from "@tanstack/react-router";
import { Facebook, Twitter, Youtube, Instagram, Mail, Phone, MapPin } from "lucide-react";
import { useTranslation } from "react-i18next";
import fallbackLogo from "@/assets/yess-bangla-logo.png";
import { useVentures } from "@/lib/dynamicContent";
import { COMPANY_CONTACT, phoneHref } from "@/lib/companyContact";
import { useMenu, useSettingText } from "@/lib/siteContent";
import { resolveMediaUrl } from "@/lib/mediaAssets";


export function Footer() {
  const ventures = useVentures();
  const { t, i18n } = useTranslation();
  const footerLinks = useMenu("footer");
  const bn = i18n.language?.startsWith("bn");
  const email = useSettingText("contact_email", COMPANY_CONTACT.email);
  const address = useSettingText("contact_address", COMPANY_CONTACT.office);
  const headerLogo = useSettingText("logo_url", "");
  const logo = resolveMediaUrl(useSettingText("footer_logo_url", "") || headerLogo, fallbackLogo);

  return (
    <footer
      data-on-dark
      className="mt-24 border-t border-glass-border-soft bg-gradient-to-b from-transparent to-secondary/30 backdrop-blur-xl dark:bg-[oklch(0.18_0.04_260)]"
    >
      <div className="container-tight py-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link to="/" className="inline-flex items-center" aria-label={t("nav.homeAria")}>
              <span className="logo-plate" role="img" aria-label="YESS Bangla">
                <img
                  src={logo}
                  srcSet={`${logo} 1x, ${logo} 2x, ${logo} 3x`}
                  alt="YESS Bangla — Enterprise Solutions, Media & Technology"
                  loading="lazy"
                  decoding="async"
                  width={279}
                  height={153}
                  data-surface="footer"
                  style={{ imageRendering: "auto" }}
                  className="logo-mark h-11 w-auto max-w-[60vw] bg-transparent object-contain [@media(min-width:380px)]:h-12 sm:h-14 lg:h-16 [@media(min-width:1440px)]:h-[72px]"
                />
              </span>
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              {t("footer.tagline")}
            </p>
            <div className="mt-5 flex gap-2">
              {[
                { Icon: Facebook, href: "https://www.facebook.com/yessbanglaltd" },
                { Icon: Twitter, href: "https://x.com/YessBangla" },
                { Icon: Youtube, href: "https://www.youtube.com/@yessbangla" },
                { Icon: Instagram, href: "https://www.linkedin.com/" },
              ].map(({ Icon, href }, i) => (
                <a
                  key={i}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="grid h-9 w-9 place-items-center rounded-full border border-border bg-card text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-display text-sm font-semibold uppercase tracking-wider">{t("footer.company")}</h4>
            <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
              {footerLinks.length > 0 ? (
                footerLinks.map((l) => (
                  <li key={l.id}>
                    {l.is_external ? (
                      <a href={l.href} target="_blank" rel="noopener noreferrer" className="hover:text-primary">
                        {(bn && l.label_bn) || l.label}
                      </a>
                    ) : (
                      <Link to={l.href} className="hover:text-primary">
                        {(bn && l.label_bn) || l.label}
                      </Link>
                    )}
                  </li>
                ))
              ) : (
                <>
                  <li><Link to="/about" className="hover:text-primary">{t("footer.links.about")}</Link></li>
                  <li><Link to="/industries" className="hover:text-primary">{t("footer.links.industries")}</Link></li>
                  <li><Link to="/projects" className="hover:text-primary">{t("footer.links.projects")}</Link></li>
                  <li><Link to="/careers" className="hover:text-primary">{t("footer.links.careers")}</Link></li>
                  <li><Link to="/contact" className="hover:text-primary">{t("footer.links.contact")}</Link></li>
                </>
              )}
            </ul>
          </div>


          <div>
            <h4 className="font-display text-sm font-semibold uppercase tracking-wider">{t("footer.ourVentures")}</h4>
            <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
              {ventures.slice(0, 8).map((v) => (
                <li key={v.slug}>
                  <Link to="/ventures/$slug" params={{ slug: v.slug }} className="hover:text-primary">
                    {v.title}
                  </Link>
                </li>
              ))}
              <li><Link to="/ventures" className="font-semibold text-primary hover:underline">{t("footer.links.viewAll")}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display text-sm font-semibold uppercase tracking-wider">{t("footer.getInTouch")}</h4>
            <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
              <li className="flex gap-3">
                <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" aria-hidden="true" />
                <span>{address}</span>
              </li>
              <li className="flex gap-3">
                <Phone className="h-4 w-4 flex-shrink-0 text-primary" aria-hidden="true" />
                <a href={phoneHref} className="tabular-nums hover:text-primary" aria-label={`Call ${COMPANY_CONTACT.phone.display}`}>
                  {COMPANY_CONTACT.phone.display}
                </a>
              </li>
              <li className="flex gap-3">
                <Mail className="h-4 w-4 flex-shrink-0 text-primary" aria-hidden="true" />
                <a href={`mailto:${email}`} className="hover:text-primary">{email}</a>

              </li>
            </ul>

            <form
              onSubmit={(e) => e.preventDefault()}
              className="mt-5 flex overflow-hidden rounded-full border border-border bg-card"
            >
              <input
                type="email"
                required
                placeholder={t("footer.yourEmail")}
                aria-label={t("footer.newsletterAria")}
                className="flex-1 bg-transparent px-4 py-2.5 text-sm outline-none placeholder:text-muted-foreground"
              />
              <button
                type="submit"
                className="bg-gradient-primary px-4 text-sm font-semibold text-primary-foreground"
              >
                {t("footer.subscribe")}
              </button>
            </form>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-border pt-6 text-xs text-muted-foreground md:flex-row">
          <p>© {new Date().getFullYear()} YESS Bangla Private Limited. {t("footer.rights")}</p>
          <div className="flex items-center gap-5">
            <Link to="/privacy" className="hover:text-primary">{t("footer.links.privacy")}</Link>
            <Link to="/terms" className="hover:text-primary">{t("footer.links.terms")}</Link>
            <Link to="/faq" className="hover:text-primary">{t("footer.links.faq")}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
