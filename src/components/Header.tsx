/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Search, Bell, Settings, ShieldCheck } from 'lucide-react';
import { User } from '../types';

interface HeaderProps {
  currentUser: User;
  onNotificationClick: () => void;
  onSettingsClick: () => void;
  onSearch: (query: string) => void;
  currentLevel: 'group' | 'region' | 'project';
  onLevelChange: (level: 'group' | 'region' | 'project') => void;
}

export default function Header({
  currentUser,
  onNotificationClick,
  onSettingsClick,
  onSearch,
  currentLevel,
  onLevelChange
}: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchQuery(val);
    onSearch(val);
  };

  return (
    <header className="fixed top-0 w-full z-50 flex justify-between items-center px-10 h-16 bg-surface-lowest/80 backdrop-blur-xl border-b border-outline-variant/10 shadow-sm">
      {/* Brand Section */}
      <div className="flex items-center gap-8 select-none">
        <div className="flex items-center gap-2 cursor-pointer group">
          <ShieldCheck className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
          <span className="font-sans text-lg font-extrabold text-on-surface tracking-tighter">
            集团综合监察系统
          </span>
        </div>

        {/* Global Level Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 h-full pt-1">
          <button
            onClick={() => onLevelChange('group')}
            className={`text-xs font-bold pb-1 cursor-pointer transition-all ${
              currentLevel === 'group'
                ? 'text-primary border-b-2 border-primary'
                : 'text-on-surface-variant/70 hover:text-on-surface'
            }`}
          >
            集团总览
          </button>
          <button
            onClick={() => onLevelChange('region')}
            className={`text-xs font-bold pb-1 cursor-pointer transition-all ${
              currentLevel === 'region'
                ? 'text-primary border-b-2 border-primary'
                : 'text-on-surface-variant/70 hover:text-on-surface'
            }`}
          >
            区域中心
          </button>
          <button
            onClick={() => onLevelChange('project')}
            className={`text-xs font-bold pb-1 cursor-pointer transition-all ${
              currentLevel === 'project'
                ? 'text-primary border-b-2 border-primary'
                : 'text-on-surface-variant/70 hover:text-on-surface'
            }`}
          >
            项目管理
          </button>
        </nav>
      </div>

      {/* Right Controls Area */}
      <div className="flex items-center gap-5">
        {/* Unified Search Input */}
        <div className="relative hidden sm:flex items-center bg-surface-low border border-outline-variant/10 rounded-full px-4 py-1.5 focus-within:border-primary/40 focus-within:ring-2 focus-within:ring-primary/10 transition-all">
          <Search className="w-4 h-4 text-on-surface-variant/40" />
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="搜索系统、指标、地区..."
            className="bg-transparent border-none focus:ring-0 text-xs text-on-surface placeholder:text-on-surface-variant/30 w-48 outline-none ml-2"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          {/* Notifications Button */}
          <button
            onClick={onNotificationClick}
            className="w-9 h-9 flex items-center justify-center rounded-xl bg-surface-low border border-outline-variant/5 hover:bg-surface-high/50 transition-colors relative cursor-pointer"
          >
            <Bell className="w-4.5 h-4.5 text-on-surface-variant hover:text-primary transition-colors" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-error rounded-full animate-ping"></span>
            <span className="absolute top-1 right-1 w-2 h-2 bg-error rounded-full"></span>
          </button>

          {/* Settings Button */}
          <button
            onClick={onSettingsClick}
            className="w-9 h-9 flex items-center justify-center rounded-xl bg-surface-low border border-outline-variant/5 hover:bg-surface-high/50 transition-colors cursor-pointer"
          >
            <Settings className="w-4.5 h-4.5 text-on-surface-variant hover:text-primary transition-colors" />
          </button>
        </div>

        {/* User Badge */}
        <div className="w-[1px] h-6 bg-outline-variant/20 hidden sm:block"></div>

        <div className="flex items-center gap-2 select-none">
          <div className="w-8 h-8 rounded-xl overflow-hidden border border-outline-variant/20 bg-surface-low cursor-pointer hover:border-primary/50 transition-colors">
            <img
              src={currentUser.avatar}
              alt="User Profile"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </div>
    </header>
  );
}
