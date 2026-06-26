import { Router, Request, Response } from 'express';
import { getSupabase, isSupabaseConfigured } from '../supabase.js';
import { alertSeedData } from './seed-data.js';

const router = Router();

router.get('/', async (_req: Request, res: Response) => {
  try {
    if (!isSupabaseConfigured()) {
      res.json(alertSeedData.filter(a => !a.dismissed));
      return;
    }
    const supabase = await getSupabase();
    if (!supabase) {
      res.json(alertSeedData);
      return;
    }

    const { data, error } = await supabase
      .from('alerts')
      .select('*')
      .eq('dismissed', false)
      .order('created_at', { ascending: false });

    if (error) {
      res.json(alertSeedData);
      return;
    }
    res.json(data);
  } catch {
    res.json(alertSeedData);
  }
});

router.patch('/:id/dismiss', async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    if (!isSupabaseConfigured()) {
      res.json({ id, dismissed: true });
      return;
    }
    const supabase = await getSupabase();
    if (!supabase) {
      res.json({ id, dismissed: true });
      return;
    }

    const { data, error } = await supabase
      .from('alerts')
      .update({ dismissed: true })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      res.status(400).json({ error: error.message });
      return;
    }
    res.json(data);
  } catch {
    res.status(500).json({ error: '消除告警失败' });
  }
});

router.post('/:id/deploy', async (req: Request, res: Response) => {
  const { id } = req.params;
  res.json({ id, deployed: true });
});

export default router;
