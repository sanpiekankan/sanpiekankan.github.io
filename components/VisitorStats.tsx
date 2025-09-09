'use client';

import { useState, useEffect } from 'react';
import { Eye, Users, Calendar } from 'lucide-react';

interface VisitorData {
  totalVisits: number;
  uniqueVisitors: number;
  todayVisits: number;
  lastVisit: string;
}

/**
 * 访客统计组件
 * 提供页面访问统计功能，包括总访问量、独立访客数和今日访问量
 * @returns {JSX.Element} 渲染的访客统计组件
 */
export default function VisitorStats() {
  const [visitorData, setVisitorData] = useState<VisitorData>({
    totalVisits: 0,
    uniqueVisitors: 0,
    todayVisits: 0,
    lastVisit: ''
  });
  const [isVisible, setIsVisible] = useState(false);

  /**
   * 获取今天的日期字符串
   * @returns {string} 格式化的日期字符串 (YYYY-MM-DD)
   */
  const getTodayString = (): string => {
    return new Date().toISOString().split('T')[0];
  };

  /**
   * 生成访客唯一标识符
   * @returns {string} 访客ID
   */
  const generateVisitorId = (): string => {
    let visitorId = localStorage.getItem('visitor_id');
    if (!visitorId) {
      visitorId = 'visitor_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('visitor_id', visitorId);
    }
    return visitorId;
  };

  /**
   * 更新访客统计数据
   */
  const updateVisitorStats = () => {
    const today = getTodayString();
    const visitorId = generateVisitorId();
    
    // 获取现有数据
    const totalVisits = parseInt(localStorage.getItem('total_visits') || '0') + 1;
    const lastVisitDate = localStorage.getItem('last_visit_date');
    const todayVisits = lastVisitDate === today 
      ? parseInt(localStorage.getItem('today_visits') || '0') + 1 
      : 1;
    
    // 获取独立访客数据
    const visitorsData = JSON.parse(localStorage.getItem('unique_visitors') || '[]');
    if (!visitorsData.includes(visitorId)) {
      visitorsData.push(visitorId);
      localStorage.setItem('unique_visitors', JSON.stringify(visitorsData));
    }
    
    // 更新localStorage
    localStorage.setItem('total_visits', totalVisits.toString());
    localStorage.setItem('today_visits', todayVisits.toString());
    localStorage.setItem('last_visit_date', today);
    localStorage.setItem('last_visit_time', new Date().toISOString());
    
    // 更新状态
    setVisitorData({
      totalVisits,
      uniqueVisitors: visitorsData.length,
      todayVisits,
      lastVisit: new Date().toLocaleString('zh-CN')
    });
  };

  /**
   * 加载访客统计数据
   */
  const loadVisitorStats = () => {
    const today = getTodayString();
    const lastVisitDate = localStorage.getItem('last_visit_date');
    
    const totalVisits = parseInt(localStorage.getItem('total_visits') || '0');
    const todayVisits = lastVisitDate === today 
      ? parseInt(localStorage.getItem('today_visits') || '0') 
      : 0;
    const uniqueVisitors = JSON.parse(localStorage.getItem('unique_visitors') || '[]').length;
    const lastVisit = localStorage.getItem('last_visit_time') 
      ? new Date(localStorage.getItem('last_visit_time')!).toLocaleString('zh-CN')
      : '';
    
    setVisitorData({
      totalVisits,
      uniqueVisitors,
      todayVisits,
      lastVisit
    });
  };

  useEffect(() => {
    // 延迟加载以避免服务端渲染问题
    const timer = setTimeout(() => {
      loadVisitorStats();
      updateVisitorStats();
      setIsVisible(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-lg shadow-lg p-4 text-sm z-50">
      <div className="flex items-center gap-2 mb-2">
        <Eye className="w-4 h-4 text-blue-500" />
        <span className="font-semibold text-gray-700">访客统计</span>
      </div>
      
      <div className="space-y-1 text-gray-600">
        <div className="flex items-center gap-2">
          <Users className="w-3 h-3" />
          <span>总访问: {visitorData.totalVisits}</span>
        </div>
        
        <div className="flex items-center gap-2">
          <Users className="w-3 h-3" />
          <span>独立访客: {visitorData.uniqueVisitors}</span>
        </div>
        
        <div className="flex items-center gap-2">
          <Calendar className="w-3 h-3" />
          <span>今日访问: {visitorData.todayVisits}</span>
        </div>
        
        {visitorData.lastVisit && (
          <div className="text-xs text-gray-500 mt-2 pt-2 border-t border-gray-200">
            最后访问: {visitorData.lastVisit}
          </div>
        )}
      </div>
    </div>
  );
}