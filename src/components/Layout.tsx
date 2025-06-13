import React, { useState } from 'react';
import DailyReport from './DailyReport';
import Dashboard from './Dashboard';
import Sidebar from './Sidebar';

type PageType = 'dashboard' | 'daily-report';

interface LayoutProps {
  onLogout?: () => void;
  user?: any;
}

const Layout: React.FC<LayoutProps> = ({ onLogout, user }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentPage, setCurrentPage] = useState<PageType>('daily-report');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handlePageChange = (page: PageType) => {
    setCurrentPage(page);
  };

  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar
        isOpen={sidebarOpen}
        onToggle={toggleSidebar}
        currentPage={currentPage}
        onPageChange={handlePageChange}
        onLogout={onLogout}
        user={user}
        selectedDate={selectedDate}
        onDateChange={handleDateChange}
      />
      <div className="flex-1 flex flex-col min-w-0">
        {currentPage === 'dashboard' ? (
          <Dashboard sidebarOpen={sidebarOpen} onToggleSidebar={toggleSidebar} />
        ) : (
          <DailyReport
            sidebarOpen={sidebarOpen}
            onToggleSidebar={toggleSidebar}
            selectedDate={selectedDate}
          />
        )}
      </div>
    </div>
  );
};

export default Layout;
