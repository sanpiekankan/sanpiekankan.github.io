import { Instagram, Twitter, Facebook } from 'lucide-react';
import Link from 'next/link';

/**
 * Renders the site footer with social media links.
 * @returns {JSX.Element} The rendered footer component.
 */
const Footer = () => {
  return (
    <footer className="fixed bottom-4 right-4">
      <div className="flex items-center space-x-4">
        <Link 
          href="https://instagram.com" 
          target="_blank" 
          rel="noopener noreferrer" 
          aria-label="Instagram"
          className="text-gray-600 hover:text-black transition-colors"
        >
          <Instagram className="w-6 h-6" />
        </Link>
        <Link 
          href="https://twitter.com" 
          target="_blank" 
          rel="noopener noreferrer" 
          aria-label="Twitter"
          className="text-gray-600 hover:text-black transition-colors"
        >
          <Twitter className="w-6 h-6" />
        </Link>
        <Link 
          href="https://facebook.com" 
          target="_blank" 
          rel="noopener noreferrer" 
          aria-label="Facebook"
          className="text-gray-600 hover:text-black transition-colors"
        >
          <Facebook className="w-6 h-6" />
        </Link>
      </div>
    </footer>
  );
};

export default Footer;