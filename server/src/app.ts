import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

import authRoutes from './routes/auth.js';
import dashboardRoutes from './routes/dashboard.js';
import inspectionRoutes from './routes/inspections.js';
import alertRoutes from './routes/alerts.js';
import nodeRoutes from './routes/nodes.js';
import logRoutes from './routes/logs.js';
import orgRoutes from './routes/org.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export function createApp() {
  const app = express();
  const isProduction = process.env.NODE_ENV === 'production';

  app.use(cors({
    origin: process.env.CORS_ORIGIN || true,
    credentials: true
  }));
  app.use(express.json());

  if (isProduction) {
    const distPath = path.resolve(__dirname, '../../dist');
    app.use(express.static(distPath));
  }

  // API 路由
  app.use('/api/auth', authRoutes);
  app.use('/api/dashboard', dashboardRoutes);
  app.use('/api/inspections', inspectionRoutes);
  app.use('/api/alerts', alertRoutes);
  app.use('/api/nodes', nodeRoutes);
  app.use('/api/logs', logRoutes);
  app.use('/api/org', orgRoutes);

  // 健康检查
  app.get('/api/health', (_req, res) => {
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      mode: isProduction ? 'production' : 'development'
    });
  });

  // 生产模式：SPA 回退
  if (isProduction) {
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, '../../dist/index.html'));
    });
  }

  return app;
}
