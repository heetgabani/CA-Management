import { Linkedin } from 'lucide-react';

const links = {
  Product:   ['Features', 'Pricing', 'Changelog', 'Roadmap'],
  Resources: ['Documentation', 'Blog', 'Video Tutorials', 'API Reference'],
  Company:   ['About', 'Careers', 'Press', 'Contact'],
  Legal:     ['Privacy Policy', 'Terms of Service', 'Security', 'GDPR'],
};

export default function Footer() {
  return (
    <footer className="bg-[#111827] text-[#94A3B8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2">
            <a href="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center border border-white/10">
                <span className="text-white font-black text-sm">LF</span>
              </div>
              <span className="text-lg font-bold text-white">LedgerFlow</span>
            </a>
            <p className="text-sm leading-relaxed mb-5 max-w-xs">
              The Digital Operating System for Chartered Accountants, Company Secretaries & Professional Firms.
            </p>
            <div className="flex gap-3">
              {[Linkedin].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-8 h-8 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg flex items-center justify-center transition-colors"
                >
                  <Icon size={15} className="text-[#94A3B8]" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(links).map(([section, items]) => (
            <div key={section}>
              <p className="text-xs font-semibold text-white uppercase tracking-wider mb-4">{section}</p>
              <ul className="space-y-2.5">
                {items.map(item => (
                  <li key={item}>
                    <a href="#" className="text-sm text-[#94A3B8] hover:text-white transition-colors">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[#64748B]">
            © {new Date().getFullYear()} LedgerFlow. All rights reserved. Made in India 🇮🇳
          </p>
          <div className="flex items-center gap-4 text-xs text-[#64748B]">
            <a href="#" className="hover:text-[#94A3B8] transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-[#94A3B8] transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-[#94A3B8] transition-colors">Security</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
