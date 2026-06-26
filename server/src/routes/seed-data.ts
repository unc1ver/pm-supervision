export const inspectionSeedData = [
  { id: '1', name: '华东地区 (上海/浙江/江苏)', status: 'completed', date: '2024-11-05', score: 98 },
  { id: '2', name: '华南地区 (广东/广西/海南)', status: 'ongoing', date: '2024-11-10', score: -1 },
  { id: '3', name: '华北地区 (北京/天津/河北)', status: 'completed', date: '2024-11-02', score: 95 },
  { id: '4', name: '西南地区 (重庆/四川/贵州)', status: 'pending', date: '尚未开始', score: -1 },
  { id: '5', name: '东北地区 (黑龙江/吉林/辽宁)', status: 'completed', date: '2024-11-01', score: 85 },
  { id: '6', name: '华中地区 (湖北/湖南/河南)', status: 'completed', date: '2024-11-06', score: 92 },
  { id: '7', name: '西北地区 (陕西/甘肃/青海)', status: 'completed', date: '2024-11-07', score: 95 },
  { id: '8', name: '港澳台地区', status: 'completed', date: '2024-11-03', score: 86 },
  { id: '9', name: '华东沿海区', status: 'completed', date: '2024-11-03', score: 93 },
  { id: '10', name: '东南地区', status: 'completed', date: '2024-11-08', score: 93 },
  { id: '11', name: '华北二区', status: 'completed', date: '2024-11-09', score: 91 },
  { id: '12', name: '中部枢纽区', status: 'completed', date: '2024-11-09', score: 86 },
  { id: '13', name: '西北资源区', status: 'completed', date: '2024-11-05', score: 94 },
  { id: '14', name: '南部增长区', status: 'completed', date: '2024-11-08', score: 86 },
  { id: '15', name: '内陆核心区', status: 'completed', date: '2024-11-09', score: 92 },
  { id: '16', name: '东部科技区', status: 'completed', date: '2024-11-06', score: 92 },
  { id: '17', name: '黄河流域区', status: 'completed', date: '2024-11-01', score: 89 },
  { id: '18', name: '长江流域区', status: 'completed', date: '2024-11-03', score: 97 },
  { id: '19', name: '边境贸易区', status: 'completed', date: '2024-11-03', score: 97 },
  { id: '20', name: '京津冀一体区', status: 'completed', date: '2024-11-07', score: 89 },
  { id: '21', name: '长三角经济区', status: 'completed', date: '2024-11-03', score: 91 },
  { id: '22', name: '珠三角核心区', status: 'completed', date: '2024-11-02', score: 86 },
  { id: '23', name: '成渝特区', status: 'completed', date: '2024-11-01', score: 99 },
  { id: '24', name: '北部湾经济区', status: 'completed', date: '2024-11-03', score: 85 },
  { id: '25', name: '海峡西岸区', status: 'completed', date: '2024-11-01', score: 91 }
];

export const alertSeedData = [
  { id: 'A-101', type: 'critical', title: '【紧急】消防系统离线告警', desc: '华北区域 3 栋写字楼消防水压传感器离线超过 30 分钟', time: '2分钟前', dismissed: false },
  { id: 'A-102', type: 'system', title: '月度能耗数据同步完成', desc: '华东区域 12 个项目的电表数据已与主数据库完成同步', time: '15分钟前', dismissed: false },
  { id: 'A-103', type: 'warning', title: '设备维保到期预警', desc: '华南区域 8 部电梯维保合同将于 7 天内到期，请及时续签', time: '42分钟前', dismissed: false },
  { id: 'A-104', type: 'info', title: '新项目入驻审批通过', desc: '成都高新区 AI 大厦物业管理合同已签署，系统接入中', time: '1小时前', dismissed: false }
];

export const nodeSeedData = [
  { id: 'NODE-SH-01', name: '上海中心大厦', location: '上海市浦东新区', status: 'normal', kpi: 82 },
  { id: 'NODE-BJ-01', name: '北京国贸大厦', location: '北京市朝阳区', status: 'syncing', kpi: 45 },
  { id: 'NODE-GZ-01', name: '广州国际金融中心', location: '广州市天河区', status: 'normal', kpi: 94 },
  { id: 'NODE-CD-01', name: '成都天府金融中心', location: '成都市高新区', status: 'disconnected', kpi: -1 }
];

