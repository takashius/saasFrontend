import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { HomeOutlined, ShoppingOutlined, SettingOutlined } from '@ant-design/icons';
import { useAuth } from '../context/AuthContext';
import { getColorFromLocalStorage } from '../theme/colorPalette';
import { useTranslation } from 'react-i18next';

const Sidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [isProductOpen, setIsProductOpen] = useState(false);
  const { t } = useTranslation();
  const { getUser } = useAuth();
  const user: any = getUser();
  const sidebarRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const currentColor = getColorFromLocalStorage();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  const toggleConfigMenu = () => {
    setIsConfigOpen(!isConfigOpen)
  }
  const toggleProductMenu = () => {
    setIsProductOpen(!isProductOpen)
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        setIsSidebarOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const isActive = (path: string) => {
    const currentPath = location.pathname;

    if (currentPath === path) {
      return true
    }

    if (path === '/clients' && currentPath.startsWith('/client/')) {
      return true
    }

    if (path === '/' && currentPath.startsWith('/quotation/')) {
      return true
    }

    return false
  };

  const isSettingsActive = () => {
    return location.pathname.startsWith('/settings')
  };
  const isProductActive = () => {
    return location.pathname.startsWith('/products') || location.pathname.startsWith('/categories')
  };

  useEffect(() => {
    if (isSettingsActive()) {
      setIsConfigOpen(true);
    } else {
      setIsConfigOpen(false);
    }

    if (isProductActive()) {
      setIsProductOpen(true);
    } else {
      setIsProductOpen(false);
    }
  }, [location.pathname]);

  return (
    <div ref={sidebarRef}>
      <button
        onClick={toggleSidebar}
        className={`fixed top-4 left-4 z-50 p-2 bg-white ${currentColor.link} rounded-lg sm:hidden shadow-lg`}
      >
        <svg
          className="w-6 h-6"
          aria-hidden="true"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            clipRule="evenodd"
            fillRule="evenodd"
            d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
          ></path>
        </svg>
      </button>

      <aside
        id="sidebar-multi-level-sidebar"
        className={`fixed top-0 left-0 z-40 w-64 h-screen transition-transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } sm:translate-x-0 mt-16 sm:mt-0`}
        aria-label="Sidebar"
      >
        <div className={`h-full px-3 py-4 overflow-y-auto ${currentColor.bg} dark:bg-gray-800`}>
          <div className="flex items-center justify-center p-4">
            <img src="/logoBlanco.png" alt="Logo" className="h-16" />
          </div>

          <ul className="space-y-2 font-medium">
            <li>
              <Link
                to="/"
                className={`flex items-center p-2 text-white rounded-lg ${currentColor.hover} 
                ${isActive('/') ? currentColor.menuActive : currentColor.bg} 
                ${isActive('/') ? 'dark:bg-gray-700' : 'dark:bg-gray-800'}
                dark:hover:bg-gray-700 group`}
                onClick={() => setIsSidebarOpen(false)}
              >
                <HomeOutlined className="w-5 h-5 text-gray-300 transition duration-75 group-hover:text-white" />
                <span className="ms-3 group-hover:text-white">{t('menu.home')}</span>
              </Link>
            </li>
            <li>
              <button
                type="button"
                className={`flex items-center w-full p-2 text-base text-white transition duration-75 rounded-lg group ${currentColor.hover} 
                ${currentColor.bg} dark:bg-gray-800 dark:hover:bg-gray-700`}
                onClick={toggleProductMenu}
              >
                <ShoppingOutlined className="w-5 h-5 text-gray-300 transition duration-75 group-hover:text-white" />
                <span className="flex-1 ms-3 text-left rtl:text-right whitespace-nowrap">{t('menu.products')}</span>
                <svg
                  className={`w-3 h-3 transition-transform ${isConfigOpen ? 'rotate-180' : ''
                    }`}
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 10 6"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m1 1 4 4 4-4"
                  />
                </svg>
              </button>
              <ul
                id="dropdown-config"
                className={`${isProductOpen ? 'block' : 'hidden'} py-2 space-y-2`}
              >
                <li>
                  <Link
                    to="/products"
                    className={`flex items-center w-full p-2 text-white hover:text-white transition duration-75 rounded-lg pl-11 ${currentColor.hover} 
                    ${isActive('/products') ? currentColor.menuActive : currentColor.bg} 
                    ${isActive('/products') ? 'dark:bg-gray-700' : 'dark:bg-gray-800'}
                    dark:hover:bg-gray-700`}
                    onClick={() => setIsSidebarOpen(false)}
                  >
                    {t('menu.products')}
                  </Link>
                </li>
                <li>
                  <Link
                    to="/categories"
                    className={`flex items-center w-full p-2 text-white hover:text-white transition duration-75 rounded-lg pl-11 ${currentColor.hover} 
                    ${isActive('/categories') ? currentColor.menuActive : currentColor.bg} 
                    ${isActive('/categories') ? 'dark:bg-gray-700' : 'dark:bg-gray-800'}
                    dark:hover:bg-gray-700`}
                    onClick={() => setIsSidebarOpen(false)}
                  >
                    {t('menu.category')}
                  </Link>
                </li>
              </ul>
            </li>
            <li>
              <button
                type="button"
                className={`flex items-center w-full p-2 text-base text-white transition duration-75 rounded-lg group ${currentColor.hover} 
                ${isActive('/settings') ? currentColor.menuActive : currentColor.bg} 
                ${isActive('/settings') ? 'dark:bg-gray-700' : 'dark:bg-gray-800'}
                dark:hover:bg-gray-700`}
                onClick={toggleConfigMenu}
              >
                <SettingOutlined className="w-5 h-5 text-gray-300 transition duration-75 group-hover:text-white" />
                <span className="flex-1 ms-3 text-left rtl:text-right whitespace-nowrap">{t('menu.settings')}</span>
                <svg
                  className={`w-3 h-3 transition-transform ${isConfigOpen ? 'rotate-180' : ''
                    }`}
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 10 6"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m1 1 4 4 4-4"
                  />
                </svg>
              </button>
              <ul
                id="dropdown-config"
                className={`${isConfigOpen ? 'block' : 'hidden'} py-2 space-y-2`}
              >
                <li>
                  <Link
                    to="/settings/general"
                    className={`flex items-center w-full p-2 text-white hover:text-white transition duration-75 rounded-lg pl-11 ${currentColor.hover} 
                    ${isActive('/settings/general') ? currentColor.menuActive : currentColor.bg} 
                    ${isActive('/settings/general') ? 'dark:bg-gray-700' : 'dark:bg-gray-800'}
                    dark:hover:bg-gray-700`}
                    onClick={() => setIsSidebarOpen(false)}
                  >
                    {t('menu.general')}
                  </Link>
                </li>
                <li>
                  <Link
                    to="/settings/pdf"
                    className={`flex items-center w-full p-2 text-white hover:text-white transition duration-75 rounded-lg pl-11 ${currentColor.hover} 
                    ${isActive('/settings/pdf') ? currentColor.menuActive : currentColor.bg} 
                    ${isActive('/settings/pdf') ? 'dark:bg-gray-700' : 'dark:bg-gray-800'}
                    dark:hover:bg-gray-700`}
                    onClick={() => setIsSidebarOpen(false)}
                  >
                    {t('menu.pdf')}
                  </Link>
                </li>
                <li>
                  <Link
                    to="/settings/email"
                    className={`flex items-center w-full p-2 text-white hover:text-white transition duration-75 rounded-lg pl-11 ${currentColor.hover} 
                    ${isActive('/settings/email') ? currentColor.menuActive : currentColor.bg} 
                    ${isActive('/settings/email') ? 'dark:bg-gray-700' : 'dark:bg-gray-800'}
                    dark:hover:bg-gray-700`}
                    onClick={() => setIsSidebarOpen(false)}
                  >
                    {t('menu.email')}
                  </Link>
                </li>
                {user?._id === '64fbe61071af3ad203dba8b8' && (
                  <li>
                    <Link
                      to="/settings/company"
                      className={`flex items-center w-full p-2 text-white hover:text-white transition duration-75 rounded-lg pl-11 ${currentColor.hover} 
                      ${isActive('/settings/company') ? currentColor.menuActive : currentColor.bg}
                      ${isActive('/settings/company') ? 'dark:bg-gray-700' : 'dark:bg-gray-800'}
                       dark:hover:bg-gray-700`}
                      onClick={() => setIsSidebarOpen(false)}
                    >
                      {t('menu.changeCompany')}
                    </Link>
                  </li>
                )}
              </ul>
            </li>
          </ul>
        </div>
      </aside>
    </div>
  );
};

export default Sidebar;