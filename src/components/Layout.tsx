import React, { useState } from 'react';
import Configuration from './Configuration';
import DailyReport from './DailyReport';
import Dashboard from './Dashboard';
import Sidebar from './Sidebar';
import Team from './Team';

type PageType = 'dashboard' | 'daily-report' | 'team';

interface LayoutProps {
  onLogout?: () => void;
  user?: any;
  initialSidebarOpen?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ onLogout, user, initialSidebarOpen = true }) => {
  const [sidebarOpen, setSidebarOpen] = useState(initialSidebarOpen);
  const [currentPage, setCurrentPage] = useState<PageType>('daily-report');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showSettings, setShowSettings] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handlePageChange = (page: PageType) => {
    setCurrentPage(page);
  };

  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
  };

  const handleOpenSettings = () => {
    setShowSettings(true);
  };

  const handleCloseSettings = () => {
    setShowSettings(false);
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard sidebarOpen={sidebarOpen} onToggleSidebar={toggleSidebar} />;
      case 'team':
        return <Team sidebarOpen={sidebarOpen} onToggleSidebar={toggleSidebar} />;
      case 'daily-report':
      default:
        return (
          <DailyReport
            sidebarOpen={sidebarOpen}
            onToggleSidebar={toggleSidebar}
            selectedDate={selectedDate}
          />
        );
    }
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
        onOpenSettings={handleOpenSettings}
      />
      <div className="flex-1 flex flex-col min-w-0">
        {renderCurrentPage()}
      </div>

      {/* 設定画面 */}
      {showSettings && (
        <Configuration onClose={handleCloseSettings} />
      )}
    </div>
  );
};

export default Layout;
