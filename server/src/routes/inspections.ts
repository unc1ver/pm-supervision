import { Router, Request, Response } from 'express';
import { getSupabase, isSupabaseConfigured } from '../supabase.js';
import { inspectionSeedData } from './seed-data.js';

const router = Router();

router.get('/', async (_req: Request, res: Response) => {
  try {
    if (!isSupabaseConfigured()) {
      res.json(inspectionSeedData);
      return;
    }
    const supabase = await getSupabase();
    if (!supabase) {
      res.json(inspectionSeedData);
      return;
    }

    const { data, error } = await supabase
      .from('inspections')
      .select('*')
      .order('id', { ascending: true });

    if (error) {
      res.json(inspectionSeedData);
      return;
    }
    res.json(data || inspectionSeedData);
  } catch {
    res.json(inspectionSeedData);
  }
});

router.patch('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    if (!isSupabaseConfigured()) {
      res.json({ id, ...updates, updated_at: new Date().toISOString() });
      return;
    }
    const supabase = await getSupabase();
    if (!supabase) {
      res.json({ id, ...updates });
      return;
    }

    const { data, error } = await supabase
      .from('inspections')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      res.status(400).json({ error: error.message });
      return;
    }
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: '更新巡检记录失败' });
  }
});

export default router;
