'use client';

import { useState } from 'react';
import Link from 'next/link';
import Navigation from './Navigation';

/**
 * Renders the site header with navigation toggle.
 * @returns {JSX.Element} The rendered header component.
 */
const Header = () => {
  const [isNavOpen, setIsNavOpen] = useState(false);

  const toggleNav = () => setIsNavOpen(!isNavOpen);

  return (
    <>
      <header className="fixed top-0 left-0 w-full flex justify-between items-center p-4 z-50 mix-blend-difference">
        <Link href="/" className="text-xl font-bold text-white">
          PhotoStory
        </Link>
        
      </header>
     
    </>
  );
};

export default Header;