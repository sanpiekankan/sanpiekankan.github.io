import { getAllPostSlugs, getPostData } from '@/lib/posts';
import Image from 'next/image';
import { notFound } from 'next/navigation';

/**
 * 为所有故事页面生成静态参数。
 * @returns {{ params: { slug: string } }[]} 一个包含所有故事 slug 的数组。
 */
export function generateStaticParams() {
  const paths = getAllPostSlugs();
  return paths;
}

/**
 * 渲染单个故事页面的组件。
 * @param {{ params: { slug: string } }} props - 包含从 URL 捕获的 slug 的属性。
 * @returns {Promise<JSX.Element>} 一个渲染故事页面的 Promise。
 */
export default async function StoryPage({ params }: { params: { slug: string } }) {
  const postData = await getPostData(params.slug);

  if (!postData) {
    notFound();
  }

  return (
    <main className="pt-24 px-4 md:px-8">
      <h1 className="text-center text-4xl font-bold mb-12">{postData.title}</h1>
      <div className="max-w-4xl mx-auto space-y-8">
        {postData.galleryImages && postData.galleryImages.map((imgSrc, index) => (
          <div key={index} className="w-full">
            <Image
              src={imgSrc}
              alt={`${postData.title} - image ${index + 1}`}
              width={1200}
              height={800}
              className="w-full h-auto object-contain"
              priority={index < 2} // 优先加载前两张图片
              loading={index < 2 ? 'eager' : 'lazy'} // 明确设置加载策略
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
              quality={85} // 故事页面使用更高质量
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
            />
          </div>
        ))}
      </div>
      <div
        className="mx-auto prose lg:prose-xl dark:prose-invert mt-16"
        dangerouslySetInnerHTML={{ __html: postData.contentHtml }}
      />
    </main>
  );
}