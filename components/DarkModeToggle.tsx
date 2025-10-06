
import React from 'react';

interface DarkModeToggleProps {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const DarkModeToggle: React.FC<DarkModeToggleProps> = ({ isDarkMode, toggleDarkMode }) => {
  return (
    <label htmlFor="darkModeToggle" className="flex items-center cursor-pointer" title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}>
      <div className="relative">
        <input
          type="checkbox"
          id="darkModeToggle"
          className="sr-only peer"
          checked={isDarkMode}
          onChange={toggleDarkMode}
          aria-label="Dark mode toggle"
        />
        <div className="block bg-gray-300 dark:bg-gray-600 w-14 h-8 rounded-full"></div>
        <div className="absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform peer-checked:translate-x-full duration-300 ease-in-out flex items-center justify-center">
          {/* Sun Icon */}
          <svg
            className={`w-4 h-4 text-yellow-500 transition-opacity duration-300 ${isDarkMode ? 'opacity-0' : 'opacity-100'}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
            ></path>
          </svg>
          {/* Moon Icon */}
           <svg
            className={`w-4 h-4 text-gray-500 absolute transition-opacity duration-300 ${isDarkMode ? 'opacity-100' : 'opacity-0'}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
            ></path>
          </svg>
        </div>
      </div>
    </label>
  );
};

export default DarkModeToggle;
