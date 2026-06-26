import React, { useState, useEffect } from 'react';
import {
  GitBranch,
  User,
  Phone,
  Mail,
  ShieldCheck,
  AlertTriangle,
  ChevronRight,
  ChevronDown,
  Building,
  ArrowRight,
  Users2,
  Loader2
} from 'lucide-react';
import { orgApi, OrgNode } from '../api';

interface OrgProps {
  onSearchQuery: string;
}

export default function OrgStructure({ onSearchQuery }: OrgProps) {
  const [orgTree, setOrgTree] = useState<OrgNode | null>(null);
  const [selectedNode, setSelectedNode] = useState<OrgNode | null>(null);
  const [collapsedNodes, setCollapsedNodes] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    orgApi.getTree()
      .then((tree) => {
        setOrgTree(tree);
        setSelectedNode(tree);
      })
      .catch((err) => console.error('[Org] 加载失败:', err))
      .finally(() => setLoading(false));
  }, []);

  const toggleCollapse = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setCollapsedNodes((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleNodeClick = (node: OrgNode) => setSelectedNode(node);

  const triggerTaskAssignment = (node: OrgNode) => {
    const task = prompt(`请输入要派发给 【${node.name}】 的紧急督导任务：`);
    if (task && task.trim() !== '') {
      alert(`督导任务指派成功！\n目标责任人：${node.leader}\n任务内容："${task}"`);
    }
  };

  const renderTree = (node: OrgNode, depth = 0) => {
    const isCollapsed = collapsedNodes[node.id];
    const hasChildren = node.children && node.children.length > 0;
    const isSelected = selectedNode?.id === node.id;
    const isMatchingSearch =
      onSearchQuery !== '' &&
      (node.name.toLowerCase().includes(onSearchQuery.toLowerCase()) ||
        node.leader.toLowerCase().includes(onSearchQuery.toLowerCase()));

    return (
      <div key={node.id} className="space-y-1.5" style={{ marginLeft: `${depth * 14}px` }}>
        <div
          onClick={() => handleNodeClick(node)}
          className={`group flex items-center justify-between p-3.5 rounded-xl border transition-all duration-200 cursor-pointer ${
            isSelected
              ? 'bg-primary/15 border-primary shadow-sm'
              : isMatchingSearch
              ? 'bg-tertiary-container/10 border-tertiary'
              : 'bg-surface-lowest border-outline-variant/10 hover:border-outline-variant/30 hover:bg-surface-low/30'
          }`}
        >
          <div className="flex items-center gap-2.5">
            {hasChildren ? (
              <button
                onClick={(e) => toggleCollapse(node.id, e)}
                className="p-1 hover:bg-surface-high/50 rounded-md text-on-surface-variant focus:outline-none cursor-pointer"
              >
                {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
            ) : (
              <div className="w-6 h-6 flex items-center justify-center text-on-surface-variant/20">•</div>
            )}
            <div className="flex items-center gap-2">
              <Building className={`w-4 h-4 ${isSelected ? 'text-primary' : 'text-on-surface-variant/60'}`} />
              <div className="flex flex-col">
                <span className="text-xs font-bold text-on-surface flex items-center gap-2">
                  {node.name}
                  {node.status === 'warning' && (
                    <span className="w-1.5 h-1.5 rounded-full bg-tertiary animate-pulse" />
                  )}
                </span>
                <span className="text-[10px] font-mono text-on-surface-variant/40 mt-0.5 uppercase tracking-wide">
                  {node.role}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 pr-2 font-mono text-[10px] text-on-surface-variant/60 group-hover:text-on-surface">
            <span>{node.leader.split(' ')[0]}</span>
            <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </div>

        {hasChildren && !isCollapsed && (
          <div className="space-y-1.5 border-l border-outline-variant/10 ml-3.5 pl-3.5 pt-0.5 pb-1">
            {node.children!.map((child) => renderTree(child, depth))}
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="flex flex-col items-center gap-4 text-on-surface-variant/50">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-xs font-mono">组织架构数据加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 font-sans text-on-surface select-none">
      <header className="mb-4">
        <h1 className="text-2xl font-bold tracking-tight text-on-surface mb-1">
          物业集团组织架构管理
        </h1>
        <p className="text-xs text-on-surface-variant/70">
          统筹管理旗下各大区域公司、分公司与项目管理处。
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left: Interactive Tree */}
        <div className="lg:col-span-7 glass-panel p-6 rounded-2xl flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-6 border-b border-outline-variant/10 pb-4">
              <div>
                <h3 className="text-sm font-bold text-on-surface flex items-center gap-2">
                  <Users2 className="w-4.5 h-4.5 text-primary" />
                  组织权责拓扑
                </h3>
                <p className="text-[10px] text-on-surface-variant/40 font-mono uppercase tracking-widest mt-1">
                  集团逐级授权链路
                </p>
              </div>
              {orgTree && (
                <button
                  onClick={() => setCollapsedNodes({})}
                  className="text-[10px] font-bold font-mono text-primary hover:text-primary-container tracking-wider uppercase cursor-pointer"
                >
                  展开全部节点
                </button>
              )}
            </div>

            <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
              {orgTree && renderTree(orgTree)}
            </div>
          </div>

          <p className="text-[10px] font-mono font-semibold text-on-surface-variant/40 mt-6 uppercase tracking-wider">
            说明：点击各部门节点，可在右侧查看详情。
          </p>
        </div>

        {/* Right: Detail Card */}
        <div className="lg:col-span-5">
          <div className="glass-panel p-6 rounded-2xl flex-1 flex flex-col justify-between bg-gradient-to-br from-surface-container to-surface-low/30 relative overflow-hidden h-full">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 filter blur-2xl rounded-full"></div>

            <div>
              <div className="mb-6 pb-4 border-b border-outline-variant/10">
                <span className="text-[9px] font-mono font-bold text-primary px-2 py-0.5 rounded uppercase bg-primary/10 border border-primary/10 tracking-wider">
                  管理档案 / MANAGEMENT ARCHIVE
                </span>
                <h3 className="text-lg font-extrabold text-on-surface mt-3 flex items-center gap-2">
                  {selectedNode?.name || '未选择'}
                </h3>
                <p className="text-xs text-on-surface-variant font-mono mt-1">{selectedNode?.role}</p>
              </div>

              {selectedNode && (
                <div className="space-y-5 text-xs">
                  {/* Manager */}
                  <div className="flex items-start gap-3">
                    <div className="p-2.5 bg-surface-low rounded-xl border border-outline-variant/10 flex items-center justify-center">
                      <User className="w-4 h-4 text-on-surface-variant/70" />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono font-bold text-on-surface-variant/40 block uppercase tracking-wide">
                        负责人 / MANAGER
                      </span>
                      <span className="text-on-surface font-sans font-bold text-sm block mt-0.5">{selectedNode.leader}</span>
                    </div>
                  </div>

                  {selectedNode.phone && (
                    <div className="flex items-start gap-3">
                      <div className="p-2.5 bg-surface-low rounded-xl border border-outline-variant/10 flex items-center justify-center">
                        <Phone className="w-4 h-4 text-on-surface-variant/70" />
                      </div>
                      <div>
                        <span className="text-[10px] font-mono font-bold text-on-surface-variant/40 block uppercase tracking-wide">
                          联系电话 / PHONE
                        </span>
                        <span className="text-primary font-mono font-semibold block mt-0.5">{selectedNode.phone}</span>
                      </div>
                    </div>
                  )}

                  {selectedNode.email && (
                    <div className="flex items-start gap-3">
                      <div className="p-2.5 bg-surface-low rounded-xl border border-outline-variant/10 flex items-center justify-center">
                        <Mail className="w-4 h-4 text-on-surface-variant/70" />
                      </div>
                      <div>
                        <span className="text-[10px] font-mono font-bold text-on-surface-variant/40 block uppercase tracking-wide">
                          邮箱 / EMAIL
                        </span>
                        <span className="text-primary font-mono font-semibold block mt-0.5">{selectedNode.email}</span>
                      </div>
                    </div>
                  )}

                  <div className="flex items-start gap-3">
                    <div className="p-2.5 bg-surface-low rounded-xl border border-outline-variant/10 flex items-center justify-center">
                      {selectedNode.status === 'warning' ? (
                        <AlertTriangle className="w-4 h-4 text-tertiary" />
                      ) : (
                        <ShieldCheck className="w-4 h-4 text-secondary" />
                      )}
                    </div>
                    <div>
                      <span className="text-[10px] font-mono font-bold text-on-surface-variant/40 block uppercase tracking-wide">
                        运营状态 / STATUS
                      </span>
                      <span className={`font-mono font-extrabold block mt-0.5 text-xs ${
                        selectedNode.status === 'warning' ? 'text-tertiary' : 'text-secondary'
                      }`}>
                        {selectedNode.status === 'warning' ? '需要关注' : '正常合规'}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {selectedNode && (
              <div className="mt-8 space-y-2.5 pt-4 border-t border-outline-variant/10">
                <button
                  onClick={() => triggerTaskAssignment(selectedNode)}
                  className="w-full py-3 bg-primary hover:brightness-110 text-on-primary font-bold text-xs rounded-lg flex items-center justify-center gap-2 shadow-md shadow-primary/10 cursor-pointer font-sans"
                >
                  <span>指派紧急督导任务</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