export const logSeedData = [
  { id: 'L-001', title: '华东区域月度能耗数据同步完成', time: '12:44:02', operator: '系统自动执行', type: 'system' },
  { id: 'L-002', title: '安全巡检基线校准完成', time: '12:31:15', operator: '系统自动执行', type: 'system' },
  { id: 'L-003', title: '成都天府金融中心节点连接异常', time: '12:15:22', operator: '紧急系统告警', type: 'error' },
  { id: 'L-004', title: '手动修正广州国际金融中心能耗偏置', time: '11:58:10', operator: '张建华 (Admin)', type: 'success' }
];

export const orgSeedData = [
  { id: 'ORG-ROOT', name: '物业集团管理总部', role: '集团管理中心', leader: '张建国 (董事长)', phone: '010-88889999', email: 'board@pmgroup.com', status: 'normal', parent_id: null },
  { id: 'ORG-EC', name: '华东区域公司', role: '区域管理中心', leader: '李向阳 (区域总经理)', phone: '021-66554433', email: 'east@pmgroup.com', status: 'normal', parent_id: 'ORG-ROOT' },
  { id: 'ORG-NC', name: '华北区域公司', role: '区域管理中心', leader: '赵国强 (区域总经理)', phone: '010-55443322', email: 'north@pmgroup.com', status: 'normal', parent_id: 'ORG-ROOT' },
  { id: 'ORG-SC', name: '华南区域公司', role: '区域管理中心', leader: '孙志远 (区域总经理)', phone: '020-33221100', email: 'south@pmgroup.com', status: 'warning', parent_id: 'ORG-ROOT' },
  { id: 'ORG-WC', name: '西南区域公司', role: '区域管理中心', leader: '钱震 (区域总经理)', phone: '028-44332211', email: 'west@pmgroup.com', status: 'normal', parent_id: 'ORG-ROOT' },
  { id: 'ORG-EC-SH', name: '上海分公司', role: '项目管理处', leader: '王伟 (项目总监)', phone: '13811112222', email: 'sh@pmgroup.com', status: 'normal', parent_id: 'ORG-EC' },
  { id: 'ORG-EC-HZ', name: '杭州分公司', role: '项目管理处', leader: '陈林 (项目总监)', phone: '13833334444', email: 'hz@pmgroup.com', status: 'normal', parent_id: 'ORG-EC' },
  { id: 'ORG-NC-BJ', name: '北京分公司', role: '项目管理处', leader: '刘洋 (项目总监)', phone: '13911115555', email: 'bj@pmgroup.com', status: 'normal', parent_id: 'ORG-NC' },
  { id: 'ORG-NC-TJ', name: '天津分公司', role: '项目管理处', leader: '张静 (项目总监)', phone: '13922226666', email: 'tj@pmgroup.com', status: 'normal', parent_id: 'ORG-NC' },
  { id: 'ORG-SC-GZ', name: '广州分公司', role: '项目管理处', leader: '黄勇 (项目总监)', phone: '13711117777', email: 'gz@pmgroup.com', status: 'warning', parent_id: 'ORG-SC' },
  { id: 'ORG-SC-SZ', name: '深圳分公司', role: '项目管理处', leader: '周杰 (项目总监)', phone: '13722228888', email: 'sz@pmgroup.com', status: 'normal', parent_id: 'ORG-SC' },
  { id: 'ORG-WC-CD', name: '成都分公司', role: '项目管理处', leader: '郑强 (项目总监)', phone: '13611119999', email: 'cd@pmgroup.com', status: 'normal', parent_id: 'ORG-WC' },
  { id: 'ORG-WC-CQ', name: '重庆分公司', role: '项目管理处', leader: '吴明 (项目总监)', phone: '13622220000', email: 'cq@pmgroup.com', status: 'normal', parent_id: 'ORG-WC' }
];
