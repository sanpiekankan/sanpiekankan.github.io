'use client';

import Link from 'next/link';
import { useEffect } from 'react';

interface NavigationProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Renders the side navigation drawer.
 * @param {NavigationProps} props - The props for the Navigation component.
 * @returns {JSX.Element | null} The rendered navigation drawer.
 */
const Navigation: React.FC<NavigationProps> = ({ isOpen, onClose }) => {
  /**
   * 处理ESC键关闭导航
   */
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  /**
   * 处理背景点击关闭导航
   * @param {React.MouseEvent} e - 鼠标事件
   */
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* 背景遮罩 */}
      <div 
        className="fixed inset-0 bg-black/50 z-30 transition-opacity duration-500"
        onClick={handleBackdropClick}
      />
      
      {/* 导航抽屉 */}
      <div
        className={`fixed top-0 right-0 h-full w-full md:w-1/3 bg-background shadow-lg z-40 p-8 transform transition-transform duration-500 ease-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <nav className="flex flex-col items-start space-y-6 text-2xl mt-16">
          <Link 
            href="/" 
            onClick={onClose} 
            className="hover:text-accent transition-colors duration-200"
          >
            Photo Story
          </Link>
          <Link 
            href="/stories" 
            onClick={onClose} 
            className="hover:text-accent transition-colors duration-200"
          >
            故事集
          </Link>
          <Link 
            href="/gallery" 
            onClick={onClose} 
            className="hover:text-accent transition-colors duration-200"
          >
            照片画廊
          </Link>
         
        </nav>
        
        {/* 关闭按钮 */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-2xl hover:text-accent transition-colors duration-200"
          aria-label="关闭导航"
        >
          ×
        </button>
      </div>
    </>
  );
};

export default Navigation;