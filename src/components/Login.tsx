import React, { useState, useEffect, useRef, FormEvent } from 'react';
import { Shield, Eye, EyeOff, ArrowRight, ShieldCheck, Cpu, RefreshCw, AlertTriangle } from 'lucide-react';

interface LoginProps {
  onLoginSuccess: (username: string, password: string) => Promise<void>;
}

export default function Login({ onLoginSuccess }: LoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [utcTime, setUtcTime] = useState('UTC 00:00:00');

  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const timeStr = now.toISOString().split('T')[1].split('.')[0];
      setUtcTime(`UTC ${timeStr}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = (y - centerY) / 35;
    const rotateY = (centerX - x) / 35;
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  };

  const handleMouseLeave = () => {
    const card = cardRef.current;
    if (card) {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password) {
      setError('请输入完整的管理员账号和密码');
      return;
    }

    setError('');
    setIsSubmitting(true);

    try {
      await onLoginSuccess(username, password);
    } catch (err: any) {
      setError(err.message || '登录验证失败，请检查账号和密码');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-surface-lowest text-on-surface overflow-hidden font-sans select-none">
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute -top-[10%] -right-[10%] w-[50%] h-[50%] bg-glow-blue rounded-full filter blur-[100px]"></div>
        <div className="absolute -bottom-[10%] -left-[10%] w-[50%] h-[50%] bg-glow-green rounded-full filter blur-[100px]"></div>
        <div className="absolute inset-0 opacity-[0.02] bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:32px_32px]"></div>
      </div>

      <main className="relative z-10 w-full max-w-[420px] px-6 md:px-0">
        <div className="mb-8 text-center space-y-2">
          <div className="flex items-center justify-center gap-3">
            <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center relative shadow-lg shadow-primary/10">
              <div className="absolute inset-0 bg-primary/10 rounded-xl animate-pulse"></div>
              <ShieldCheck className="w-8 h-8 text-primary relative z-10" />
            </div>
            <h1 className="text-3xl font-bold text-on-surface tracking-tight">
              物业集团监察系统
            </h1>
          </div>
          <p className="text-sm font-medium text-on-surface-variant tracking-wider font-mono">
            管理员登录门户 / ADMIN LOGIN PORTAL
          </p>
        </div>

        <div
          ref={cardRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="glass-panel rounded-2xl p-8 relative overflow-hidden transition-transform duration-200 ease-out"
        >
          <div className="scanning-line"></div>

          <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
            {error && (
              <div className="p-3 rounded-lg bg-error-container/10 border border-error/20 text-error text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-on-surface-variant tracking-wider font-mono uppercase block ml-1" htmlFor="username">
                  账号/邮箱
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full rounded-lg bg-surface-lowest/50 border border-outline-variant/30 py-3 px-4 text-sm text-on-surface placeholder:text-on-surface-variant/30 outline-none focus:bg-surface-lowest focus:border-primary focus:ring-2 focus:ring-primary/15 transition-all"
                    placeholder="请输入管理员 ID (admin)"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-on-surface-variant tracking-wider font-mono uppercase block ml-1" htmlFor="password">
                  密码
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-lg bg-surface-lowest/50 border border-outline-variant/30 py-3 px-4 text-sm text-on-surface placeholder:text-on-surface-variant/30 outline-none pr-10 focus:bg-surface-lowest focus:border-primary focus:ring-2 focus:ring-primary/15 transition-all"
                    placeholder="•••••••••••• (admin123)"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant/40 hover:text-primary transition-colors focus:outline-none"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-primary hover:brightness-110 text-on-primary font-semibold py-3.5 rounded-lg flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-lg shadow-primary/10 disabled:opacity-50 cursor-pointer text-sm"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>安全验证中...</span>
                  </>
                ) : (
                  <>
                    <span>验证并登录</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>

            <div className="flex items-center justify-between text-xs text-on-surface-variant/70 pt-1 px-1">
              <a href="#forgot" className="hover:text-primary transition-colors">
                找回密码
              </a>
              <a href="#help" className="hover:text-primary transition-colors">
                帮助中心
              </a>
            </div>
          </form>
        </div>

        <div className="mt-8 flex flex-col items-center gap-4">
          <div className="flex items-center gap-3 px-4 py-1.5 rounded-full border border-outline-variant/10 bg-surface-lowest/40 backdrop-blur-md shadow-sm">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse"></span>
              <span className="text-[10px] font-mono text-on-surface-variant uppercase tracking-wider">
                加密连接已激活
              </span>
            </div>
            <div className="w-[1px] h-3 bg-outline-variant/20"></div>
            <div className="flex items-center gap-1">
              <Cpu className="w-3 h-3 text-on-surface-variant/50" />
              <span className="text-[10px] font-mono text-on-surface-variant uppercase tracking-wider">
                节点: PM-SEC-01
              </span>
            </div>
          </div>

          <p className="text-[10px] text-on-surface-variant/40 text-center leading-relaxed font-mono uppercase tracking-tight">
            Property Management Group Supervision System © 2026. <br />
            未经授权的访问将被监控并记录。
          </p>
        </div>
      </main>

      <div className="fixed bottom-8 left-8 hidden lg:block opacity-40 select-none">
        <div className="font-mono text-[11px] text-on-surface-variant/60 flex flex-col gap-0.5">
          <span className="text-primary/70 tracking-wider" id="timestamp">{utcTime}</span>
        </div>
      </div>

      <div className="fixed top-8 right-8 hidden lg:block opacity-40 select-none">
        <div className="font-mono text-[11px] text-on-surface-variant/60 flex flex-col items-end gap-0.5">
          <div className="flex gap-4">
            <span>负载: 12%</span>
            <span>网络: 稳定</span>
          </div>
          <span className="text-primary/70 tracking-widest">PROPERTY MGMT V4.2</span>
        </div>
      </div>
    </div>
  );
}
