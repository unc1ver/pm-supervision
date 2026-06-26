import { Router, Request, Response } from 'express';
import { getSupabase, isSupabaseConfigured } from '../supabase.js';

const router = Router();

const FALLBACK_STATS = {
  total_projects: 1284,
  project_growth: 12.0,
  security_rating: 98.4,
  security_trend: '+0.4%',
  compliance_rate: 92.1,
  compliance_trend: '-1.2%',
  active_alerts: 4,
  completed_inspections: 21,
  total_inspections: 25,
  coverage_rate: 84.0
};

router.get('/stats', async (_req: Request, res: Response) => {
  try {
    if (!isSupabaseConfigured()) {
      res.json(FALLBACK_STATS);
      return;
    }

    const supabase = await getSupabase();
    if (!supabase) {
      res.json(FALLBACK_STATS);
      return;
    }

    const { data, error } = await supabase
      .from('dashboard_stats')
      .select('*')
      .single();

    if (error || !data) {
      res.json(FALLBACK_STATS);
      return;
    }

    res.json(data);
  } catch {
    res.json(FALLBACK_STATS);
  }
});

export default router;
