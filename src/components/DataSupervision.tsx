/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  CheckCircle,
  Router,
  Gauge,
  AlertTriangle,
  Filter,
  Download,
  Server,
  Cloud,
  Database,
  History,
  Terminal,
  Clock,
  Check,
  RotateCw,
  Sliders
} from 'lucide-react';
import { DataNode, LogEntry } from '../types';

interface SupervisionProps {
  nodes: DataNode[];
  logs: LogEntry[];
  onUpdateNode: (updated: DataNode) => void;
  onAddLog: (log: LogEntry) => void;
  onSearchQuery: string;
}

export default function DataSupervision({
  nodes,
  logs,
  onUpdateNode,
  onAddLog,
  onSearchQuery
}: SupervisionProps) {
  const [viewType, setViewType] = useState<'region' | 'project'>('region');
  const [isUpdating, setIsUpdating] = useState(false);
  const [selectedNode, setSelectedNode] = useState<DataNode | null>(null);

  // Manual correction form states
  const [correctionNodeId, setCorrectionNodeId] = useState('CX-Alpha-9');
  const [correctionValue, setCorrectionValue] = useState('');

  // Node filtering based on view tab & top search query
  const filteredNodes = nodes.filter((node) => {
    const matchesSearch =
      node.name.toLowerCase().includes(onSearchQuery.toLowerCase()) ||
      node.id.toLowerCase().includes(onSearchQuery.toLowerCase());
    
    // Simulate slight filter difference between Region & Project views
    if (viewType === 'project') {
      return matchesSearch && !node.id.includes('LATAM');
    }
    return matchesSearch;
  });

  // Handle immediate system update (spinning check)
  const handleSystemUpdate = () => {
    setIsUpdating(true);
    setTimeout(() => {
      setIsUpdating(false);
      
      // Randomize KPI slightly to give live feel
      nodes.forEach((node) => {
        if (node.status !== 'disconnected') {
          const drift = Math.floor(Math.random() * 5) - 2; // -2 to +2
          const newKpi = Math.max(10, Math.min(100, node.kpi + drift));
          onUpdateNode({ ...node, kpi: newKpi });
        }
      });

      // Add log
      onAddLog({
        id: `L-${Date.now()}`,
        title: '全局系统指标刷新完成，节点漂移校准成功',
        time: new Date().toLocaleTimeString(),
        operator: '系统自动执行',
        type: 'system'
      });

      alert('数据监管中心：全国 12 个二级节点的运营情报指标同步校正成功！');
    }, 1200);
  };

  // Submit manual correction
  const handleCorrectionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const targetNode = nodes.find((n) => n.id === correctionNodeId);
    if (!targetNode) return;

    const valNum = parseInt(correctionValue);
    if (isNaN(valNum) || valNum < 0 || valNum > 100) {
      alert('请输入有效的合规指标值 (0 - 100)%');
      return;
    }

    const updatedNode: DataNode = {
      ...targetNode,
      kpi: valNum,
      status: 'normal' // Restore status if updated
    };

    onUpdateNode(updatedNode);

    // Write a log entry
    onAddLog({
      id: `L-${Date.now()}`,
      title: `手动修正节点 【${targetNode.id}】 KPI 为 ${valNum}%`,
      time: new Date().toLocaleTimeString(),
      operator: '张建华 (Admin)',
      type: 'success'
    });

    setCorrectionValue('');
    alert(`节点 【${targetNode.id}】 指标手动修正成功！该节点已被重新注入并同步。`);
  };

  // Node configuration drawer / reconnect LATAM handler
  const handleNodeAction = (node: DataNode) => {
    setSelectedNode(node);
  };

  const handleReconnectNode = () => {
    if (!selectedNode) return;
    const reconnected: DataNode = {
      ...selectedNode,
      status: 'normal',
      kpi: 95
    };
    onUpdateNode(reconnected);
    onAddLog({
      id: `L-${Date.now()}`,
      title: `节点 【${selectedNode.id}】 被强制重启并重连`,
      time: new Date().toLocaleTimeString(),
      operator: '超级管理员 (安全通道)',
      type: 'success'
    });
    setSelectedNode(null);
    alert(`节点 【${reconnected.id}】 连接信道已重建，合规握手成功，现已正常运行。`);
  };

  return (
    <div className="space-y-6 font-sans text-on-surface select-none">
      
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-xs text-on-surface-variant font-mono uppercase tracking-wider">
        <span className="hover:text-primary cursor-pointer transition-colors">集团</span>
        <span className="text-on-surface-variant/40">/</span>
        <span className="text-on-surface font-semibold">实时管理中心</span>
      </div>

      {/* Header and top-right actions */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-4 mb-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-on-surface">数据监察中心</h2>
          <p className="text-xs text-on-surface-variant/70 mt-1">实时运营情报与系统同步控制。</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-surface-lowest rounded-lg p-1 border border-outline-variant/15">
            <button
              onClick={() => setViewType('region')}
              className={`px-3.5 py-1.5 text-[10px] font-bold font-mono uppercase rounded transition-all cursor-pointer ${
                viewType === 'region'
                  ? 'bg-primary text-on-primary'
                  : 'text-on-surface-variant/70 hover:text-on-surface'
              }`}
            >
              区域视图
            </button>
            <button
              onClick={() => setViewType('project')}
              className={`px-3.5 py-1.5 text-[10px] font-bold font-mono uppercase rounded transition-all cursor-pointer ${
                viewType === 'project'
                  ? 'bg-primary text-on-primary'
                  : 'text-on-surface-variant/70 hover:text-on-surface'
              }`}
            >
              项目视图
            </button>
          </div>
          <button
            onClick={handleSystemUpdate}
            disabled={isUpdating}
            className="flex items-center gap-1.5 bg-primary hover:brightness-110 text-on-primary px-4 py-2 rounded-lg font-bold text-xs shadow-md shadow-primary/10 cursor-pointer disabled:opacity-50"
          >
            <RotateCw className={`w-3.5 h-3.5 ${isUpdating ? 'animate-spin' : ''}`} />
            {isUpdating ? '正在同步...' : '立即更新'}
          </button>
        </div>
      </div>

      {/* KPI Widgets Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        
        {/* Widget 1 */}
        <div className="glass-panel p-5 rounded-2xl flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-mono font-bold text-on-surface-variant/50 uppercase tracking-wider">
              同步健康度 / SYNC HEALTH
            </span>
            <CheckCircle className="w-4.5 h-4.5 text-secondary" />
          </div>
          <div className="mt-4">
            <div className="text-3xl font-extrabold text-on-surface">99.8%</div>
            <div className="text-[10px] text-on-surface-variant/60 font-mono mt-1 flex items-center gap-1">
              <History className="w-3.5 h-3.5 text-on-surface-variant/40" />
              4分钟前已全网同步
            </div>
          </div>
        </div>

        {/* Widget 2 */}
        <div className="glass-panel p-5 rounded-2xl flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-mono font-bold text-on-surface-variant/50 uppercase tracking-wider">
              实时数据流 / DATA INGESTION
            </span>
            <Router className="w-4.5 h-4.5 text-primary animate-pulse" />
          </div>
          <div className="mt-4">
            <div className="text-3xl font-extrabold text-on-surface">1,242</div>
            <div className="text-[10px] text-on-surface-variant/60 font-mono mt-1">
              覆盖 12 个一级核心战区
            </div>
          </div>
        </div>

        {/* Widget 3 */}
        <div className="glass-panel p-5 rounded-2xl flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-mono font-bold text-on-surface-variant/50 uppercase tracking-wider">
              平均系统延迟 / NETWORK LATENCY
            </span>
            <Gauge className="w-4.5 h-4.5 text-tertiary" />
          </div>
          <div className="mt-4">
            <div className="text-3xl font-extrabold text-on-surface">24ms</div>
            <div className="text-[10px] text-on-surface-variant/60 font-mono mt-1">
              波动偏差 <span className="text-secondary font-bold">+2ms</span>
            </div>
          </div>
        </div>

        {/* Widget 4 */}
        <div className="glass-panel p-5 rounded-2xl flex flex-col justify-between border-l-4 border-l-error/30">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-mono font-bold text-on-surface-variant/50 uppercase tracking-wider">
              系统异常告警 / ACTIVE ALERTS
            </span>
            <AlertTriangle className="w-4.5 h-4.5 text-error animate-bounce" />
          </div>
          <div className="mt-4">
            <div className="text-3xl font-extrabold text-error">02</div>
            <div className="text-[10px] text-error/80 font-mono font-bold mt-1">
              需管理员授权干预
            </div>
          </div>
        </div>

      </div>

      {/* Main Supervision Layout */}
      <div className="grid grid-cols-12 gap-6 items-stretch">
        
        {/* Table column */}
        <div className="col-span-12 lg:col-span-8 glass-panel rounded-2xl overflow-hidden flex flex-col justify-between">
          <div>
            <div className="p-5 border-b border-outline-variant/10 flex justify-between items-center bg-surface-low/30">
              <h3 className="text-xs font-mono font-bold text-on-surface uppercase tracking-wider">
                全域节点监察列表
              </h3>
              <div className="flex gap-2">
                <button
                  onClick={() => alert('已激活表格流式过滤...')}
                  className="p-1.5 hover:bg-surface-high/40 rounded-lg text-on-surface-variant hover:text-on-surface cursor-pointer"
                  title="过滤"
                >
                  <Filter className="w-4 h-4" />
                </button>
                <button
                  onClick={() => alert('下载核心节点指标统计.pdf')}
                  className="p-1.5 hover:bg-surface-high/40 rounded-lg text-on-surface-variant hover:text-on-surface cursor-pointer"
                  title="下载"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-low/50 border-b border-outline-variant/10 text-[10px] font-bold font-mono text-on-surface-variant uppercase tracking-wider">
                    <th className="px-6 py-4">系统节点</th>
                    <th className="px-6 py-4">战区/运营项目</th>
                    <th className="px-6 py-4">信道状态</th>
                    <th className="px-6 py-4">合规 KPI</th>
                    <th className="px-6 py-4 text-right">人工干预</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/10 text-xs">
                  {filteredNodes.map((node) => {
                    const isNormal = node.status === 'normal';
                    const isSyncing = node.status === 'syncing';
                    const isDisconnected = node.status === 'disconnected';

                    return (
                      <tr key={node.id} className="hover:bg-surface-lowest/40 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary/10 rounded-lg border border-primary/20 flex items-center justify-center">
                              <Server className="w-4 h-4 text-primary" />
                            </div>
                            <div>
                              <div className="font-bold text-on-surface font-mono">{node.id}</div>
                              <div className="text-[9px] font-mono text-on-surface-variant/40 mt-0.5">LOCATION: {node.location}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 font-bold text-on-surface-variant">
                          {node.name}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`text-[9px] font-mono font-extrabold px-2.5 py-0.5 rounded-full border ${
                            isNormal
                              ? 'bg-secondary/10 border-secondary/20 text-secondary'
                              : isSyncing
                              ? 'bg-primary/10 border-primary/20 text-primary'
                              : 'bg-error/10 border-error/20 text-error animate-pulse'
                          }`}>
                            {isNormal ? '正常运行' : isSyncing ? '正在同步' : '连接断开'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {!isDisconnected && node.kpi !== -1 ? (
                            <div className="flex items-center gap-3">
                              <div className="w-24 h-1 bg-surface-lowest rounded-full overflow-hidden border border-outline-variant/10">
                                <div
                                  className={`h-full ${
                                    node.kpi >= 90 ? 'bg-secondary' : 'bg-primary'
                                  }`}
                                  style={{ width: `${node.kpi}%` }}
                                ></div>
                              </div>
                              <span className="font-mono font-bold text-on-surface">{node.kpi}%</span>
                            </div>
                          ) : (
                            <span className="font-mono font-bold text-error">ERR</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => handleNodeAction(node)}
                            className="text-primary hover:text-primary-container font-mono font-bold text-[10px] uppercase cursor-pointer"
                          >
                            配置
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="p-4 bg-surface-low/30 border-t border-outline-variant/10 flex justify-between items-center text-xs text-on-surface-variant/50 font-mono select-none">
            <span>显示全网 212 个监控节点中的 {filteredNodes.length} 个</span>
            <div className="flex gap-2">
              <button disabled className="px-3 py-1 bg-surface-lowest text-on-surface-variant/30 border border-outline-variant/10 rounded font-semibold disabled:opacity-50">
                上一页
              </button>
              <button disabled className="px-3 py-1 bg-surface-lowest text-on-surface-variant/30 border border-outline-variant/10 rounded font-semibold disabled:opacity-50">
                下一页
              </button>
            </div>
          </div>
        </div>

        {/* Side panels (Correction form, sync visualizer, logs) */}
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
          
          {/* Manual Correction Form */}
          <div className="glass-panel p-5 rounded-2xl relative overflow-hidden bg-gradient-to-br from-surface-container to-surface-high/50">
            <h4 className="text-xs font-mono font-bold text-on-surface uppercase tracking-wider mb-4">
              手动数据纠偏修正 / MANAGE KPI
            </h4>
            <form onSubmit={handleCorrectionSubmit} className="space-y-4 text-xs font-mono">
              <div className="space-y-1.5">
                <label className="text-[10px] text-on-surface-variant block uppercase">干预目标节点</label>
                <select
                  value={correctionNodeId}
                  onChange={(e) => setCorrectionNodeId(e.target.value)}
                  className="w-full bg-surface-lowest border border-outline-variant/20 rounded-lg px-3 py-2.5 text-on-surface outline-none focus:border-primary focus:ring-1 focus:ring-primary/10 font-mono font-bold"
                >
                  {nodes.map((node) => (
                    <option key={node.id} value={node.id}>
                      {node.id} ({node.name})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] text-on-surface-variant block uppercase">合规修正指定值 (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={correctionValue}
                  onChange={(e) => setCorrectionValue(e.target.value)}
                  placeholder="输入合规百分数值 (0-100)"
                  className="w-full bg-surface-lowest border border-outline-variant/20 rounded-lg px-3 py-2.5 text-on-surface outline-none focus:border-primary focus:ring-1 focus:ring-primary/10 font-mono"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-on-surface text-surface-lowest font-bold text-xs rounded-lg shadow-sm hover:brightness-110 active:scale-[0.98] transition-all cursor-pointer font-sans"
              >
                提交合规修正同步
              </button>
            </form>
          </div>

          {/* Real-time Sync Visualizer */}
          <div className="glass-panel p-5 rounded-2xl flex flex-col justify-between">
            <div>
              <h4 className="text-xs font-mono font-bold text-on-surface uppercase tracking-wider mb-1">
                数据分发同步流
              </h4>
              <p className="text-[9px] text-on-surface-variant/40 font-mono uppercase tracking-widest">
                云端主节点与分布式本地储存握手可视化
              </p>
            </div>

            {/* High-tech animated diagram */}
            <div className="h-24 relative flex items-center justify-center select-none my-4">
              <div className="w-full h-12 relative flex items-center justify-between px-6">
                
                {/* Left Point: Cloud */}
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary border border-primary/20 relative">
                  <div className="absolute inset-0 rounded-full animate-ping bg-primary/10"></div>
                  <Cloud className="w-5 h-5" />
                </div>

                {/* Network Line with Flow Dot */}
                <div className="flex-1 h-[1.5px] bg-outline-variant/15 mx-2 relative overflow-hidden">
                  <div className="absolute top-0 bottom-0 w-3 h-full bg-primary/80 rounded filter blur-[1px] flow-dot"></div>
                </div>

                {/* Right Point: Database */}
                <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center text-secondary border border-secondary/20 relative">
                  <Database className="w-5 h-5" />
                </div>

              </div>
            </div>

            <div className="space-y-2 border-t border-outline-variant/10 pt-4 font-mono text-[10px]">
              <div className="flex justify-between items-center">
                <span className="text-on-surface-variant/60 uppercase">云端主节点吞吐量</span>
                <span className="text-primary font-bold">42.2 GB/s</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-on-surface-variant/60 uppercase">分布式本地储存备份量</span>
                <span className="text-secondary font-bold">128.5 GB/s</span>
              </div>
            </div>
          </div>

          {/* Activity Logs */}
          <div className="glass-panel p-5 rounded-2xl flex-1 flex flex-col justify-between">
            <div>
              <h4 className="text-xs font-mono font-bold text-on-surface uppercase tracking-wider mb-4">
                实时控制台操作审计日志
              </h4>
              <div className="space-y-3.5 max-h-[180px] overflow-y-auto custom-scrollbar">
                {logs.map((log) => (
                  <div key={log.id} className="flex gap-3 items-start group">
                    <div className={`mt-1.5 w-1.5 h-1.5 rounded-full ${
                      log.type === 'success' ? 'bg-secondary' : log.type === 'error' ? 'bg-error' : 'bg-primary'
                    }`}></div>
                    <div>
                      <div className="text-[11px] font-bold text-on-surface leading-tight">
                        {log.title}
                      </div>
                      <div className="text-[9px] font-mono text-on-surface-variant/40 mt-1 uppercase tracking-wider">
                        {log.time} • {log.operator}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Node configuration drawer modal */}
      {selectedNode && (
        <div className="fixed inset-0 bg-surface-lowest/70 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="glass-panel w-full max-w-[420px] rounded-2xl p-6 relative overflow-hidden">
            <h3 className="text-sm font-bold text-on-surface mb-1 flex items-center gap-2">
              <Sliders className="w-4.5 h-4.5 text-primary" />
              节点运行管理与指令重连
            </h3>
            <p className="text-[10px] text-on-surface-variant/40 font-mono uppercase tracking-widest mb-4">
              向特定分布式物理节点注入指令
            </p>

            <div className="space-y-4 text-xs font-mono">
              <div className="p-4 bg-surface-lowest rounded-xl border border-outline-variant/10 space-y-2">
                <div className="flex justify-between">
                  <span className="text-on-surface-variant/60 uppercase">节点标识 ID</span>
                  <span className="text-on-surface font-bold">{selectedNode.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-on-surface-variant/60 uppercase">战区归属名</span>
                  <span className="text-on-surface font-sans font-bold">{selectedNode.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-on-surface-variant/60 uppercase">最近检测合规率</span>
                  <span className={`font-bold ${selectedNode.status === 'disconnected' ? 'text-error' : 'text-secondary'}`}>
                    {selectedNode.status === 'disconnected' ? 'ERR' : `${selectedNode.kpi}%`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-on-surface-variant/60 uppercase">信道连结状态</span>
                  <span className={`font-bold ${selectedNode.status === 'disconnected' ? 'text-error animate-pulse' : 'text-secondary'}`}>
                    {selectedNode.status === 'disconnected' ? 'LINK_BROKEN' : 'CONNECTED'}
                  </span>
                </div>
              </div>

              {/* Operations */}
              <div className="space-y-2 pt-2">
                {selectedNode.status === 'disconnected' ? (
                  <button
                    onClick={handleReconnectNode}
                    className="w-full py-2.5 bg-primary hover:brightness-110 text-on-primary font-bold uppercase rounded-lg cursor-pointer text-center"
                  >
                    强制发送重连与握手校验
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      alert(`已向节点 【${selectedNode.id}】 重新分发环境安全握手，连接畅通。`);
                      setSelectedNode(null);
                    }}
                    className="w-full py-2.5 bg-surface-low hover:bg-surface-high border border-outline-variant/20 text-on-surface font-bold uppercase rounded-lg cursor-pointer text-center"
                  >
                    重启安全握手
                  </button>
                )}
                
                <button
                  onClick={() => setSelectedNode(null)}
                  className="w-full py-2.5 bg-surface-lowest border border-outline-variant/10 text-on-surface-variant/60 font-bold uppercase rounded-lg cursor-pointer text-center"
                >
                  取消
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
