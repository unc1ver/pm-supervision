import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { getSupabase, isSupabaseConfigured } from '../supabase.js';
import { generateToken } from '../middleware/auth.js';
import { LoginRequest, LoginResponse } from '../types.js';

const router = Router();

// 预置管理员（Supabase 未配置时的降级方案）
// 密码: admin123 (bcrypt hash)
const FALLBACK_HASH = '$2a$10$rdYjMid5lfyni0paVGW81.J20RvkV8TB.bgwh8VFR8RKOO519GVWu';
const FALLBACK_USER = {
  id: 'USR-001',
  name: '张建华',
  role: '集团超级管理员',
  avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC4pUwodDqUbY4WSllKoBjZUc7C8vVRe0di1b_yDityVupD3YONvpb59PoD6lGh1EIjx9dGwwzZp6YW5UZlsokpiyYOM5dn0ajoJLj_SmmtS-YGI_pT7JIyXfNzj5Dfv_h12OfTwFXtwGlNYdgHG-_EgyEM3N_q6R_W9G8BigDdfzZdTFXwySfr6r1FkbHotFcHMH-JagC-AhB9z2qYFpmpJBYN2GGR6NTtzqLPZwKmexAKpZacajlyQ87mhNz-YTk21R3WsCeFJII',
  password_hash: FALLBACK_HASH
};

router.post('/login', async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body as LoginRequest;

    if (!username || !password) {
      res.status(400).json({ error: '请输入账号和密码' });
      return;
    }

    let user: any = null;

    if (isSupabaseConfigured()) {
      const supabase = await getSupabase();
      if (supabase) {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('name', username)
          .single();

        if (!error && data) {
          user = data;
        }
      }
    }

    // 降级方案：使用预置管理员
    if (!user) {
      if (username !== 'admin') {
        res.status(401).json({ error: '账号或密码错误' });
        return;
      }
      user = FALLBACK_USER;
    }

    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      res.status(401).json({ error: '账号或密码错误' });
      return;
    }

    const token = generateToken({ userId: user.id, role: user.role });

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        role: user.role,
        avatar: user.avatar
      }
    } as LoginResponse);
  } catch (err) {
    console.error('[Auth] Login error:', err);
    res.status(500).json({ error: '服务器内部错误' });
  }
});

export default router;
