const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

/**
 * 批量将图片转换为WebP格式，保持原始方向并添加水印
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
        // 先处理旋转并转换为WebP
        const processedImageBuffer = await sharp(inputPath)
          .rotate() // 自动根据EXIF方向信息旋转图片
          .webp({ 
            quality: 80, // 调整质量（0-100）
            effort: 6    // 压缩努力程度（0-6，越高压缩越好但速度越慢）
          })
          .toBuffer();
        
        // 获取处理后图片的尺寸
        const processedImage = sharp(processedImageBuffer);
        const { width, height } = await processedImage.metadata();
        
        // 创建水印SVG
        const fontSize = Math.max(Math.min(width, height) * 0.03, 16);
        const padding = 20;
        
        const watermarkSvg = `
          <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="1" dy="1" stdDeviation="1" flood-color="black" flood-opacity="0.5"/>
              </filter>
            </defs>
            <text 
              x="${width - padding}" 
              y="${height - padding}" 
              font-family="Arial, sans-serif" 
              font-size="${fontSize}" 
              font-weight="bold"
              fill="white" 
              text-anchor="end" 
              dominant-baseline="bottom"
              filter="url(#shadow)"
              opacity="0.8">
              By三撇看看
            </text>
          </svg>
        `;
        
        // 将水印合成到已处理的图片上
        await processedImage
          .composite([
            {
              input: Buffer.from(watermarkSvg),
              top: 0,
              left: 0
            }
          ])
          .toFile(outputPath);
        
        console.log(`✅ 转换完成（已添加水印）: ${file} -> ${path.basename(outputPath)}`);
      } catch (error) {
        console.error(`❌ 转换失败: ${file}`, error.message);
        
        // 如果水印合成失败，尝试不添加水印直接转换
        try {
          await sharp(inputPath)
            .rotate()
            .webp({ quality: 80, effort: 6 })
            .toFile(outputPath);
          console.log(`⚠️  转换完成（无水印）: ${file} -> ${path.basename(outputPath)}`);
        } catch (fallbackError) {
          console.error(`❌ 备用转换也失败: ${file}`, fallbackError.message);
        }
      }
    }
  }
  
  console.log('🎉 所有图片转换完成！');
}

convertImagesToWebP().catch(console.error);