import { Layout as AntLayout, ConfigProvider } from 'antd';
import { Outlet } from "react-router-dom";
import Sidebar from './Sidebar';
import Header from './Header';
import { useState } from 'react';
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { getThemeConfig } from '../theme/config';

const { Content } = AntLayout;

const Layout = () => {
  const [darkMode, setDarkMode] = useState(false);
  const toggleDarkMode = () => { setDarkMode(!darkMode) };
  const [client] = useState(new QueryClient());
  const isFixed = localStorage.getItem('isHeaderFixed') === 'true';

  return (
    <ConfigProvider theme={getThemeConfig()}>
      <QueryClientProvider client={client}>
        <div className={darkMode ? 'dark' : ''}>
          <AntLayout className="min-h-screen">
            <Sidebar />
            <AntLayout>
              <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} isFixed={isFixed} />
              <Content className={`p-4 sm:ml-64 ${isFixed ? 'mt-16' : ''}`}>
                <Outlet />
              </Content>
            </AntLayout>
          </AntLayout>
        </div>
      </QueryClientProvider>
    </ConfigProvider>
  );
};

export default Layout;