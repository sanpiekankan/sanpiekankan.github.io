/**
 * 图片预加载工具
 */
export class ImagePreloader {
  private cache = new Set<string>();

  /**
   * 预加载图片
   * @param {string} src - 图片源路径
   * @returns {Promise<void>} 预加载完成的Promise
   */
  preload(src: string): Promise<void> {
    if (this.cache.has(src)) {
      return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        this.cache.add(src);
        resolve();
      };
      img.onerror = reject;
      img.src = src;
    });
  }

  /**
   * 批量预加载图片
   * @param {string[]} srcs - 图片源路径数组
   * @returns {Promise<void[]>} 所有图片预加载完成的Promise
   */
  preloadBatch(srcs: string[]): Promise<void[]> {
    return Promise.all(srcs.map(src => this.preload(src)));
  }
}

export const imagePreloader = new ImagePreloader();