const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

/**
 * 批量将图片转换为WebP格式，保持原始方向
 */
async function convertImagesToWebP() {
  const inputDir = path.join(process.cwd(), 'public/images');
  const outputDir = path.join(process.cwd(), 'public/images/webp');
  
  // 创建输出目录
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  const files = fs.readdirSync(inputDir);
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp'];
  
  for (const file of files) {
    const ext = path.extname(file).toLowerCase();
    if (imageExtensions.includes(ext)) {
      const inputPath = path.join(inputDir, file);
      const outputPath = path.join(outputDir, `${path.parse(file).name}.webp`);
      
      try {
        await sharp(inputPath)
          .rotate() // 自动根据EXIF方向信息旋转图片
          .webp({ 
            quality: 80, // 调整质量（0-100）
            effort: 6    // 压缩努力程度（0-6，越高压缩越好但速度越慢）
          })
          .toFile(outputPath);
        
        console.log(`✅ 转换完成: ${file} -> ${path.basename(outputPath)}`);
      } catch (error) {
        console.error(`❌ 转换失败: ${file}`, error.message);
      }
    }
  }
  
  console.log('🎉 所有图片转换完成！');
}

convertImagesToWebP().catch(console.error);