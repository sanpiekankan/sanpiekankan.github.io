import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

/**
 * GET handler for fetching image list
 * 优先返回WebP格式的图片，如果没有则返回原始格式
 * @returns {NextResponse} JSON response with image filenames
 */
export async function GET() {
  try {
    const webpDirectory = path.join(process.cwd(), 'public/images/webp');
    const originalDirectory = path.join(process.cwd(), 'public/images');
    
    let imageFiles: string[] = [];
    
    // 优先检查WebP目录
    if (fs.existsSync(webpDirectory)) {
      const webpFilenames = fs.readdirSync(webpDirectory);
      const webpFiles = webpFilenames.filter(name => {
        const ext = path.extname(name).toLowerCase();
        return ext === '.webp' && !name.startsWith('.');
      });
      
      if (webpFiles.length > 0) {
        // 如果有WebP文件，返回WebP文件列表
        imageFiles = webpFiles.sort();
        return NextResponse.json({ 
          images: imageFiles,
          format: 'webp',
          directory: 'webp'
        });
      }
    }
    
    // 如果没有WebP文件，检查原始图片目录
    if (fs.existsSync(originalDirectory)) {
      const originalFilenames = fs.readdirSync(originalDirectory);
      const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.svg'];
      const originalFiles = originalFilenames.filter(name => {
        const ext = path.extname(name).toLowerCase();
        return imageExtensions.includes(ext) && !name.startsWith('.') && name !== 'webp'; // 排除webp目录
      });
      
      imageFiles = originalFiles.sort();
      return NextResponse.json({ 
        images: imageFiles,
        format: 'original',
        directory: 'images'
      });
    }
    
    // 如果两个目录都没有图片
    return NextResponse.json({ 
      images: [],
      format: 'none',
      directory: 'none'
    });
    
  } catch (error) {
    console.error('Error reading images directory:', error);
    return NextResponse.json({ images: [] }, { status: 500 });
  }
}