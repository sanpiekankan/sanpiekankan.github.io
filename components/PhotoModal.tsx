'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface PhotoModalProps {
  isOpen: boolean;
  onClose: () => void;
  images: string[];
  currentIndex: number;
  onNavigate: (index: number) => void;
}

/**
 * 照片详情模态框组件
 * @param {PhotoModalProps} props - 组件属性
 * @returns {JSX.Element | null} 渲染的模态框组件
 */
export default function PhotoModal({ isOpen, onClose, images, currentIndex, onNavigate }: PhotoModalProps) {
  const [isLoading, setIsLoading] = useState(true);

  /**
   * 处理键盘事件
   * @param {KeyboardEvent} e - 键盘事件
   */
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      
      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowLeft':
          if (currentIndex > 0) {
            onNavigate(currentIndex - 1);
          }
          break;
        case 'ArrowRight':
          if (currentIndex < images.length - 1) {
            onNavigate(currentIndex + 1);
          }
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentIndex, images.length, onClose, onNavigate]);

  /**
   * 处理背景点击关闭
   * @param {React.MouseEvent} e - 鼠标事件
   */
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  /**
   * 导航到上一张图片
   */
  const goToPrevious = () => {
    if (currentIndex > 0) {
      onNavigate(currentIndex - 1);
    }
  };

  /**
   * 导航到下一张图片
   */
  const goToNext = () => {
    if (currentIndex < images.length - 1) {
      onNavigate(currentIndex + 1);
    }
  };

  if (!isOpen) return null;

  const currentImage = images[currentIndex];

  return (
    <div 
      className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      {/* 关闭按钮 */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-10"
        aria-label="关闭"
      >
        <X size={32} />
      </button>

      {/* 上一张按钮 */}
      {currentIndex > 0 && (
        <button
          onClick={goToPrevious}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 transition-colors z-10"
          aria-label="上一张"
        >
          <ChevronLeft size={48} />
        </button>
      )}

      {/* 下一张按钮 */}
      {currentIndex < images.length - 1 && (
        <button
          onClick={goToNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 transition-colors z-10"
          aria-label="下一张"
        >
          <ChevronRight size={48} />
        </button>
      )}

      {/* 图片容器 */}
      <div className="relative max-w-[90vw] max-h-[90vh] w-full h-full flex items-center justify-center">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
          </div>
        )}
        
        <Image
          src={`/images/${currentImage}`}
          alt={`图片: ${currentImage}`}
          fill
          style={{ objectFit: 'contain' }}
          className={`transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
          onLoad={() => setIsLoading(false)}
          onLoadStart={() => setIsLoading(true)}
          priority
        />
      </div>

      {/* 图片信息 */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-center">
        <p className="text-lg font-medium mb-1">{currentImage}</p>
        <p className="text-sm text-gray-300">
          {currentIndex + 1} / {images.length}
        </p>
      </div>
    </div>
  );
}