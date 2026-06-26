import { Router, Request, Response } from 'express';
import { getSupabase, isSupabaseConfigured } from '../supabase.js';
import { nodeSeedData } from './seed-data.js';

const router = Router();

router.get('/', async (_req: Request, res: Response) => {
  try {
    if (!isSupabaseConfigured()) {
      res.json(nodeSeedData);
      return;
    }
    const supabase = await getSupabase();
    if (!supabase) {
      res.json(nodeSeedData);
      return;
    }

    const { data, error } = await supabase
      .from('nodes')
      .select('*')
      .order('id', { ascending: true });

    if (error) {
      res.json(nodeSeedData);
      return;
    }
    res.json(data);
  } catch {
    res.json(nodeSeedData);
  }
});

router.patch('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const updates = req.body;
  try {
    if (!isSupabaseConfigured()) {
      res.json({ id, ...updates });
      return;
    }
    const supabase = await getSupabase();
    if (!supabase) {
      res.json({ id, ...updates });
      return;
    }

    const { data, error } = await supabase
      .from('nodes')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      res.status(400).json({ error: error.message });
      return;
    }
    res.json(data);
  } catch {
    res.status(500).json({ error: '更新节点失败' });
  }
});

export default router;
