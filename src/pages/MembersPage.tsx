import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Trash2, Copy, ArrowRight, Users, Edit2, Check, X, Loader2, ExternalLink, Calendar, HardDrive, Smartphone, ToggleLeft, ToggleRight } from 'lucide-react'
import { members, deployments } from '../lib/api'
import { formatBytes, formatDate, genUUID } from '../lib/utils'

interface Member { id: string; name: string; token: string; enabled: boolean; expires_at: string; quota_bytes: number; used_bytes: number; request_quota: number; used_requests: number; ip_limit: number; created_at: string; settings: Record<string, unknown> }
interface Worker { id: string; name: string; worker_url: string; uuid: string; status: string }

export default function MembersPage() {
  const { id: deploymentId } = useParams<{ id: string }>()
  const [worker, setWorker] = useState<Worker | null>(null)
  const [memberList, setMemberList] = useState<Member[]>([])
  const [loading, setLoading] = useState(true)
  const [showAdd, setShowAdd] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  // Add form
  const [newName, setNewName] = useState('')
  const [newExpiry, setNewExpiry] = useState('')
  const [newQuotaGB, setNewQuotaGB] = useState('')
  const [newIPs, setNewIPs] = useState('')

  // Edit form
  const [editExpiry, setEditExpiry] = useState('')
  const [editQuotaGB, setEditQuotaGB] = useState('')
  const [editIPs, setEditIPs] = useState('')

  useEffect(() => {
    if (!deploymentId) return
    loadData()
  }, [deploymentId])

  const loadData = async () => {
    if (!deploymentId) return
    try {
      const [deps, mems] = await Promise.all([
        deployments.list(),
        members.list(deploymentId).catch(() => []),
      ])
      const w = deps.find((d: Worker) => d.id === deploymentId)
      if (w) setWorker(w)
      setMemberList(mems)
    } catch { /* ignore */ }
    setLoading(false)
  }

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!deploymentId || !newName) return
    try {
      await members.create(deploymentId, {
        name: newName,
        expires_at: newExpiry || undefined,
        quota_bytes: newQuotaGB ? Number(newQuotaGB) * 1073741824 : undefined,
        ip_limit: newIPs ? Number(newIPs) : undefined,
      })
      setShowAdd(false)
      setNewName('')
      setNewExpiry('')
      setNewQuotaGB('')
      setNewIPs('')
      loadData()
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'خطا')
    }
  }

  const handleToggle = async (m: Member) => {
    if (!deploymentId) return
    try {
      await members.patch(deploymentId, m.id, { enabled: !m.enabled })
      loadData()
    } catch { /* ignore */ }
  }

  const handleEdit = async (m: Member) => {
    if (!deploymentId) return
    try {
      const body: Record<string, unknown> = {}
      if (editExpiry) body.expires_at = editExpiry
      if (editQuotaGB) body.quota_bytes = Number(editQuotaGB) * 1073741824
      if (editIPs) body.ip_limit = Number(editIPs)
      await members.patch(deploymentId, m.id, body)
      setEditingId(null)
      loadData()
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'خطا')
    }
  }

  const handleDelete = async (m: Member) => {
    if (!deploymentId) return
    if (!confirm(`کاربر "${m.name}" حذف شود؟`)) return
    try {
      await members.remove(deploymentId, m.id)
      loadData()
    } catch { /* ignore */ }
  }

  const copySubLink = (m: Member) => {
    if (!worker) return
    const link = `${worker.worker_url}/sub?token=${worker.uuid}&uuid=${m.token}`
    navigator.clipboard.writeText(link)
  }

  return (
    <div className="min-h-screen p-6 max-w-7xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <Link to="/workers" className="text-gray-500 hover:text-gray-300">
          <ArrowRight className="w-6 h-6" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Users className="w-8 h-8 text-brand-400" />
            کاربران زیرمجموعه
          </h1>
          <p className="text-gray-500 mt-1">ورکر: {worker?.name || '—'}</p>
        </div>
        <button onClick={() => setShowAdd(true)} className="btn-primary flex items-center gap-2 mr-auto">
          <Plus className="w-4 h-4" />
          افزودن کاربر
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 text-brand-400 animate-spin" /></div>
      ) : memberList.length === 0 ? (
        <div className="card text-center py-16">
          <Users className="w-16 h-16 text-gray-700 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">هنوز کاربری ندارید</h3>
          <p className="text-gray-500 mb-6">کاربران زیرمجموعه خود را با محدودیت حجم و زمان اضافه کنید</p>
          <button onClick={() => setShowAdd(true)} className="btn-primary">افزودن کاربر</button>
        </div>
      ) : (
        <div className="space-y-3">
          {memberList.map(m => (
            <motion.div key={m.id} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="card">
              {editingId === m.id ? (
                /* Edit Mode */
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">{m.name}</span>
                    <div className="flex gap-2">
                      <button onClick={() => handleEdit(m)} className="text-emerald-400 hover:text-emerald-300"><Check className="w-5 h-5" /></button>
                      <button onClick={() => setEditingId(null)} className="text-gray-500 hover:text-gray-300"><X className="w-5 h-5" /></button>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="label">تاریخ انقضا</label>
                      <input type="date" value={editExpiry} onChange={e => setEditExpiry(e.target.value)} className="input text-sm" />
                    </div>
                    <div>
                      <label className="label">سقف حجم (GB)</label>
                      <input type="number" value={editQuotaGB} onChange={e => setEditQuotaGB(e.target.value)} className="input text-sm" placeholder="10" />
                    </div>
                    <div>
                      <label className="label">حد دستگاه</label>
                      <input type="number" value={editIPs} onChange={e => setEditIPs(e.target.value)} className="input text-sm" placeholder="۳" />
                    </div>
                  </div>
                </div>
              ) : (
                /* View Mode */
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <button onClick={() => handleToggle(m)} className={m.enabled ? 'text-emerald-400' : 'text-gray-600'}>
                        {m.enabled ? <ToggleRight className="w-7 h-7" /> : <ToggleLeft className="w-7 h-7" />}
                      </button>
                      <div>
                        <span className="font-semibold">{m.name}</span>
                        <span className={`mr-2 ${m.enabled ? 'badge-green' : 'badge-red'}`}>
                          {m.enabled ? 'فعال' : 'غیرفعال'}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => { setEditingId(m.id); setEditExpiry(m.expires_at || ''); setEditQuotaGB(m.quota_bytes ? String(m.quota_bytes / 1073741824) : ''); setEditIPs(m.ip_limit ? String(m.ip_limit) : ''); }} className="text-gray-500 hover:text-brand-400 p-1">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(m)} className="text-gray-500 hover:text-red-400 p-1">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                    <div className="bg-gray-800/50 rounded-lg px-3 py-2">
                      <div className="text-xs text-gray-500 flex items-center gap-1"><HardDrive className="w-3 h-3" /> حجم مصرفی</div>
                      <div className="text-sm font-medium">{formatBytes(m.used_bytes)} / {m.quota_bytes ? formatBytes(m.quota_bytes) : '∞'}</div>
                      {m.quota_bytes > 0 && (
                        <div className="w-full bg-gray-700 rounded-full h-1.5 mt-1">
                          <div className="bg-brand-500 h-1.5 rounded-full" style={{ width: `${Math.min(100, (m.used_bytes / m.quota_bytes) * 100)}%` }} />
                        </div>
                      )}
                    </div>
                    <div className="bg-gray-800/50 rounded-lg px-3 py-2">
                      <div className="text-xs text-gray-500 flex items-center gap-1"><Calendar className="w-3 h-3" /> انقضا</div>
                      <div className="text-sm font-medium">{m.expires_at ? formatDate(m.expires_at) : '∞'}</div>
                    </div>
                    <div className="bg-gray-800/50 rounded-lg px-3 py-2">
                      <div className="text-xs text-gray-500 flex items-center gap-1"><Smartphone className="w-3 h-3" /> دستگاه</div>
                      <div className="text-sm font-medium">{m.ip_limit || '∞'}</div>
                    </div>
                    <div className="bg-gray-800/50 rounded-lg px-3 py-2">
                      <div className="text-xs text-gray-500">تاریخ ایجاد</div>
                      <div className="text-sm font-medium">{formatDate(m.created_at)}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 bg-gray-800/30 rounded-lg px-3 py-2">
                    <code className="text-xs text-brand-300 flex-1 truncate font-mono">
                      {worker?.worker_url}/sub?token={worker?.uuid}&uuid={m.token}
                    </code>
                    <button onClick={() => copySubLink(m)} className="text-brand-400 hover:text-brand-300 shrink-0" title="کپی لینک">
                      <Copy className="w-4 h-4" />
                    </button>
                    {worker?.worker_url && (
                      <a href={`${worker.worker_url}/sub?token=${worker.uuid}&uuid=${m.token}`} target="_blank" rel="noopener" className="text-gray-500 hover:text-gray-300 shrink-0">
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}

      {/* Add Member Modal */}
      <AnimatePresence>
        {showAdd && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="card w-full max-w-md">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">👤 افزودن کاربر جدید</h2>
                <button onClick={() => setShowAdd(false)} className="text-gray-500 hover:text-gray-300"><X className="w-5 h-5" /></button>
              </div>
              <form onSubmit={handleAdd} className="space-y-4">
                <div>
                  <label className="label">نام کاربر</label>
                  <input value={newName} onChange={e => setNewName(e.target.value)} className="input" placeholder="علی" required />
                </div>
                <div>
                  <label className="label">تاریخ انقضا (اختیاری)</label>
                  <input type="date" value={newExpiry} onChange={e => setNewExpiry(e.target.value)} className="input" />
                </div>
                <div>
                  <label className="label">سقف حجم گیگابایت (اختیاری)</label>
                  <input type="number" value={newQuotaGB} onChange={e => setNewQuotaGB(e.target.value)} className="input" placeholder="10" min="0" step="0.1" />
                </div>
                <div>
                  <label className="label">حد تعداد دستگاه همزمان (اختیاری)</label>
                  <input type="number" value={newIPs} onChange={e => setNewIPs(e.target.value)} className="input" placeholder="3" min="0" />
                </div>
                <button type="submit" className="btn-primary w-full py-3">افزودن کاربر</button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
