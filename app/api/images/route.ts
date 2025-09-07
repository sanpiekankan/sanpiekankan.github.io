import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

/**
 * GET handler for fetching image list
 * @returns {NextResponse} JSON response with image filenames
 */
export async function GET() {
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
    const sortedImages = imageFiles.sort();
    
    return NextResponse.json({ images: sortedImages });
  } catch (error) {
    console.error('Error reading images directory:', error);
    return NextResponse.json({ images: [] }, { status: 500 });
  }
}