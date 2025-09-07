import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import fs from 'fs';
import path from 'path';

/**
 * A utility function to conditionally join class names together.
 * It merges Tailwind CSS classes without style conflicts.
 *
 * @param {...ClassValue[]} inputs - A list of class values to be merged.
 * @returns {string} The merged class names.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * 获取public/images目录下的所有图片文件
 * @returns {string[]} 图片文件名数组
 */
export function getAllImages(): string[] {
  try {
    const imagesDirectory = path.join(process.cwd(), 'public/images');
    const filenames = fs.readdirSync(imagesDirectory);
    
    // 过滤出图片文件（支持常见的图片格式）
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.svg'];
    const imageFiles = filenames.filter(name => {
      const ext = path.extname(name).toLowerCase();
      return imageExtensions.includes(ext) && !name.startsWith('.');
    });
    
    // 按文件名排序
    return imageFiles.sort();
  } catch (error) {
    console.error('Error reading images directory:', error);
    return [];
  }
}