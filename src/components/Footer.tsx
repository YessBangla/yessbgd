import { Link } from "@tanstack/react-router";
import { Facebook, Twitter, Youtube, Instagram, Mail, Phone, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border bg-gradient-to-b from-background to-secondary/40">
      <div className="container-tight py-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="grid h-9 w-9 place-items-center rounded-lg bg-gradient-primary font-display text-base font-bold text-primary-foreground">
                Y
              </span>
              <div className="font-display text-lg font-bold">YESS Bangla</div>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              A full-service business consulting and IT solutions company helping organisations
              across Bangladesh scale with confidence.
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
            <h4 className="font-display text-sm font-semibold uppercase tracking-wider">Company</h4>
            <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
              <li><Link to="/about" className="hover:text-primary">About Us</Link></li>
              <li><Link to="/services" className="hover:text-primary">Services</Link></li>
              <li><Link to="/projects" className="hover:text-primary">Projects</Link></li>
              <li><Link to="/contact" className="hover:text-primary">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display text-sm font-semibold uppercase tracking-wider">Services</h4>
            <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
              <li>Akash OTT</li>
              <li>Akash News</li>
              <li>One Stop Solution</li>
              <li>Web Development</li>
              <li>E-commerce</li>
            </ul>
          </div>

          <div>
            <h4 className="font-display text-sm font-semibold uppercase tracking-wider">Get in touch</h4>
            <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
              <li className="flex gap-3">
                <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                <span>Block A, Road 3, House 127 (Green View), 1st Floor, Mirpur 12, Dhaka 1216</span>
              </li>
              <li className="flex gap-3">
                <Phone className="h-4 w-4 flex-shrink-0 text-primary" />
                <a href="tel:+8801805464340" className="hover:text-primary">+880 1805-464340</a>
              </li>
              <li className="flex gap-3">
                <Mail className="h-4 w-4 flex-shrink-0 text-primary" />
                <a href="mailto:yessbangla.bd@gmail.com" className="hover:text-primary">yessbangla.bd@gmail.com</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-border pt-6 text-xs text-muted-foreground md:flex-row">
          <p>© {new Date().getFullYear()} YESS Bangla Private Limited. All rights reserved.</p>
          <p>Crafted with care in Dhaka, Bangladesh.</p>
        </div>
      </div>
    </footer>
  );
}
