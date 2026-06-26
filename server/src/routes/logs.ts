import { Router, Request, Response } from 'express';
import { getSupabase, isSupabaseConfigured } from '../supabase.js';
import { logSeedData } from './seed-data.js';

const router = Router();

router.get('/', async (_req: Request, res: Response) => {
  try {
    if (!isSupabaseConfigured()) {
      res.json(logSeedData);
      return;
    }
    const supabase = await getSupabase();
    if (!supabase) {
      res.json(logSeedData);
      return;
    }

    const { data, error } = await supabase
      .from('logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) {
      res.json(logSeedData);
      return;
    }
    res.json(data);
  } catch {
    res.json(logSeedData);
  }
});

router.post('/', async (req: Request, res: Response) => {
  const log = req.body;
  try {
    if (!isSupabaseConfigured()) {
      res.json({ id: `L-${Date.now()}`, ...log, created_at: new Date().toISOString() });
      return;
    }
    const supabase = await getSupabase();
    if (!supabase) {
      res.json({ id: `L-${Date.now()}`, ...log });
      return;
    }

    const { data, error } = await supabase
      .from('logs')
      .insert({ ...log, created_at: new Date().toISOString() })
      .select()
      .single();

    if (error) {
      res.status(400).json({ error: error.message });
      return;
    }
    res.json(data);
  } catch {
    res.status(500).json({ error: '添加日志失败' });
  }
});

export default router;
