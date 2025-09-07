/**
 * 图片格式检测和优化工具
 */
export class ImageUtils {
  private static webpSupport: boolean | null = null;
  
  /**
   * 检测浏览器是否支持WebP格式
   * @returns {Promise<boolean>} 是否支持WebP
   */
  static async checkWebPSupport(): Promise<boolean> {
    if (this.webpSupport !== null) {
      return this.webpSupport;
    }
    
    if (typeof window === 'undefined') {
      return false;
    }
    
    return new Promise((resolve) => {
      const webP = new Image();
      webP.onload = webP.onerror = () => {
        this.webpSupport = webP.height === 2;
        resolve(this.webpSupport);
      };
      webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
    });
  }
  
  /**
   * 获取优化后的图片路径
   * @param {string} originalSrc - 原始图片路径
   * @returns {Promise<string>} 优化后的图片路径
   */
  static async getOptimizedImageSrc(originalSrc: string): Promise<string> {
    const supportsWebP = await this.checkWebPSupport();
    
    if (supportsWebP && originalSrc.startsWith('/images/')) {
      const webpSrc = originalSrc.replace('/images/', '/images/webp/').replace(/\.(jpg|jpeg|png|gif|bmp)$/i, '.webp');
      
      // 检查WebP文件是否存在
      try {
        const response = await fetch(webpSrc, { method: 'HEAD' });
        if (response.ok) {
          return webpSrc;
        }
      } catch (error) {
        console.warn('WebP文件不存在，使用原始格式:', originalSrc);
      }
    }
    
    return originalSrc;
  }
  
  /**
   * 获取图片文件大小信息
   * @param {string} src - 图片路径
   * @returns {Promise<number>} 文件大小（字节）
   */
  static async getImageSize(src: string): Promise<number> {
    try {
      const response = await fetch(src, { method: 'HEAD' });
      const contentLength = response.headers.get('content-length');
      return contentLength ? parseInt(contentLength, 10) : 0;
    } catch (error) {
      console.error('获取图片大小失败:', error);
      return 0;
    }
  }
}