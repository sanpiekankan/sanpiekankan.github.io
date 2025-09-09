'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

/**
 * Google Analytics组件
 * 提供Google Analytics 4 (GA4) 集成
 * @param {Object} props - 组件属性
 * @param {string} props.gaId - Google Analytics测量ID
 * @returns {JSX.Element | null} 渲染的Google Analytics脚本或null
 */
export default function GoogleAnalytics({ gaId }: { gaId: string }) {
  const pathname = usePathname();

  useEffect(() => {
    if (!gaId) return;

    // 动态加载Google Analytics脚本
    const script1 = document.createElement('script');
    script1.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
    script1.async = true;
    document.head.appendChild(script1);

    const script2 = document.createElement('script');
    script2.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${gaId}');
    `;
    document.head.appendChild(script2);

    return () => {
      // 清理脚本
      document.head.removeChild(script1);
      document.head.removeChild(script2);
    };
  }, [gaId]);

  useEffect(() => {
    if (!gaId) return;

    // 页面路由变化时发送页面浏览事件
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('config', gaId, {
        page_path: pathname,
      });
    }
  }, [pathname, gaId]);

  return null;
}