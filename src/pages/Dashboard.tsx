import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Server, Users, Key, Activity, ArrowLeft, Plus, Zap } from 'lucide-react'
import { deployments, tokens, activity } from '../lib/api'
import { timeAgo, ACTION_LABELS } from '../lib/utils'

interface Stats { totalWorkers: number; activeWorkers: number; totalTokens: number; actCount: number }

export default function Dashboard() {
  const [stats, setStats] = useState<Stats>({ totalWorkers: 0, activeWorkers: 0, totalTokens: 0, actCount: 0 })
  const [recentActivity, setRecentActivity] = useState<{ id: string; action: string; entity_name: string; created_at: string }[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      deployments.list().catch(() => []),
      tokens.list().catch(() => []),
      activity.list().catch(() => []),
    ]).then(([deps, toks, logs]) => {
      setStats({
        totalWorkers: deps.length,
        activeWorkers: deps.filter((d: { status: string }) => d.status === 'deployed').length,
        totalTokens: toks.length,
        actCount: logs.length,
      })
      setRecentActivity(logs.slice(0, 8))
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  const statCards = [
    { label: 'ورکرهای فعال', value: stats.activeWorkers, icon: Server, color: 'text-emerald-400', bg: 'bg-emerald-500/20' },
    { label: 'کل ورکرها', value: stats.totalWorkers, icon: Zap, color: 'text-brand-400', bg: 'bg-brand-500/20' },
    { label: 'توکن‌های CF', value: stats.totalTokens, icon: Key, color: 'text-amber-400', bg: 'bg-amber-500/20' },
    { label: 'فعالیت‌ها', value: stats.actCount, icon: Activity, color: 'text-blue-400', bg: 'bg-blue-500/20' },
  ]

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">داشبورد</h1>
          <p className="page-subtitle">مدیریت پروکسی و کاربران</p>
        </div>
        <Link to="/workers" className="btn-primary flex items-center justify-center gap-2 self-start">
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">ورکر جدید</span>
          <span className="sm:hidden">جدید</span>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid-4 mb-6 sm:mb-8">
        {statCards.map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="stat-card">
            <div className={`stat-icon ${s.bg}`}>
              <s.icon className={`w-5 h-5 ${s.color}`} />
            </div>
            <div>
              <div className="stat-value">{loading ? '—' : s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid-3 mb-6 sm:mb-8">
        <Link to="/workers" className="card-hover group">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-brand-600/20 rounded-xl flex items-center justify-center group-hover:bg-brand-600/30 transition">
              <Server className="w-5 h-5 sm:w-6 sm:h-6 text-brand-400" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm sm:text-base">مدیریت ورکرها</h3>
              <p className="text-[10px] sm:text-xs text-gray-500">ایجاد، حذف و تنظیم ورکرها</p>
            </div>
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 shrink-0" />
          </div>
        </Link>
        <Link to="/settings" className="card-hover group">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-amber-600/20 rounded-xl flex items-center justify-center group-hover:bg-amber-600/30 transition">
              <Key className="w-5 h-5 sm:w-6 sm:h-6 text-amber-400" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm sm:text-base">توکن‌ها</h3>
              <p className="text-[10px] sm:text-xs text-gray-500">مدیریت توکن‌های Cloudflare</p>
            </div>
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 shrink-0" />
          </div>
        </Link>
        <Link to="/workers" className="card-hover group">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-emerald-600/20 rounded-xl flex items-center justify-center group-hover:bg-emerald-600/30 transition">
              <Users className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-400" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm sm:text-base">کاربران</h3>
              <p className="text-[10px] sm:text-xs text-gray-500">مدیریت زیرمجموعه‌ها</p>
            </div>
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 shrink-0" />
          </div>
        </Link>
      </div>

      {/* Activity */}
      <div className="card">
        <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 flex items-center gap-2">
          <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-brand-400" />
          فعالیت‌های اخیر
        </h2>
        {recentActivity.length === 0 ? (
          <p className="text-gray-500 text-center py-6 sm:py-8 text-sm">هنوز فعالیتی ثبت نشده</p>
        ) : (
          <div className="space-y-2 sm:space-y-3">
            {recentActivity.map(log => (
              <div key={log.id} className="flex items-center justify-between py-1.5 sm:py-2 border-b border-gray-800/50 last:border-0">
                <span className="text-xs sm:text-sm truncate">{ACTION_LABELS[log.action] || log.action}</span>
                <span className="text-[10px] sm:text-xs text-gray-500 shrink-0 mr-2">{timeAgo(log.created_at)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
