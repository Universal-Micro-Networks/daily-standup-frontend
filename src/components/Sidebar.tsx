import React, { useState } from 'react';

type PageType = 'dashboard' | 'daily-report';

interface SidebarProps {
  isOpen?: boolean;
  onToggle?: () => void;
  currentPage?: PageType;
  onPageChange?: (page: PageType) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  isOpen = true,
  onToggle,
  currentPage = 'dashboard',
  onPageChange
}) => {
  const today = new Date();
  const [selectedDate, setSelectedDate] = useState(today);
  const [showCalendar, setShowCalendar] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'ダッシュボード', icon: '📊' },
    { id: 'daily-report', label: 'デイリーレポート', icon: '📝' },
  ];

  const handleMenuClick = (pageId: string) => {
    if (onPageChange && (pageId === 'dashboard' || pageId === 'daily-report')) {
      onPageChange(pageId as PageType);
    }
  };

  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const weekdays = ['日', '月', '火', '水', '木', '金', '土'];
    const weekday = weekdays[date.getDay()];
    return { year, month, day, weekday };
  };

  const generateCalendarDays = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const days = [];
    const currentDate = new Date(startDate);

    for (let i = 0; i < 42; i++) {
      days.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return days;
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setShowCalendar(false);
  };

  const handlePrevMonth = () => {
    const newDate = new Date(selectedDate);
    newDate.setMonth(newDate.getMonth() - 1);
    setSelectedDate(newDate);
  };

  const handleNextMonth = () => {
    const newDate = new Date(selectedDate);
    newDate.setMonth(newDate.getMonth() + 1);
    setSelectedDate(newDate);
  };

  const { year, month, day, weekday } = formatDate(selectedDate);
  const calendarDays = generateCalendarDays(selectedDate);

  return (
    <div className={`
      h-full mac-sidebar shadow-lg
      transition-all duration-300 ease-in-out
      ${isOpen ? 'w-64' : 'w-0 overflow-hidden'}
    `}>
      <div className="flex flex-col h-full">
        {/* ヘッダー */}
        <div className="flex items-center px-6 py-1 border-b border-gray-200/50 h-15 pt-2">
          {isOpen && (
            <h1 className="text-2xl font-semibold text-gray-800 mac-text-shadow">Daily Standup</h1>
          )}
        </div>

        {/* メニューアイテム */}
        {isOpen && (
          <nav className="flex-1 p-6 mac-scrollbar">
            {/* カレンダー */}
            <div className="mb-6 mac-card p-6 min-h-[160px]">
              <div
                className="text-center relative cursor-pointer"
                onClick={() => setShowCalendar(!showCalendar)}
              >
                <div className="text-lg font-semibold text-gray-600 mb-4">{year}年{month}月</div>
                <div className="text-3xl font-bold text-gray-800 hover:text-blue-600 transition-colors mb-2">
                  {day}
                </div>
                <div className="text-sm text-gray-500">{weekday}曜日</div>

                {/* 月カレンダー */}
                {showCalendar && (
                  <div className="absolute top-full left-0 right-0 mt-2 z-50 bg-white border border-gray-300 rounded-lg shadow-lg p-3">
                    {/* カレンダーヘッダー */}
                    <div className="flex items-center justify-between mb-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePrevMonth();
                        }}
                        className="p-1 hover:bg-gray-100 rounded transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                      <span className="text-sm font-medium">{year}年{month}月</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleNextMonth();
                        }}
                        className="p-1 hover:bg-gray-100 rounded transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>

                    {/* 曜日ヘッダー */}
                    <div className="grid grid-cols-7 gap-1 mb-2">
                      {['日', '月', '火', '水', '木', '金', '土'].map((dayName) => (
                        <div key={dayName} className="text-xs text-gray-500 text-center p-1">
                          {dayName}
                        </div>
                      ))}
                    </div>

                    {/* カレンダーグリッド */}
                    <div className="grid grid-cols-7 gap-1">
                      {calendarDays.map((date, index) => {
                        const isCurrentMonth = date.getMonth() === selectedDate.getMonth();
                        const isSelected = date.toDateString() === selectedDate.toDateString();
                        const isToday = date.toDateString() === today.toDateString();

                        return (
                          <button
                            key={index}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDateSelect(date);
                            }}
                            className={`
                              text-xs p-1 rounded transition-colors
                              ${isCurrentMonth ? 'text-gray-800' : 'text-gray-400'}
                              ${isSelected ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'}
                              ${isToday && !isSelected ? 'bg-blue-100 text-blue-600' : ''}
                            `}
                          >
                            {date.getDate()}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <ul className="space-y-2">
              {menuItems.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => handleMenuClick(item.id)}
                    className={`w-full flex items-center px-3 py-2 text-left rounded-lg transition-all duration-200 mac-button ${
                      currentPage === item.id
                        ? 'bg-blue-100 text-blue-700 border border-blue-200'
                        : 'text-gray-700 hover:bg-blue-50/80 hover:text-blue-600'
                    }`}
                  >
                    <span className="mr-3 text-lg">{item.icon}</span>
                    <span className="font-medium">{item.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        )}

        {/* 空のコンテンツエリア */}
        <div className="flex-1"></div>

        {/* 設定とヘルプボタン */}
        {isOpen && (
          <div className="p-4 border-t border-gray-200/50">
            <ul className="space-y-2">
              <li>
                <button className="w-full flex items-center px-3 py-2 text-left rounded-lg transition-all duration-200 mac-button text-gray-700 hover:bg-blue-50/80 hover:text-blue-600">
                  <span className="mr-3 text-lg">⚙️</span>
                  <span className="font-medium">設定</span>
                </button>
              </li>
              <li>
                <button className="w-full flex items-center px-3 py-2 text-left rounded-lg transition-all duration-200 mac-button text-gray-700 hover:bg-blue-50/80 hover:text-blue-600">
                  <span className="mr-3 text-lg">❓</span>
                  <span className="font-medium">ヘルプ</span>
                </button>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
