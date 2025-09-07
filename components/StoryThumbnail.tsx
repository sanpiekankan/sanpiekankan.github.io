'use client';

import Link from 'next/link';
import Image from 'next/image';

interface StoryThumbnailProps {
  slug: string;
  title: string;
  coverImage: string;
}

/**
 * Renders a story thumbnail for the homepage grid.
 * @param {StoryThumbnailProps} props - The props for the StoryThumbnail component.
 * @returns {JSX.Element} The rendered story thumbnail.
 */
const StoryThumbnail: React.FC<StoryThumbnailProps> = ({ slug, title, coverImage }) => {
  return (
    <Link href={`/stories/${slug}`} className="relative block w-full h-full overflow-hidden group">
      <Image
        src={coverImage}
        alt={title}
        fill
        style={{ objectFit: 'cover' }}
        className="transition-transform duration-500 ease-in-out group-hover:scale-105"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
      <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <h2 className="text-white text-2xl font-bold text-center p-4">{title}</h2>
      </div>
    </Link>
  );
};

export default StoryThumbnail;