import { useState, useEffect, useCallback } from 'react';
import Login from './components/Login';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import DashboardOverview from './components/DashboardOverview';
import RegionalInspection from './components/RegionalInspection';
import DataSupervision from './components/DataSupervision';
import OrgStructure from './components/OrgStructure';

import { ViewType, InspectionRecord, AlertItem, DataNode, LogEntry, User } from './types';
import { ShieldCheck, HelpCircle, Loader2 } from 'lucide-react';

import {
  authApi,
  inspectionsApi,
  alertsApi,
  nodesApi,
  logsApi,
  setToken,
} from './api';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => authApi.isLoggedIn());
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const [currentLevel, setCurrentLevel] = useState<'group' | 'region' | 'project'>('group');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  // 数据状态
  const [records, setRecords] = useState<InspectionRecord[]>([]);
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [nodes, setNodes] = useState<DataNode[]>([]);
  const [logs, setLogs] = useState<LogEntry[]>([]);

  // Toast 通知
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  }, []);

  // 从 API 加载所有数据
  const loadAllData = useCallback(async () => {
    setLoading(true);
    try {
      const [inspections, alertItems, dataNodes, logItems] = await Promise.all([
        inspectionsApi.getAll(),
        alertsApi.getAll(),
        nodesApi.getAll(),
        logsApi.getAll(),
      ]);
      setRecords(inspections);
      setAlerts(alertItems);
      setNodes(dataNodes);
      setLogs(logItems);
    } catch (err) {
      console.error('[App] 数据加载失败:', err);
      showToast('数据加载失败，请检查后端服务是否正常运行');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  // 登录后加载数据
  useEffect(() => {
    if (isLoggedIn) {
      loadAllData();
      // 从 localStorage 恢复用户信息
      const stored = localStorage.getItem('auth_user');
      if (stored) {
        try {
          setCurrentUser(JSON.parse(stored));
        } catch {
          // ignore
        }
      }
    }
  }, [isLoggedIn, loadAllData]);

  // 登录成功
  const handleLoginSuccess = useCallback(
    async (username: string, password: string) => {
      const result = await authApi.login(username, password);
      setToken(result.token);
      localStorage.setItem('auth_user', JSON.stringify(result.user));
      setCurrentUser(result.user);
      setIsLoggedIn(true);
      showToast('身份验证成功！欢迎登录物业集团综合监察系统。');
    },
    [showToast]
  );

  // 告警操作
  const handleDismissAlert = useCallback(
    async (id: string) => {
      const alertItem = alerts.find((a) => a.id === id);
      if (!alertItem) return;

      try {
        await alertsApi.dismiss(id);
        setAlerts((prev) => prev.filter((a) => a.id !== id));
        showToast(`告警 [${alertItem.title}] 已从监控队列中排除。`);
      } catch (err) {
        console.error(err);
        showToast('操作失败，请重试');
      }
    },
    [alerts, showToast]
  );

  const handleDeployTeam = useCallback(
    async (id: string) => {
      try {
        await alertsApi.deploy(id);
        const newLog: LogEntry = {
          id: `L-${Date.now()}`,
          title: `紧急排班组派往核查: 【${alerts.find((a) => a.id === id)?.title}】`,
          time: new Date().toLocaleTimeString(),
          operator: '控制中心系统自动派单',
          type: 'success',
        };
        setLogs((prev) => [newLog, ...prev]);
        showToast('维保团队已出发赶往现场！');
      } catch (err) {
        console.error(err);
        showToast('派单失败，请重试');
      }
    },
    [alerts, showToast]
  );

  // 节点操作
  const handleUpdateNode = useCallback(
    async (updatedNode: DataNode) => {
      try {
        await nodesApi.update(updatedNode.id, updatedNode);
        setNodes((prev) => prev.map((n) => (n.id === updatedNode.id ? updatedNode : n)));
      } catch (err) {
        console.error(err);
        showToast('更新节点失败');
      }
    },
    [showToast]
  );

  // 巡检记录操作
  const handleUpdateRecord = useCallback(
    async (updatedRecord: InspectionRecord) => {
      try {
        await inspectionsApi.update(updatedRecord.id, updatedRecord);
        setRecords((prev) =>
          prev.map((r) => (r.id === updatedRecord.id ? updatedRecord : r))
        );
      } catch (err) {
        console.error(err);
        showToast('更新巡检记录失败');
      }
    },
    [showToast]
  );

  const handleAddLog = useCallback(
    async (newLog: LogEntry) => {
      try {
        await logsApi.add({
          title: newLog.title,
          time: newLog.time,
          operator: newLog.operator,
          type: newLog.type,
        });
        setLogs((prev) => [newLog, ...prev]);
      } catch (err) {
        console.error(err);
      }
    },
    []
  );

  // 快速分析
  const handleQuickAnalysis = useCallback(() => {
    const reportName = prompt('请输入新综合分析报告的主题/名称：');
    if (!reportName || reportName.trim() === '') return;

    const newLog: LogEntry = {
      id: `L-${Date.now()}`,
      title: `生成全新合规评估报告: 【${reportName}】`,
      time: new Date().toLocaleTimeString(),
      operator: '高级分析引擎',
      type: 'success',
    };
    setLogs((prev) => [newLog, ...prev]);
    handleAddLog(newLog);
    showToast(`系统评估引擎报告已归档并上传至云端中心。`);
  }, [handleAddLog, showToast]);

  // 级别切换
  const handleLevelChange = useCallback(
    (level: 'group' | 'region' | 'project') => {
      setCurrentLevel(level);
      const levelNames = { group: '集团总览级别', region: '区域中心深度钻取', project: '单体项目控制节点' };
      showToast(`监察系统聚焦级别已调整为：${levelNames[level]}`);
    },
    [showToast]
  );

  // 登出
  const handleLogout = useCallback(() => {
    authApi.logout();
    localStorage.removeItem('auth_user');
    setIsLoggedIn(false);
    setCurrentUser(null);
    showToast('已安全退出管理系统。');
  }, [showToast]);

  // 视图渲染
  const renderCurrentView = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-[60vh]">
          <div className="flex flex-col items-center gap-4 text-on-surface-variant/50">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="text-xs font-mono">系统数据加载中...</p>
          </div>
        </div>
      );
    }

    switch (currentView) {
      case 'dashboard':
        return (
          <DashboardOverview
            alerts={alerts}
            onDismissAlert={handleDismissAlert}
            onDeployTeam={handleDeployTeam}
            onSearchQuery={searchQuery}
          />
        );
      case 'inspection':
        return (
          <RegionalInspection
            records={records}
            onUpdateRecord={handleUpdateRecord}
            onSearchQuery={searchQuery}
          />
        );
      case 'dataCenter':
        return (
          <DataSupervision
            nodes={nodes}
            logs={logs}
            onUpdateNode={handleUpdateNode}
            onAddLog={handleAddLog}
            onSearchQuery={searchQuery}
          />
        );
      case 'org':
        return <OrgStructure onSearchQuery={searchQuery} />;
      default:
        return null;
    }
  };

  if (!isLoggedIn) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen bg-surface-lowest text-on-surface font-sans flex flex-col relative overflow-x-hidden antialiased">
      {/* Glow Effects */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-[10%] left-[20%] w-[40%] h-[40%] bg-glow-blue rounded-full filter blur-[120px] opacity-40"></div>
        <div className="absolute bottom-[15%] right-[10%] w-[35%] h-[35%] bg-glow-green rounded-full filter blur-[120px] opacity-20"></div>
      </div>

      <Header
        currentUser={currentUser || { id: '', name: '', role: '', avatar: '' }}
        onNotificationClick={() => showToast('暂无未读系统重要通报。')}
        onSettingsClick={() => showToast('控制中心系统设置现已锁定。')}
        onSearch={setSearchQuery}
        currentLevel={currentLevel}
        onLevelChange={handleLevelChange}
      />

      <div className="flex flex-1 pt-16 relative z-10">
        <Sidebar
          currentView={currentView}
          onViewChange={(view) => {
            setCurrentView(view);
            setSearchQuery('');
          }}
          currentUser={currentUser || { id: '', name: '', role: '', avatar: '' }}
          onLogout={handleLogout}
          onQuickAnalysis={handleQuickAnalysis}
        />

        <main className="flex-1 ml-64 p-8 min-h-[calc(100vh-64px)] overflow-y-auto">
          <div className="max-w-[1300px] mx-auto animate-in fade-in duration-300">
            {renderCurrentView()}
          </div>
        </main>
      </div>

      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl bg-surface-container border border-primary/20 text-xs font-semibold text-on-surface shadow-2xl animate-in slide-in-from-bottom-4 duration-300">
          <ShieldCheck className="w-4 h-4 text-primary animate-pulse" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
