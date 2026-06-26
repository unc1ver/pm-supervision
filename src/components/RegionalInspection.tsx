/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Search,
  Filter,
  Download,
  ChevronRight,
  SlidersHorizontal,
  Plus,
  ArrowLeft,
  Calendar,
  User,
  ShieldAlert,
  Clock,
  CheckCircle,
  HelpCircle,
  CalendarCheck2
} from 'lucide-react';
import { InspectionRecord } from '../types';

interface RegionalProps {
  records: InspectionRecord[];
  onUpdateRecord: (updated: InspectionRecord) => void;
  onSearchQuery: string;
}

export default function RegionalInspection({
  records,
  onUpdateRecord,
  onSearchQuery
}: RegionalProps) {
  const [statusFilter, setStatusFilter] = useState<'all' | 'completed' | 'ongoing' | 'pending'>('all');
  const [selectedRecord, setSelectedRecord] = useState<InspectionRecord | null>(null);
  
  // Appointment modal states
  const [bookingRecord, setBookingRecord] = useState<InspectionRecord | null>(null);
  const [bookDate, setBookDate] = useState('2024-11-20');
  const [inspector, setInspector] = useState('周志华 (高级监察员)');

  // Filter records based on UI state & top-nav search query
  const filteredRecords = records.filter((rec) => {
    const matchesSearch = rec.name.toLowerCase().includes(onSearchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || rec.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Handle schedule submit
  const handleScheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingRecord) return;
    
    // Update the record's state in mock database
    const updated: InspectionRecord = {
      ...bookingRecord,
      status: 'ongoing',
      date: bookDate
    };
    onUpdateRecord(updated);
    setBookingRecord(null);
    alert(`巡检预约成功！已委派监察员 ${inspector} 将于 ${bookDate} 前往 【${bookingRecord.name}】 展开合规复审。`);
  };

  // Simulate Excel Export
  const handleExport = () => {
    alert('正在汇出全国巡检合规总表 (Simulated CSV)... \n文件：Group_Regional_Supervision_2024.csv 已生成。');
  };

  return (
    <div className="space-y-6 font-sans text-on-surface">
      {/* Header Info */}
      <header className="mb-4">
        <h1 className="text-2xl font-bold tracking-tight text-on-surface mb-1">
          地区巡检管理中心
        </h1>
        <p className="text-xs text-on-surface-variant/70 font-sans">
          当前系统监控全国 25 个区域的巡检覆盖与合规性指标。
        </p>
      </header>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Metric 1 */}
        <div className="glass-panel p-6 rounded-2xl flex flex-col justify-between relative group">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-mono font-bold text-on-surface-variant/60 uppercase tracking-wider">
                巡检覆盖进度 / COVERAGE PROGRESS
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-on-surface">84%</span>
              <span className="text-primary font-mono text-xs font-bold">↑ 4%</span>
            </div>
          </div>
          <div className="mt-6 w-full h-1.5 bg-surface-lowest rounded-full overflow-hidden border border-outline-variant/10">
            <div className="h-full bg-primary rounded-full" style={{ width: '84%' }}></div>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="glass-panel p-6 rounded-2xl flex flex-col justify-between relative group">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-mono font-bold text-on-surface-variant/60 uppercase tracking-wider">
                本月已完成巡检 / COMPLETED REGIONS
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-on-surface">
                21<span className="text-lg font-medium text-on-surface-variant/40">/25</span>
              </span>
              <span className="text-on-surface-variant/60 text-xs font-mono ml-1">已达 84.0%</span>
            </div>
          </div>
          {/* Overlapping small avatar-like labels representing completed regions */}
          <div className="mt-6 flex -space-x-2.5">
            <div className="w-7 h-7 rounded-full bg-primary-container/20 border border-primary/20 flex items-center justify-center text-[9px] font-mono font-bold text-primary">
              华东
            </div>
            <div className="w-7 h-7 rounded-full bg-secondary-container/20 border border-secondary/20 flex items-center justify-center text-[9px] font-mono font-bold text-secondary">
              华北
            </div>
            <div className="w-7 h-7 rounded-full bg-tertiary-container/20 border border-tertiary/20 flex items-center justify-center text-[9px] font-mono font-bold text-tertiary">
              华南
            </div>
            <div className="w-7 h-7 rounded-full bg-surface-lowest border border-outline-variant/30 flex items-center justify-center text-[9px] font-mono font-bold text-on-surface-variant">
              +18
            </div>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="glass-panel p-6 rounded-2xl flex flex-col justify-between relative group">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-mono font-bold text-on-surface-variant/60 uppercase tracking-wider">
                发现风险项数 / UNRESOLVED RISKS
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-error" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-error">12</span>
              <span className="text-error/70 text-xs font-mono ml-1">需持续跟进</span>
            </div>
          </div>
          <div className="mt-6">
            <button
              onClick={() => alert('正在加载高风险指标筛选... 全系统共有 12 个风险警告。')}
              className="text-primary hover:text-primary-container text-xs font-bold font-mono tracking-wide flex items-center gap-1 cursor-pointer"
            >
              立即处理区域风险
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>

      {/* Progress Overview Graph Panel */}
      <div className="glass-panel p-6 rounded-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 relative z-10">
          <div>
            <h3 className="text-sm font-bold text-on-surface">全国巡检覆盖全览</h3>
            <p className="text-[10px] text-on-surface-variant/50 font-mono tracking-widest mt-1">
              基于 25 个主要战区巡检周期的实时汇总
            </p>
          </div>
          <div className="text-left md:text-right">
            <span className="text-[9px] font-mono font-bold text-on-surface-variant/40 block mb-1 uppercase tracking-wider">
              当前统计周期
            </span>
            <span className="bg-surface-high/30 px-3.5 py-1.5 rounded-full text-xs font-semibold text-on-surface border border-outline-variant/10">
              2024年 10月 - 11月
            </span>
          </div>
        </div>

        <div className="relative pt-1 z-10 select-none">
          <div className="flex mb-2 items-center justify-between">
            <div>
              <span className="text-[10px] font-bold px-2 py-0.5 uppercase rounded bg-primary/20 text-primary font-mono tracking-wider">
                季度进度详情
              </span>
            </div>
            <div className="text-right">
              <span className="text-xs font-mono font-bold text-primary">84.0%</span>
            </div>
          </div>

          {/* Progress bar nested segments */}
          <div className="overflow-hidden h-3 mb-4 flex rounded-full bg-surface-lowest border border-outline-variant/10">
            <div className="h-full bg-primary rounded-l-full transition-all duration-700" style={{ width: '50%' }} title="已完成"></div>
            <div className="h-full bg-secondary transition-all duration-700" style={{ width: '20%' }} title="进行中"></div>
            <div className="h-full bg-tertiary transition-all duration-700" style={{ width: '14%' }} title="待巡检"></div>
          </div>

          {/* Progress Badges */}
          <div className="flex flex-wrap gap-5 text-xs text-on-surface-variant font-mono">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-primary"></span>
              <span>已完成 (21)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-secondary"></span>
              <span>进行中 (2)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-tertiary"></span>
              <span>待巡检 (2)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Table / Interactive List section */}
      <div className="glass-panel rounded-2xl overflow-hidden">
        {/* Actions header row */}
        <div className="px-6 py-5 border-b border-outline-variant/10 flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-surface-low/30">
          <h3 className="text-sm font-bold text-on-surface">地区巡检详情列表</h3>
          
          <div className="flex flex-wrap items-center gap-3">
            {/* Filter buttons by status */}
            <div className="flex bg-surface-lowest rounded-lg p-1 border border-outline-variant/15">
              {(['all', 'completed', 'ongoing', 'pending'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setStatusFilter(type)}
                  className={`px-3 py-1.5 text-[10px] font-bold font-mono uppercase rounded transition-all cursor-pointer ${
                    statusFilter === type
                      ? 'bg-primary text-on-primary font-bold shadow-sm'
                      : 'text-on-surface-variant/70 hover:text-on-surface'
                  }`}
                >
                  {type === 'all' ? '全部' : type === 'completed' ? '已完成' : type === 'ongoing' ? '进行中' : '待巡检'}
                </button>
              ))}
            </div>

            <button
              onClick={handleExport}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-outline-variant/15 hover:border-primary/40 bg-surface-lowest hover:text-primary transition-all text-[11px] font-bold font-mono uppercase cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              导出报表
            </button>
          </div>
        </div>

        {/* Table representation */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-low/50 border-b border-outline-variant/10">
                <th className="px-6 py-4 text-[10px] font-bold font-mono text-on-surface-variant uppercase tracking-wider">地区名称</th>
                <th className="px-6 py-4 text-[10px] font-bold font-mono text-on-surface-variant uppercase tracking-wider">巡检状态</th>
                <th className="px-6 py-4 text-[10px] font-bold font-mono text-on-surface-variant uppercase tracking-wider">最近巡检日期</th>
                <th className="px-6 py-4 text-[10px] font-bold font-mono text-on-surface-variant uppercase tracking-wider">安全合规得分</th>
                <th className="px-6 py-4 text-[10px] font-bold font-mono text-on-surface-variant uppercase tracking-wider text-right">管理控制</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-10 text-xs text-on-surface-variant/40 font-mono">
                    未找到匹配该巡检状态或关键字的地区记录。
                  </td>
                </tr>
              ) : (
                filteredRecords.map((rec) => {
                  const isCompleted = rec.status === 'completed';
                  const isOngoing = rec.status === 'ongoing';
                  const isPending = rec.status === 'pending';

                  return (
                    <tr key={rec.id} className="hover:bg-surface-lowest/40 transition-colors">
                      <td className="px-6 py-4 font-bold text-xs text-on-surface">{rec.name}</td>
                      <td className="px-6 py-4">
                        <span className={`text-[9px] font-mono font-extrabold px-2 py-0.5 rounded-full border ${
                          isCompleted
                            ? 'bg-secondary/10 border-secondary/20 text-secondary'
                            : isOngoing
                            ? 'bg-primary/10 border-primary/20 text-primary'
                            : 'bg-tertiary/10 border-tertiary/20 text-tertiary animate-pulse'
                        }`}>
                          {isCompleted ? '已完成' : isOngoing ? '进行中' : '待巡检'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-[11px] font-mono text-on-surface-variant/70">
                        {rec.date}
                      </td>
                      <td className="px-6 py-4">
                        {isCompleted && rec.score !== -1 ? (
                          <div className="flex items-center gap-3">
                            <div className="w-16 h-1 bg-surface-lowest rounded-full overflow-hidden border border-outline-variant/10">
                              <div
                                className={`h-full ${
                                  rec.score >= 95 ? 'bg-secondary' : rec.score >= 85 ? 'bg-primary' : 'bg-tertiary'
                                }`}
                                style={{ width: `${rec.score}%` }}
                              ></div>
                            </div>
                            <span className="text-xs font-mono font-extrabold text-on-surface">{rec.score}</span>
                          </div>
                        ) : isOngoing ? (
                          <div className="flex items-center gap-3 text-primary">
                            <Clock className="w-3 h-3 animate-spin" />
                            <span className="text-[10px] font-mono font-bold uppercase tracking-wider">正在复审</span>
                          </div>
                        ) : (
                          <span className="text-xs font-mono text-on-surface-variant/30 font-bold">--</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-3.5">
                          {isPending ? (
                            <button
                              onClick={() => setBookingRecord(rec)}
                              className="text-primary hover:text-primary-container font-mono font-bold text-[10px] uppercase cursor-pointer"
                            >
                              预约巡检
                            </button>
                          ) : (
                            <button
                              onClick={() => setSelectedRecord(rec)}
                              className="text-primary hover:text-primary-container font-mono font-bold text-[10px] uppercase cursor-pointer"
                            >
                              查看详情
                            </button>
                          )}
                          <button
                            onClick={() => alert(`正在导出【${rec.name}】的合规复审鉴定档案.pdf`)}
                            className="text-on-surface-variant/50 hover:text-on-surface cursor-pointer focus:outline-none"
                            title="下载巡检报告"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 bg-surface-low/30 border-t border-outline-variant/10 flex items-center justify-between text-xs text-on-surface-variant/50 font-mono select-none">
          <span>显示 {filteredRecords.length} / 共 {records.length} 个地区</span>
          <div className="flex gap-2">
            <button
              disabled
              className="px-3 py-1 bg-surface-lowest text-on-surface-variant/30 border border-outline-variant/10 rounded font-semibold disabled:opacity-50"
            >
              上一页
            </button>
            <button className="px-3 py-1 bg-primary text-on-primary border border-primary rounded font-semibold">
              1
            </button>
            <button
              disabled
              className="px-3 py-1 bg-surface-lowest text-on-surface-variant/30 border border-outline-variant/10 rounded font-semibold disabled:opacity-50"
            >
              下一页
            </button>
          </div>
        </div>
      </div>

      {/* Appointment Drawer Modal */}
      {bookingRecord && (
        <div className="fixed inset-0 bg-surface-lowest/70 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="glass-panel w-full max-w-[420px] rounded-2xl p-6 relative overflow-hidden">
            <h3 className="text-sm font-bold text-on-surface mb-1 flex items-center gap-2">
              <CalendarCheck2 className="w-4.5 h-4.5 text-primary" />
              预约地区合规巡检
            </h3>
            <p className="text-[10px] text-on-surface-variant/40 font-mono uppercase tracking-widest mb-4">
              向待审区域指派合规监察团队
            </p>

            <form onSubmit={handleScheduleSubmit} className="space-y-4 font-mono text-xs">
              <div className="space-y-1">
                <label className="text-[10px] text-on-surface-variant/60 block uppercase">目标地区</label>
                <div className="p-3 bg-surface-lowest rounded-lg border border-outline-variant/10 text-on-surface font-sans font-bold">
                  {bookingRecord.name}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-on-surface-variant/60 block uppercase" htmlFor="date">拟定检查日期</label>
                <input
                  type="date"
                  id="date"
                  value={bookDate}
                  onChange={(e) => setBookDate(e.target.value)}
                  className="w-full bg-surface-lowest rounded-lg border border-outline-variant/20 px-3 py-2.5 text-on-surface outline-none focus:border-primary focus:ring-1 focus:ring-primary/10"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-on-surface-variant/60 block uppercase" htmlFor="inspector">指派主监察官</label>
                <select
                  id="inspector"
                  value={inspector}
                  onChange={(e) => setInspector(e.target.value)}
                  className="w-full bg-surface-lowest rounded-lg border border-outline-variant/20 px-3 py-2.5 text-on-surface outline-none focus:border-primary focus:ring-1 focus:ring-primary/10"
                >
                  <option value="周志华 (高级监察员)">周志华 (高级监察员)</option>
                  <option value="林海 (系统合规专家)">林海 (系统合规专家)</option>
                  <option value="陈莉 (现场质量官)">陈莉 (现场质量官)</option>
                </select>
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setBookingRecord(null)}
                  className="flex-1 py-2.5 bg-surface-low hover:bg-surface-high/30 border border-outline-variant/20 text-on-surface-variant rounded-lg font-bold uppercase cursor-pointer text-center"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-primary hover:brightness-110 text-on-primary rounded-lg font-bold uppercase cursor-pointer text-center"
                >
                  确定指派
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Details drawer popup Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 bg-surface-lowest/70 backdrop-blur-sm flex items-center justify-center z-50 select-none">
          <div className="glass-panel w-full max-w-[450px] rounded-2xl p-6 relative overflow-hidden">
            <h3 className="text-sm font-bold text-on-surface mb-1 flex items-center gap-2">
              <CheckCircle className="w-4.5 h-4.5 text-secondary" />
              巡检细节与合规摘要
            </h3>
            <p className="text-[10px] text-on-surface-variant/40 font-mono uppercase tracking-widest mb-4">
              地区复审详细指标及监察员档案
            </p>

            <div className="space-y-4 text-xs">
              <div className="p-4 bg-surface-lowest rounded-xl border border-outline-variant/10 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-mono text-on-surface-variant uppercase">地区名称</span>
                  <span className="font-bold text-on-surface text-sm font-sans">{selectedRecord.name}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-mono text-on-surface-variant uppercase">最近审核日期</span>
                  <span className="font-mono text-on-surface font-semibold">{selectedRecord.date}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-mono text-on-surface-variant uppercase">合规评定状态</span>
                  <span className="text-secondary font-mono font-bold">已通过 (COMPLETED)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-mono text-on-surface-variant uppercase">综合质检得分</span>
                  <span className="text-secondary font-mono font-extrabold text-sm">{selectedRecord.score} / 100</span>
                </div>
              </div>

              {/* High-tech sub-dimensions */}
              <div className="space-y-2.5 font-mono text-[10px]">
                <span className="text-on-surface-variant/50 uppercase font-bold tracking-wider">合规分项指标</span>
                
                <div className="space-y-1.5">
                  <div className="flex justify-between text-on-surface-variant">
                    <span>环境与防尘等级</span>
                    <span className="text-on-surface">99%</span>
                  </div>
                  <div className="w-full h-1 bg-surface-lowest rounded-full overflow-hidden">
                    <div className="h-full bg-secondary" style={{ width: '99%' }}></div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-on-surface-variant">
                    <span>高压设备限制出入管理</span>
                    <span className="text-on-surface">95%</span>
                  </div>
                  <div className="w-full h-1 bg-surface-lowest rounded-full overflow-hidden">
                    <div className="h-full bg-secondary" style={{ width: '95%' }}></div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-on-surface-variant">
                    <span>运行安全备份流</span>
                    <span className="text-on-surface">92%</span>
                  </div>
                  <div className="w-full h-1 bg-surface-lowest rounded-full overflow-hidden">
                    <div className="h-full bg-primary" style={{ width: '92%' }}></div>
                  </div>
                </div>
              </div>

              <div className="pt-3">
                <button
                  onClick={() => setSelectedRecord(null)}
                  className="w-full py-2.5 bg-primary hover:brightness-110 text-on-primary font-bold uppercase rounded-lg cursor-pointer text-center text-xs"
                >
                  确认并关闭
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
