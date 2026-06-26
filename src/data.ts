/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * 此文件仅保留类型和种子数据引用。
 * 运行时数据通过 API 从后端获取。
 */

export const currentUser = {
  id: 'USR-001',
  name: '张建华',
  role: '集团超级管理员',
  avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC4pUwodDqUbY4WSllKoBjZUc7C8vVRe0di1b_yDityVupD3YONvpb59PoD6lGh1EIjx9dGwwzZp6YW5UZlsokpiyYOM5dn0ajoJLj_SmmtS-YGI_pT7JIyXfNzj5Dfv_h12OfTwFXtwGlNYdgHG-_EgyEM3N_q6R_W9G8BigDdfzZdTFXwySfr6r1FkbHotFcHMH-JagC-AhB9z2qYFpmpJBYN2GGR6NTtzqLPZwKmexAKpZacajlyQ87mhNz-YTk21R3WsCeFJII'
};

// 以下为向后兼容的保留变量，新代码应使用 API
export const initialInspectionRecords: import('./types').InspectionRecord[] = [];
export const initialAlerts: import('./types').AlertItem[] = [];
export const initialNodes: import('./types').DataNode[] = [];
export const initialLogs: import('./types').LogEntry[] = [];
export const groupOrgTree: import('./types').OrgNode = {
  id: 'ORG-ROOT',
  name: '物业集团管理总部',
  role: '集团管理中心',
  leader: '张建国 (董事长)',
  phone: '010-88889999',
  email: 'board@pmgroup.com',
  status: 'normal',
  children: []
};
