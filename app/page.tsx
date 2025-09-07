'use client';

import { useState, useEffect } from 'react';
import StoryThumbnail from '@/components/StoryThumbnail';
import PhotoModal from '@/components/PhotoModal';
import Image from 'next/image';

/**
 * 主页组件，展示故事集和照片画廊
 * @returns {JSX.Element} 渲染的主页组件
 */
export default function Home() {
  const [allImages, setAllImages] = useState<string[]>([]);
  const [stories, setStories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  /**
   * 从API获取图片列表和故事数据
   */
  useEffect(() => {
    const fetchData = async () => {
      try {
        // 获取图片列表
        const imageResponse = await fetch('/api/images');
        const imageData = await imageResponse.json();
        setAllImages(imageData.images || []);

        // 获取故事数据
        const storiesResponse = await fetch('/api/stories');
        const storiesData = await storiesResponse.json();
        setStories(storiesData.stories || []);
      } catch (error) {
        console.error('Error fetching data:', error);
        setAllImages([]);
        setStories([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  /**
   * 打开照片模态框
   * @param {number} index - 图片索引
   */
  const openModal = (index: number) => {
    setCurrentImageIndex(index);
    setIsModalOpen(true);
  };

  /**
   * 关闭照片模态框
   */
  const closeModal = () => {
    setIsModalOpen(false);
  };

  /**
   * 导航到指定图片
   * @param {number} index - 图片索引
   */
  const navigateToImage = (index: number) => {
    setCurrentImageIndex(index);
  };

  if (isLoading) {
    return (
      <main className="p-4 pt-20">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">加载内容中...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="p-4 pt-20">
      {/* 故事集区域 - 只有当有故事时才显示 */}
      {stories.length > 0 && (
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">故事集</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {stories.map((story) => (
              <div key={story.slug} className="aspect-[4/3] relative">
                <StoryThumbnail
                  slug={story.slug}
                  title={story.title}
                  coverImage={story.coverImage}
                />
                <div className="mt-4">
                  <h3 className="text-lg font-semibold mb-2">{story.title}</h3>
                  <p className="text-gray-600 text-sm mb-2">{story.description}</p>
                  <p className="text-gray-400 text-xs">{story.date}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
      {/* 照片画廊区域 */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-8 text-center">照片画廊</h2>
        {allImages.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {allImages.map((filename, index) => (
              <div 
                key={filename} 
                className="group cursor-pointer"
                onClick={() => openModal(index)}
              >
                <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100 shadow-lg hover:shadow-xl transition-all duration-300">
                  <Image
                    src={`/images/${filename}`}
                    alt={`图片 ${index + 1}: ${filename}`}
                    fill
                    style={{ objectFit: 'cover' }}
                    className="transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, (max-width: 1536px) 33vw, 25vw"
                    priority={index < 8} // 优先加载前8张图片
                  />
                  {/* 图片信息覆盖层 */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-end">
                    <div className="w-full p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                      <p className="text-sm font-medium truncate">{filename}</p>
                      <p className="text-xs text-gray-300 mt-1">点击查看大图</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">暂无图片</p>
            <p className="text-gray-400 text-sm mt-2">请在 public/images 目录中添加图片文件</p>
          </div>
        )}
      </section>

      {/* 照片模态框 */}
      <PhotoModal
        isOpen={isModalOpen}
        onClose={closeModal}
        images={allImages}
        currentIndex={currentImageIndex}
        onNavigate={navigateToImage}
      />
    </main>
  );
}