import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import exifReader from 'exif-reader';

/**
 * 从图片文件中提取EXIF拍摄时间
 * @param {string} filePath - 图片文件路径
 * @returns {Date | null} 拍摄时间，如果无法获取则返回null
 */
function getExifDateTime(filePath: string): Date | null {
  try {
    const buffer = fs.readFileSync(filePath);
    
    // 查找EXIF数据的起始位置
    const exifStart = buffer.indexOf(Buffer.from([0xFF, 0xE1]));
    if (exifStart === -1) return null;
    
    // 提取EXIF数据
    const exifLength = buffer.readUInt16BE(exifStart + 2);
    const exifBuffer = buffer.slice(exifStart + 4, exifStart + 2 + exifLength);
    
    // 检查是否为有效的EXIF数据
    if (!exifBuffer.toString('ascii', 0, 4).includes('Exif')) return null;
    
    // 解析EXIF数据
    const tiffBuffer = exifBuffer.slice(6); // 跳过"Exif\0\0"
    const exif = exifReader(tiffBuffer);
    
    // 尝试获取拍摄时间（按优先级）
    const dateTimeOriginal = exif?.exif?.DateTimeOriginal;
    const dateTime = exif?.image?.DateTime;
    const dateTimeDigitized = exif?.exif?.DateTimeDigitized;
    
    const dateString = dateTimeOriginal || dateTime || dateTimeDigitized;
    
    if (dateString) {
      // EXIF日期格式: "YYYY:MM:DD HH:MM:SS"
      const formattedDate = dateString.replace(/^(\d{4}):(\d{2}):(\d{2})/, '$1-$2-$3');
      const date = new Date(formattedDate);
      return isNaN(date.getTime()) ? null : date;
    }
    
    return null;
  } catch (error) {
    console.warn(`无法读取EXIF数据: ${filePath}`, error.message);
    return null;
  }
}

/**
 * 按EXIF拍摄时间排序图片文件（最新的在前）
 * @param {string[]} files - 文件名数组
 * @param {string} directory - 目录路径
 * @returns {string[]} 按拍摄时间倒序排列的文件名数组
 */
function sortFilesByExifDateTime(files: string[], directory: string): string[] {
  return files
    .map(filename => {
      const filePath = path.join(directory, filename);
      const exifDate = getExifDateTime(filePath);
      const fallbackDate = fs.statSync(filePath).mtime; // 如果没有EXIF数据，使用文件修改时间
      
      return {
        filename,
        date: exifDate || fallbackDate,
        hasExif: !!exifDate
      };
    })
    .sort((a, b) => {
      // 优先按拍摄时间排序，有EXIF数据的排在前面
      if (a.hasExif && !b.hasExif) return -1;
      if (!a.hasExif && b.hasExif) return 1;
      return b.date.getTime() - a.date.getTime(); // 倒序排列，最新的在前
    })
    .map(item => item.filename);
}

/**
 * GET handler for fetching image list
 * 优先返回WebP格式的图片，如果没有则返回原始格式
 * 图片按EXIF拍摄时间倒序排列（最新的在前）
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
        // 如果有WebP文件，按EXIF拍摄时间倒序排列
        imageFiles = sortFilesByExifDateTime(webpFiles, webpDirectory);
        return NextResponse.json({ 
          images: imageFiles,
          format: 'webp',
          directory: 'webp',
          sortBy: 'exif-datetime'
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
      
      // 按EXIF拍摄时间倒序排列
      imageFiles = sortFilesByExifDateTime(originalFiles, originalDirectory);
      return NextResponse.json({ 
        images: imageFiles,
        format: 'original',
        directory: 'images',
        sortBy: 'exif-datetime'
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