/**
 * 自定义图片加载器，用于静态导出
 * @param {Object} params - 图片参数
 * @param {string} params.src - 图片源路径
 * @param {number} params.width - 图片宽度
 * @param {number} params.quality - 图片质量
 * @returns {string} 优化后的图片URL
 */
export default function imageLoader({ src, width, quality }) {
  const basePath = process.env.NODE_ENV === 'production' ? '/sanpiekankan.github.io' : '';
  
  // 检查是否支持WebP
  const supportsWebP = typeof window !== 'undefined' && 
    window.document && 
    window.document.createElement('canvas').toDataURL('image/webp').indexOf('data:image/webp') === 0;
  
  // 如果支持WebP，尝试使用WebP版本
  if (supportsWebP && src.startsWith('/images/')) {
    const webpSrc = src.replace('/images/', '/images/webp/').replace(/\.(jpg|jpeg|png|gif|bmp)$/i, '.webp');
    return `${basePath}${webpSrc}?w=${width}&q=${quality || 75}`;
  }
  
  // 回退到原始格式
  return `${basePath}${src}?w=${width}&q=${quality || 75}`;
}