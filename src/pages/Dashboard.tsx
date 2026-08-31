import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Server, Users, Key, Activity, ArrowLeft, Plus, Zap } from 'lucide-react'
import { deployments, tokens, activity } from '../lib/api'
import { formatBytes, timeAgo } from '../lib/utils'

interface Stats { totalWorkers: number; activeWorkers: number; totalMembers: number; totalTokens: number }

export default function Dashboard() {
  const [stats, setStats] = useState<Stats>({ totalWorkers: 0, activeWorkers: 0, totalMembers: 0, totalTokens: 0 })
  const [recentActivity, setRecentActivity] = useState<{ id: string; action: string; entity_type: string; entity_name: string; created_at: string }[]>([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    Promise.all([
      deployments.list().catch(() => []),
      tokens.list().catch(() => []),
      activity.list().catch(() => []),
    ]).then(([deps, toks, logs]) => {
      setStats({
        totalWorkers: deps.length,
        activeWorkers: deps.filter((d: { status: string }) => d.status === 'deployed').length,
        totalMembers: 0,
        totalTokens: toks.length,
      })
      setRecentActivity(logs.slice(0, 8))
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  const statCards = [
    { label: 'ورکرهای فعال', value: stats.activeWorkers, icon: Server, color: 'text-emerald-400', bg: 'bg-emerald-500/20' },
    { label: 'کل ورکرها', value: stats.totalWorkers, icon: Zap, color: 'text-brand-400', bg: 'bg-brand-500/20' },
    { label: 'توکن‌های CF', value: stats.totalTokens, icon: Key, color: 'text-amber-400', bg: 'bg-amber-500/20' },
    { label: 'فعالیت‌ها', value: recentActivity.length, icon: Activity, color: 'text-blue-400', bg: 'bg-blue-500/20' },
  ]

  const actionLabels: Record<string, string> = {
    token_created: 'توکن جدید ساخته شد',
    token_deleted: 'توکن حذف شد',
    deployment_created: 'ورکر جدید مستقر شد',
    deployment_deployed: 'ورکر با موفقیت مستقر شد',
    deployment_failed: 'استقرار ورکر ناموفق بود',
    deployment_deleted: 'ورکر حذف شد',
    member_created: 'کاربر زیرمجموعه اضافه شد',
    member_deleted: 'کاربر زیرمجموعه حذف شد',
    config_updated: 'تنظیمات به‌روزرسانی شد',
  }

  return (
    <div className="min-h-screen p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">داشبورد</h1>
          <p className="text-gray-500 mt-1">مدیریت پروکسی و کاربران</p>
        </div>
        <Link to="/workers" className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" />
          ورکر جدید
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {statCards.map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="card">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 ${s.bg} rounded-xl flex items-center justify-center`}>
                <s.icon className={`w-5 h-5 ${s.color}`} />
              </div>
              <div>
                <div className="text-2xl font-bold">{loading ? '—' : s.value}</div>
                <div className="text-xs text-gray-500">{s.label}</div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <Link to="/workers" className="card hover:border-brand-500/50 transition-all group">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-brand-600/20 rounded-xl flex items-center justify-center group-hover:bg-brand-600/30 transition">
              <Server className="w-6 h-6 text-brand-400" />
            </div>
            <div>
              <h3 className="font-semibold">مدیریت ورکرها</h3>
              <p className="text-sm text-gray-500">ایجاد، حذف و تنظیم ورکرها</p>
            </div>
            <ArrowLeft className="w-5 h-5 text-gray-600 mr-auto" />
          </div>
        </Link>
        <Link to="/settings" className="card hover:border-amber-500/50 transition-all group">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-amber-600/20 rounded-xl flex items-center justify-center group-hover:bg-amber-600/30 transition">
              <Key className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <h3 className="font-semibold">توکن‌ها</h3>
              <p className="text-sm text-gray-500">مدیریت توکن‌های Cloudflare</p>
            </div>
            <ArrowLeft className="w-5 h-5 text-gray-600 mr-auto" />
          </div>
        </Link>
        <Link to="/settings" className="card hover:border-emerald-500/50 transition-all group">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-600/20 rounded-xl flex items-center justify-center group-hover:bg-emerald-600/30 transition">
              <Users className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <h3 className="font-semibold">کاربران</h3>
              <p className="text-sm text-gray-500">مدیریت زیرمجموعه‌ها</p>
            </div>
            <ArrowLeft className="w-5 h-5 text-gray-600 mr-auto" />
          </div>
        </Link>
      </div>

      {/* Activity */}
      <div className="card">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Activity className="w-5 h-5 text-brand-400" />
          فعالیت‌های اخیر
        </h2>
        {recentActivity.length === 0 ? (
          <p className="text-gray-500 text-center py-8">هنوز فعالیتی ثبت نشده</p>
        ) : (
          <div className="space-y-3">
            {recentActivity.map(log => (
              <div key={log.id} className="flex items-center justify-between py-2 border-b border-gray-800/50 last:border-0">
                <span className="text-sm">{actionLabels[log.action] || log.action}</span>
                <span className="text-xs text-gray-500">{timeAgo(log.created_at)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
