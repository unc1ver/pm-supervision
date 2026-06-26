/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ViewType, User } from '../types';
import {
  LayoutDashboard,
  Eye,
  GitBranch,
  Database,
  Plus,
  HelpCircle,
  LogOut,
  Cpu,
  UserCheck
} from 'lucide-react';

interface SidebarProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
  currentUser: User;
  onLogout: () => void;
  onQuickAnalysis: () => void;
}

export default function Sidebar({
  currentView,
  onViewChange,
  currentUser,
  onLogout,
  onQuickAnalysis
}: SidebarProps) {
  const menuItems = [
    {
      id: 'dashboard' as ViewType,
      label: '全局数据概览',
      icon: LayoutDashboard,
      desc: '数据中心'
    },
    {
      id: 'inspection' as ViewType,
      label: '地区巡检管理',
      icon: Eye,
      desc: '地区巡检'
    },
    {
      id: 'dataCenter' as ViewType,
      label: '数据监察中心',
      icon: Database,
      desc: '数据监察'
    },
    {
      id: 'org' as ViewType,
      label: '组织架构管理',
      icon: GitBranch,
      desc: '组织架构'
    }
  ];

  return (
    <aside className="fixed left-0 top-16 h-[calc(100vh-64px)] w-64 bg-surface-lowest border-r border-outline-variant/10 flex flex-col p-4 z-40 select-none">
      {/* Superuser Status Box */}
      <div className="flex items-center gap-3 mb-6 p-3 rounded-xl bg-surface-low border border-outline-variant/5">
        <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center border border-primary/15 relative">
          <div className="absolute inset-0 bg-primary/5 rounded-xl animate-pulse"></div>
          <UserCheck className="w-5 h-5 text-primary" />
        </div>
        <div>
          <p className="text-xs font-bold text-on-surface font-sans uppercase tracking-wide">
            {currentUser.name}
          </p>
          <p className="text-[10px] font-mono font-semibold text-primary uppercase tracking-widest mt-0.5">
            {currentUser.role}
          </p>
        </div>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 space-y-1.5">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-left transition-all duration-200 cursor-pointer relative group ${
                isActive
                  ? 'bg-primary/10 text-primary border-l-4 border-primary font-semibold'
                  : 'text-on-surface-variant hover:bg-surface-high/30 hover:text-on-surface'
              }`}
            >
              {/* Active Indicator bar */}
              {isActive && (
                <div className="absolute right-3 w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              )}
              <Icon className={`w-[18px] h-[18px] transition-transform duration-200 group-hover:scale-105 ${
                isActive ? 'text-primary' : 'text-on-surface-variant/70'
              }`} />
              <div className="flex flex-col">
                <span className="text-xs font-bold leading-none">{item.label}</span>
                <span className="text-[9px] font-mono text-on-surface-variant/40 mt-1 uppercase tracking-wider">
                  {item.desc}
                </span>
              </div>
            </button>
          );
        })}
      </nav>

      {/* Auxiliary Controls & Footer */}
      <div className="mt-auto pt-4 border-t border-outline-variant/10 space-y-4">
        {/* Quick Action Button */}
        <button
          onClick={onQuickAnalysis}
          className="w-full py-2.5 bg-primary hover:brightness-110 text-on-primary font-bold text-xs rounded-lg flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-md shadow-primary/10 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span className="font-mono uppercase tracking-wider">新增分析</span>
        </button>

        {/* Support & Logout */}
        <div className="space-y-1">
          <button
            onClick={() => alert('请联系系统支持邮箱：support@groupintel.hq 或查阅管理员手册。')}
            className="w-full flex items-center gap-3 px-4 py-2 text-on-surface-variant/70 hover:bg-surface-high/30 hover:text-on-surface rounded-lg transition-all text-[11px] font-medium font-sans text-left cursor-pointer"
          >
            <HelpCircle className="w-4 h-4 text-on-surface-variant/40" />
            <span>帮助中心</span>
          </button>
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-2 text-error/70 hover:bg-error-container/5 hover:text-error rounded-lg transition-all text-[11px] font-bold font-sans text-left cursor-pointer"
          >
            <LogOut className="w-4 h-4 text-error/50" />
            <span>退出系统</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
