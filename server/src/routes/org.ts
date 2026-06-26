import { Router, Request, Response } from 'express';
import { getSupabase, isSupabaseConfigured } from '../supabase.js';
import { orgSeedData } from './seed-data.js';

function buildOrgTree(orgs: any[]): any {
  const map = new Map<string, any>();
  let root: any = null;

  orgs.forEach(org => {
    map.set(org.id, { ...org, children: [] });
  });

  orgs.forEach(org => {
    const node = map.get(org.id);
    if (org.parent_id && map.has(org.parent_id)) {
      map.get(org.parent_id).children.push(node);
    } else if (!org.parent_id) {
      root = node;
    }
  });

  function cleanChildren(node: any): any {
    if (node.children && node.children.length === 0) {
      delete node.children;
    } else if (node.children) {
      node.children = node.children.map(cleanChildren);
    }
    return node;
  }

  return root ? cleanChildren(root) : null;
}

const router = Router();

router.get('/', async (_req: Request, res: Response) => {
  try {
    if (!isSupabaseConfigured()) {
      res.json(buildOrgTree(orgSeedData));
      return;
    }
    const supabase = await getSupabase();
    if (!supabase) {
      res.json(buildOrgTree(orgSeedData));
      return;
    }

    const { data, error } = await supabase
      .from('organizations')
      .select('*')
      .order('id', { ascending: true });

    if (error) {
      res.json(buildOrgTree(orgSeedData));
      return;
    }
    res.json(buildOrgTree(data || orgSeedData));
  } catch {
    res.json(buildOrgTree(orgSeedData));
  }
});

export default router;
