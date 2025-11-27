import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";

const Footer = () => {
  return (
    <footer className="bg-[hsl(var(--commerce-green))] text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                <div className="w-6 h-6 bg-gradient-to-br from-[hsl(var(--commerce-green))] to-[hsl(var(--commerce-teal))] rounded-full flex items-center justify-center">
                  <div className="w-3 h-3 bg-white rounded-full"></div>
                </div>
              </div>
              <h3 className="text-xl font-bold">Commerce Bank</h3>
            </div>
            <p className="text-white/80 mb-6">
              Your trusted financial partner for over 150 years. FDIC insured and committed to your financial success.
            </p>
          </div>

          {/* About Us */}
          <div>
            <h4 className="text-lg font-semibold mb-4">About Us</h4>
            <ul className="space-y-3 text-white/80">
              <li><Link to="/about" className="hover:text-white transition-colors">Our Story</Link></li>
              <li><Link to="/leadership" className="hover:text-white transition-colors">Leadership Team</Link></li>
              <li><Link to="/careers" className="hover:text-white transition-colors">Careers</Link></li>
              <li><Link to="/news" className="hover:text-white transition-colors">News & Updates</Link></li>
            </ul>
          </div>

          {/* Support & Resources */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Support & Resources</h4>
            <ul className="space-y-3 text-white/80">
              <li><Link to="/locations" className="hover:text-white transition-colors">Find Locations</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
              <li><Link to="/security" className="hover:text-white transition-colors">Security Center</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-white/20 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex flex-wrap gap-6 text-sm text-white/80">
              <Link to="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
              <Link to="/terms-of-service" className="hover:text-white transition-colors">Terms of Service</Link>
              <Link to="/accessibility" className="hover:text-white transition-colors">Accessibility</Link>
              <Link to="/disclosures" className="hover:text-white transition-colors">Disclosures</Link>
              <Link to="/site-map" className="hover:text-white transition-colors">Site Map</Link>
            </div>
            <div className="text-sm text-white/80">
              <p>© 2024 Commerce Bank. All rights reserved.</p>
            </div>
          </div>
          
          <div className="mt-8 p-4 bg-white/10 rounded-lg">
            <p className="text-sm text-white/90">
              <strong>Equal Housing Lender.</strong> Member FDIC. Commerce Bank and its affiliates do not provide tax or legal advice. 
              Please consult your tax advisor or attorney for such guidance.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;