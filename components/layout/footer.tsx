import Link from "next/link"
import { PawPrint, Twitter, Instagram, Facebook, Linkedin } from "lucide-react"

const footerLinks = {
  Services: [
    { label: "Veterinary", href: "/search?type=VET" },
    { label: "Grooming", href: "/search?type=GROOMING" },
    { label: "Boarding", href: "/search?type=BOARDING" },
    { label: "Dog Walking", href: "/search?type=WALKING" },
    { label: "Training", href: "/search?type=TRAINING" },
    { label: "Insurance", href: "/search?type=INSURANCE" },
  ],
  Company: [
    { label: "About Us", href: "/about" },
    { label: "Blog", href: "/blog" },
    { label: "Careers", href: "/careers" },
    { label: "Press", href: "/press" },
  ],
  Support: [
    { label: "Help Center", href: "/help" },
    { label: "Contact Us", href: "/contact" },
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
  ],
}

const socials = [
  { icon: Twitter, href: "https://twitter.com", label: "Twitter" },
  { icon: Instagram, href: "https://instagram.com", label: "Instagram" },
  { icon: Facebook, href: "https://facebook.com", label: "Facebook" },
  { icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn" },
]

export function Footer() {
  return (
    <footer className="border-t border-border/60 bg-muted/30">
      <div className="container mx-auto max-w-7xl px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary shadow-md shadow-primary/30">
                <PawPrint size={18} className="text-primary-foreground" />
              </div>
              <span className="text-xl font-black tracking-tight">
                Peto<span className="text-primary">Philia</span>
              </span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              Connecting pet owners with the best local service providers. Because your pets deserve the very best care.
            </p>
            <div className="flex gap-3 mt-6">
              {socials.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-border hover:border-primary/40 hover:bg-primary/5 text-muted-foreground hover:text-primary transition-all duration-150"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([section, links]) => (
            <div key={section}>
              <h4 className="text-sm font-bold mb-4">{section}</h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-border/60 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Syntalix LLP. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            Made with ❤️ for pets everywhere
          </p>
        </div>
      </div>
    </footer>
  )
}
