/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import {
  Activity,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  Maximize2,
  ZoomIn,
  ZoomOut,
  MapPin,
  MoreHorizontal,
  AlertOctagon,
  ShieldCheck,
  Zap,
  CheckCircle,
  Clock,
  Briefcase
} from 'lucide-react';
import { AlertItem } from '../types';

interface DashboardProps {
  alerts: AlertItem[];
  onDismissAlert: (id: string) => void;
  onDeployTeam: (id: string) => void;
  onSearchQuery: string;
}

export default function DashboardOverview({
  alerts,
  onDismissAlert,
  onDeployTeam,
  onSearchQuery
}: DashboardProps) {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [hoveredPin, setHoveredPin] = useState<string | null>(null);

  // Map Pins Configuration
  const mapPins = [
    { id: 'pin-1', name: '华北中心枢纽', x: '35%', y: '28%', projects: 142, status: '最佳', type: 'success' },
    { id: 'pin-2', name: '华东运营中心', x: '68%', y: '45%', projects: 289, status: '预警', type: 'warning' },
    { id: 'pin-3', name: '华南安全节点', x: '52%', y: '72%', projects: 198, status: '异常', type: 'critical' },
    { id: 'pin-4', name: '西北控制中心', x: '22%', y: '50%', projects: 85, status: '稳定', type: 'success' }
  ];

  // Map tools zoom handler
  const handleZoom = (type: 'in' | 'out') => {
    if (type === 'in' && zoomLevel < 2) setZoomLevel((prev) => prev + 0.2);
    if (type === 'out' && zoomLevel > 0.6) setZoomLevel((prev) => prev - 0.2);
  };

  const resetZoom = () => setZoomLevel(1);

  // Search filter alerts
  const filteredAlerts = alerts.filter(
    (alert) =>
      alert.title.toLowerCase().includes(onSearchQuery.toLowerCase()) ||
      alert.desc.toLowerCase().includes(onSearchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 font-sans select-none text-on-surface">
      {/* Global Breadcrumb */}
      <div className="flex items-center gap-1.5 text-xs text-on-surface-variant font-mono uppercase tracking-wider">
        <span className="hover:text-primary cursor-pointer transition-colors">集团</span>
        <ChevronRight className="w-3 h-3 text-on-surface-variant/40" />
        <span className="text-on-surface font-semibold">全局概览</span>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Total Projects */}
        <div className="glass-panel p-6 rounded-2xl flex flex-col justify-between relative group overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 filter blur-xl rounded-full group-hover:bg-primary/10 transition-colors"></div>
          <div>
            <div className="flex justify-between items-start mb-4">
              <p className="text-xs font-mono font-bold text-on-surface-variant/60 uppercase tracking-widest">
                项目监管总数 / TOTAL PROJECTS
              </p>
              <span className="w-1.5 h-1.5 rounded-full bg-secondary shadow-sm shadow-secondary" />
            </div>
            <div className="flex items-baseline gap-3">
              <h2 className="text-4xl font-extrabold text-on-surface font-sans tracking-tight">
                1,284
              </h2>
              <span className="text-secondary font-mono text-xs font-bold flex items-center gap-0.5">
                <TrendingUp className="w-3.5 h-3.5" />
                +12%
              </span>
            </div>
          </div>
          <p className="text-[10px] font-mono font-semibold text-on-surface-variant/40 mt-4 uppercase tracking-wider">
            遍布 48 个国家及区域的实时监控节点
          </p>
        </div>

        {/* Card 2: Security Rating */}
        <div className="glass-panel p-6 rounded-2xl flex flex-col justify-between relative group overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-secondary/5 filter blur-xl rounded-full group-hover:bg-secondary/10 transition-colors"></div>
          <div>
            <div className="flex justify-between items-start mb-4">
              <p className="text-xs font-mono font-bold text-on-surface-variant/60 uppercase tracking-widest">
                系统安全评级 / SECURITY RATING
              </p>
              <span className="w-1.5 h-1.5 rounded-full bg-secondary shadow-sm shadow-secondary" />
            </div>
            <div className="flex items-baseline gap-3">
              <h2 className="text-4xl font-extrabold text-on-surface font-sans tracking-tight">
                98.4<span className="text-xl font-medium text-on-surface-variant">%</span>
              </h2>
              <span className="text-secondary font-mono text-xs font-bold flex items-center gap-0.5">
                <TrendingUp className="w-3.5 h-3.5" />
                +0.4%
              </span>
            </div>
          </div>
          {/* Progress bar container */}
          <div className="mt-4 w-full h-1.5 bg-surface-lowest rounded-full overflow-hidden border border-outline-variant/10">
            <div
              className="h-full bg-secondary rounded-full transition-all duration-1000"
              style={{ width: '98.4%' }}
            ></div>
          </div>
        </div>

        {/* Card 3: Compliance Rate */}
        <div className="glass-panel p-6 rounded-2xl flex flex-col justify-between relative group overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-tertiary/5 filter blur-xl rounded-full group-hover:bg-tertiary/10 transition-colors"></div>
          <div>
            <div className="flex justify-between items-start mb-4">
              <p className="text-xs font-mono font-bold text-on-surface-variant/60 uppercase tracking-widest">
                合规达标率 / COMPLIANCE RATE
              </p>
              <span className="w-1.5 h-1.5 rounded-full bg-tertiary shadow-sm shadow-tertiary" />
            </div>
            <div className="flex items-baseline gap-3">
              <h2 className="text-4xl font-extrabold text-on-surface font-sans tracking-tight">
                92.1<span className="text-xl font-medium text-on-surface-variant">%</span>
              </h2>
              <span className="text-tertiary font-mono text-xs font-bold flex items-center gap-0.5">
                <TrendingDown className="w-3.5 h-3.5" />
                -1.2%
              </span>
            </div>
          </div>
          <p className="text-[10px] font-mono font-semibold text-tertiary/80 mt-4 uppercase tracking-wider flex items-center gap-1">
            <AlertOctagon className="w-3.5 h-3.5" />
            4 个关键合规偏置点急待人工修正
          </p>
        </div>
      </div>

      {/* Main Grid Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left Column: Map & Graphs */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          
          {/* Map Widget */}
          <div className="glass-panel rounded-2xl p-6 flex-1 flex flex-col min-h-[480px] relative overflow-hidden group">
            {/* Overlay titles */}
            <div className="absolute top-6 left-6 z-20 select-none">
              <h3 className="text-lg font-bold text-on-surface flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-primary" />
                全国项目节点分布
              </h3>
              <p className="text-[10px] font-mono font-bold text-on-surface-variant/50 uppercase tracking-widest mt-1">
                实时运行密度与连接链路追踪
              </p>
            </div>

            {/* Simulated High-tech Map Area */}
            <div className="w-full flex-1 flex items-center justify-center relative bg-surface-lowest/40 rounded-xl overflow-hidden mt-10 border border-outline-variant/5">
              {/* Radial scanning pattern behind */}
              <div className="absolute inset-0 bg-[radial-gradient(#18212e_1.5px,transparent_1.5px)] bg-[size:16px_16px] opacity-60"></div>
              
              {/* Dynamic Vector schematic map network lines */}
              <div
                className="absolute inset-0 flex items-center justify-center transition-transform duration-300 ease-out"
                style={{ transform: `scale(${zoomLevel})` }}
              >
                {/* SVG network links */}
                <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none">
                  {/* Glowing core paths */}
                  <line x1="22%" y1="50%" x2="35%" y2="28%" stroke="#00a3ff" strokeWidth="1" strokeDasharray="4 2" />
                  <line x1="35%" y1="28%" x2="68%" y2="45%" stroke="#00a3ff" strokeWidth="1" />
                  <line x1="68%" y1="45%" x2="52%" y2="72%" stroke="#ffb4ab" strokeWidth="1" strokeDasharray="3 3" />
                  <line x1="52%" y1="72%" x2="22%" y2="50%" stroke="#e9c400" strokeWidth="1" />
                  <line x1="35%" y1="28%" x2="52%" y2="72%" stroke="#00a3ff" strokeWidth="1.5" />
                  {/* Central focus rings */}
                  <circle cx="48%" cy="48%" r="40" stroke="#00a3ff" strokeWidth="0.5" fill="none" opacity="0.3" strokeDasharray="5 5" />
                  <circle cx="48%" cy="48%" r="100" stroke="#00a3ff" strokeWidth="0.5" fill="none" opacity="0.1" />
                </svg>

                {/* Simulated continents/nodes background blobs */}
                <div className="absolute top-[20%] left-[25%] w-32 h-20 bg-primary/2 rounded-full filter blur-xl"></div>
                <div className="absolute bottom-[20%] left-[45%] w-48 h-32 bg-secondary/2 rounded-full filter blur-xl"></div>

                {/* Pins and hovers */}
                {mapPins.map((pin) => (
                  <div
                    key={pin.id}
                    className="absolute cursor-pointer group/pin"
                    style={{ left: pin.x, top: pin.y }}
                    onMouseEnter={() => setHoveredPin(pin.id)}
                    onMouseLeave={() => setHoveredPin(null)}
                  >
                    {/* Ring animation */}
                    <div className={`w-4 h-4 rounded-full absolute -left-2 -top-2 animate-ping opacity-60 ${
                      pin.type === 'success' ? 'bg-secondary' : pin.type === 'warning' ? 'bg-tertiary' : 'bg-error'
                    }`}></div>
                    
                    {/* Center Core */}
                    <div className={`w-3.5 h-3.5 rounded-full relative z-10 border-2 border-surface-lowest shadow-md ${
                      pin.type === 'success' ? 'bg-secondary' : pin.type === 'warning' ? 'bg-tertiary' : 'bg-error'
                    }`}></div>

                    {/* Styled Floating Tooltip for hover */}
                    {(hoveredPin === pin.id || hoveredPin === null && pin.id === 'pin-1') && (
                      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-48 bg-surface-container border border-outline-variant/30 p-3.5 rounded-xl shadow-2xl z-30 animate-in fade-in slide-in-from-bottom-2 duration-200">
                        <p className="text-xs font-bold text-on-surface mb-1 flex items-center justify-between">
                          <span>{pin.name}</span>
                          <span className={`w-2 h-2 rounded-full ${
                            pin.type === 'success' ? 'bg-secondary' : pin.type === 'warning' ? 'bg-tertiary' : 'bg-error'
                          }`}></span>
                        </p>
                        <div className="w-full h-[1px] bg-outline-variant/20 my-1.5"></div>
                        <div className="space-y-1 font-mono text-[10px]">
                          <div className="flex justify-between">
                            <span className="text-on-surface-variant/60 uppercase">监控节点数</span>
                            <span className="text-on-surface font-bold">{pin.projects}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-on-surface-variant/60 uppercase">区域合规状态</span>
                            <span className={`font-bold ${
                              pin.type === 'success' ? 'text-secondary' : pin.type === 'warning' ? 'text-tertiary' : 'text-error'
                            }`}>{pin.status}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Map Action Controls */}
            <div className="absolute bottom-6 left-6 z-20 flex gap-2">
              <button
                onClick={() => handleZoom('in')}
                className="w-10 h-10 bg-surface-low border border-outline-variant/10 hover:border-primary/30 rounded-xl flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors shadow-sm focus:outline-none cursor-pointer"
                title="放大"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleZoom('out')}
                className="w-10 h-10 bg-surface-low border border-outline-variant/10 hover:border-primary/30 rounded-xl flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors shadow-sm focus:outline-none cursor-pointer"
                title="缩小"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <button
                onClick={resetZoom}
                className="w-10 h-10 bg-surface-low border border-outline-variant/10 hover:border-primary/30 rounded-xl flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors shadow-sm focus:outline-none cursor-pointer text-xs font-mono font-bold"
                title="重置"
              >
                1:1
              </button>
            </div>
          </div>

          {/* Bottom Row: Charts Area */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Bar Chart: Compliance Trends */}
            <div className="glass-panel p-6 rounded-2xl flex flex-col justify-between">
              <div className="flex justify-between items-center mb-6">
                <h4 className="text-xs font-mono font-bold text-on-surface-variant uppercase tracking-widest">
                  区域合规对比 / REGIONAL COMPLIANCE
                </h4>
                <MoreHorizontal className="w-4 h-4 text-on-surface-variant/40" />
              </div>

              {/* Responsive custom-built bars */}
              <div className="flex items-end justify-between h-36 gap-4 select-none">
                {/* Bar 1 */}
                <div className="flex-1 flex flex-col items-center gap-2 group cursor-pointer">
                  <div className="w-full bg-outline-variant/10 rounded-lg h-[65%] flex flex-col justify-end overflow-hidden group-hover:bg-outline-variant/20 transition-colors">
                    <div className="w-full bg-primary/40 h-full transition-all group-hover:bg-primary/60"></div>
                  </div>
                  <span className="text-[10px] text-on-surface-variant font-semibold">华北</span>
                </div>
                {/* Bar 2 */}
                <div className="flex-1 flex flex-col items-center gap-2 group cursor-pointer">
                  <div className="w-full bg-outline-variant/10 rounded-lg h-[92%] flex flex-col justify-end overflow-hidden group-hover:bg-outline-variant/20 transition-colors">
                    <div className="w-full bg-primary/40 h-full transition-all group-hover:bg-primary/60"></div>
                  </div>
                  <span className="text-[10px] text-on-surface-variant font-semibold">华东</span>
                </div>
                {/* Bar 3 */}
                <div className="flex-1 flex flex-col items-center gap-2 group cursor-pointer">
                  <div className="w-full bg-outline-variant/10 rounded-lg h-[75%] flex flex-col justify-end overflow-hidden group-hover:bg-outline-variant/20 transition-colors">
                    <div className="w-full bg-primary/40 h-full transition-all group-hover:bg-primary/60"></div>
                  </div>
                  <span className="text-[10px] text-on-surface-variant font-semibold">华南</span>
                </div>
                {/* Bar 4 */}
                <div className="flex-1 flex flex-col items-center gap-2 group cursor-pointer">
                  <div className="w-full bg-outline-variant/10 rounded-lg h-[58%] flex flex-col justify-end overflow-hidden group-hover:bg-outline-variant/20 transition-colors">
                    <div className="w-full bg-primary/40 h-full transition-all group-hover:bg-primary/60"></div>
                  </div>
                  <span className="text-[10px] text-on-surface-variant font-semibold">西北</span>
                </div>
                {/* Bar 5 */}
                <div className="flex-1 flex flex-col items-center gap-2 group cursor-pointer">
                  <div className="w-full bg-primary/20 rounded-lg h-[98%] flex flex-col justify-end overflow-hidden border border-primary/20 transition-all shadow-lg shadow-primary/5">
                    <div className="w-full bg-primary h-full"></div>
                  </div>
                  <span className="text-[10px] text-primary font-bold">总部</span>
                </div>
              </div>
            </div>

            {/* Donut Chart: Event Type Distribution */}
            <div className="glass-panel p-6 rounded-2xl flex flex-col justify-between">
              <div className="flex justify-between items-center mb-6">
                <h4 className="text-xs font-mono font-bold text-on-surface-variant uppercase tracking-widest">
                  事件风险分布 / RISK TYPE RATIOS
                </h4>
                <MoreHorizontal className="w-4 h-4 text-on-surface-variant/40" />
              </div>

              {/* Donut Layout */}
              <div className="flex items-center gap-6 h-36">
                <div className="relative w-28 h-28 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    {/* Background Circle */}
                    <circle cx="18" cy="18" r="15.9155" fill="none" stroke="#1c2026" strokeWidth="3" />
                    {/* Emerald Success Segment (70%) */}
                    <circle cx="18" cy="18" r="15.9155" fill="none" stroke="#7dffa2" strokeWidth="3.2" strokeDasharray="70 100" strokeDashoffset="0" strokeLinecap="round" />
                    {/* Amber Warning Segment (20%) */}
                    <circle cx="18" cy="18" r="15.9155" fill="none" stroke="#e9c400" strokeWidth="3.2" strokeDasharray="20 100" strokeDashoffset="-70" strokeLinecap="round" />
                    {/* Crimson Error Segment (10%) */}
                    <circle cx="18" cy="18" r="15.9155" fill="none" stroke="#ffb4ab" strokeWidth="3.2" strokeDasharray="10 100" strokeDashoffset="-90" strokeLinecap="round" />
                  </svg>
                  <div className="absolute flex flex-col items-center justify-center select-none text-center">
                    <span className="text-xl font-extrabold text-on-surface leading-none">124</span>
                    <span className="text-[8px] font-mono font-bold text-on-surface-variant/40 uppercase tracking-widest mt-1">
                      事件总数
                    </span>
                  </div>
                </div>

                {/* Legend columns */}
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between text-[11px]">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-secondary"></span>
                      <span className="text-on-surface-variant">低风险指标</span>
                    </div>
                    <span className="font-mono font-bold text-on-surface">70%</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-tertiary"></span>
                      <span className="text-on-surface-variant">中等合规偏差</span>
                    </div>
                    <span className="font-mono font-bold text-on-surface">20%</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-error"></span>
                      <span className="text-on-surface-variant">高危风险告警</span>
                    </div>
                    <span className="font-mono font-bold text-on-surface">10%</span>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* Right Column: Live Alert Feed */}
        <div className="lg:col-span-4 flex flex-col">
          <div className="glass-panel flex-1 flex flex-col h-full rounded-2xl overflow-hidden">
            {/* Header */}
            <div className="p-5 border-b border-outline-variant/10 flex justify-between items-center bg-surface-lowest/40">
              <div>
                <h3 className="text-sm font-bold text-on-surface flex items-center gap-2">
                  <Zap className="w-4 h-4 text-error animate-pulse" />
                  实时告警动态
                </h3>
                <p className="text-[9px] font-mono font-semibold text-on-surface-variant/40 uppercase tracking-widest mt-1">
                  全系统监控异常流 (REAL-TIME FEED)
                </p>
              </div>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-error opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-error"></span>
              </span>
            </div>

            {/* Alerts List Container */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[580px] custom-scrollbar">
              {filteredAlerts.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 text-on-surface-variant/30">
                  <CheckCircle className="w-8 h-8 mb-2 opacity-20" />
                  <p className="text-xs">当前系统无未处理告警</p>
                </div>
              ) : (
                filteredAlerts.map((alert) => {
                  const isCritical = alert.type === 'critical';
                  const isWarning = alert.type === 'warning';
                  const isSystem = alert.type === 'system';

                  return (
                    <div
                      key={alert.id}
                      className={`p-4 rounded-xl border transition-all duration-200 relative group ${
                        isCritical
                          ? 'bg-error-container/10 border-error/15'
                          : isWarning
                          ? 'bg-tertiary-container/5 border-tertiary/15'
                          : 'bg-surface-low/60 border-outline-variant/5'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2.5">
                        <span className={`text-[9px] font-mono font-extrabold px-1.5 py-0.5 rounded uppercase tracking-wider ${
                          isCritical
                            ? 'bg-error text-on-error'
                            : isWarning
                            ? 'bg-tertiary text-on-tertiary'
                            : isSystem
                            ? 'bg-primary/20 text-primary'
                            : 'bg-secondary/20 text-secondary'
                        }`}>
                          {isCritical ? '紧急' : isWarning ? '预警' : isSystem ? '系统更新' : '合规确认'}
                        </span>
                        <span className="text-[9px] font-mono text-on-surface-variant/40 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {alert.time}
                        </span>
                      </div>

                      <h4 className="text-xs font-bold text-on-surface mb-1 leading-tight">
                        {alert.title}
                      </h4>
                      <p className="text-[11px] text-on-surface-variant/70 leading-relaxed">
                        {alert.desc}
                      </p>

                      {/* Action buttons inside alert item */}
                      <div className="flex gap-2 mt-4 opacity-80 group-hover:opacity-100 transition-opacity">
                        {isCritical && (
                          <button
                            onClick={() => onDeployTeam(alert.id)}
                            className="px-2.5 py-1 bg-error hover:brightness-110 text-on-error text-[10px] font-bold rounded cursor-pointer transition-all"
                          >
                            部署团队
                          </button>
                        )}
                        <button
                          onClick={() => onDismissAlert(alert.id)}
                          className={`px-2.5 py-1 text-[10px] font-bold rounded cursor-pointer border transition-all ${
                            isCritical
                              ? 'bg-surface-low border-error/20 text-error hover:bg-error-container/20'
                              : 'bg-surface-low border-outline-variant/25 text-on-surface-variant hover:border-on-surface-variant hover:text-on-surface'
                          }`}
                        >
                          已知悉
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer view-all */}
            <div className="p-4 border-t border-outline-variant/10 bg-surface-lowest/40 text-center">
              <button
                onClick={() => alert(`系统共有 ${alerts.length} 个活动监控项在队列中。`)}
                className="text-[10px] font-bold font-mono text-primary hover:text-primary-container tracking-widest uppercase cursor-pointer"
              >
                查看全部监控动态
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
