import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Trash2, Copy, ArrowRight, Users, Edit2, Check, X, Loader2, ExternalLink, Calendar, HardDrive, Smartphone, ToggleLeft, ToggleRight } from 'lucide-react'
import { members, deployments } from '../lib/api'
import { formatBytes, formatDate } from '../lib/utils'

interface Member { id: string; name: string; token: string; enabled: boolean; expires_at: string | null; quota_bytes: number | null; used_bytes: number; request_quota: number | null; used_requests: number; ip_limit: number | null; created_at: string }
interface Worker { id: string; name: string; worker_url: string; uuid: string; status: string }

export default function MembersPage() {
  const { id: deploymentId } = useParams<{ id: string }>()
  const [worker, setWorker] = useState<Worker | null>(null)
  const [memberList, setMemberList] = useState<Member[]>([])
  const [loading, setLoading] = useState(true)
  const [showAdd, setShowAdd] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  const [newName, setNewName] = useState('')
  const [newExpiry, setNewExpiry] = useState('')
  const [newQuotaGB, setNewQuotaGB] = useState('')
  const [newIPs, setNewIPs] = useState('')
  const [editExpiry, setEditExpiry] = useState('')
  const [editQuotaGB, setEditQuotaGB] = useState('')
  const [editIPs, setEditIPs] = useState('')

  useEffect(() => { if (deploymentId) loadData() }, [deploymentId])

  const loadData = async () => {
    if (!deploymentId) return
    try {
      const [deps, mems] = await Promise.all([deployments.list(), members.list(deploymentId).catch(() => [])])
      const w = deps.find((d: Worker) => d.id === deploymentId)
      if (w) setWorker(w)
      setMemberList(mems)
    } catch {}
    setLoading(false)
  }

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!deploymentId || !newName) return
    try {
      await members.create(deploymentId, { name: newName, expires_at: newExpiry || undefined, quota_bytes: newQuotaGB ? Number(newQuotaGB) * 1073741824 : undefined, ip_limit: newIPs ? Number(newIPs) : undefined })
      setShowAdd(false); setNewName(''); setNewExpiry(''); setNewQuotaGB(''); setNewIPs(''); loadData()
    } catch (err: unknown) { alert(err instanceof Error ? err.message : 'خطا') }
  }

  const handleToggle = async (m: Member) => {
    if (!deploymentId) return
    try {      await members.updateMember(deploymentId, m.id, { enabled: !m.enabled }); loadData() } catch {}
  }

  const handleEdit = async (m: Member) => {
    if (!deploymentId) return
    try {
      const body: Record<string, unknown> = {}
      if (editExpiry) body.expires_at = editExpiry
      if (editQuotaGB) body.quota_bytes = Number(editQuotaGB) * 1073741824
      if (editIPs) body.ip_limit = Number(editIPs)
      await members.updateMember(deploymentId, m.id, body); setEditingId(null); loadData()
    } catch (err: unknown) { alert(err instanceof Error ? err.message : 'خطا') }
  }

  const handleDelete = async (m: Member) => {
    if (!deploymentId) return
    if (!confirm(`کاربر "${m.name}" حذف شود؟`)) return
    try { await members.remove(deploymentId, m.id); loadData() } catch {}
  }

  const copySubLink = (m: Member) => { if (worker) navigator.clipboard.writeText(`${worker.worker_url}/sub?token=${worker.uuid}&uuid=${m.token}`) }

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="flex items-center gap-3">
          <Link to="/workers" className="text-gray-500 hover:text-gray-300"><ArrowRight className="w-5 h-5 sm:w-6 sm:h-6" /></Link>
          <div>
            <h1 className="page-title flex items-center gap-2"><Users className="w-6 h-6 sm:w-8 sm:h-8 text-brand-400" /> کاربران</h1>
            <p className="page-subtitle">ورکر: {worker?.name || '—'}</p>
          </div>
        </div>
        <button onClick={() => setShowAdd(true)} className="btn-primary flex items-center gap-1.5 self-start text-xs sm:text-sm">
          <Plus className="w-3.5 h-3.5" /> افزودن کاربر
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 text-brand-400 animate-spin" /></div>
      ) : memberList.length === 0 ? (
        <div className="card text-center py-12 sm:py-16">
          <Users className="w-12 h-12 sm:w-16 sm:h-16 text-gray-700 mx-auto mb-3 sm:mb-4" />
          <h3 className="text-lg sm:text-xl font-semibold mb-2">هنوز کاربری ندارید</h3>
          <p className="text-gray-500 text-xs sm:text-sm mb-4 sm:mb-6">کاربران زیرمجموعه را با محدودیت حجم و زمان اضافه کنید</p>
          <button onClick={() => setShowAdd(true)} className="btn-primary text-sm">افزودن کاربر</button>
        </div>
      ) : (
        <div className="space-y-3">
          {memberList.map(m => (
            <motion.div key={m.id} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="card">
              {editingId === m.id ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-sm">{m.name}</span>
                    <div className="flex gap-2">
                      <button onClick={() => handleEdit(m)} className="text-emerald-400 hover:text-emerald-300"><Check className="w-5 h-5" /></button>
                      <button onClick={() => setEditingId(null)} className="text-gray-500 hover:text-gray-300"><X className="w-5 h-5" /></button>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 sm:gap-3">
                    <div><label className="label">انقضا</label><input type="date" value={editExpiry} onChange={e => setEditExpiry(e.target.value)} className="input text-xs" /></div>
                    <div><label className="label">سقف (GB)</label><input type="number" value={editQuotaGB} onChange={e => setEditQuotaGB(e.target.value)} className="input text-xs" placeholder="10" /></div>
                    <div><label className="label">دستگاه</label><input type="number" value={editIPs} onChange={e => setEditIPs(e.target.value)} className="input text-xs" placeholder="۳" /></div>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex items-center justify-between mb-2 sm:mb-3">
                    <div className="flex items-center gap-2">
                      <button onClick={() => handleToggle(m)} className={m.enabled ? 'text-emerald-400' : 'text-gray-600'}>
                        {m.enabled ? <ToggleRight className="w-6 h-6 sm:w-7 sm:h-7" /> : <ToggleLeft className="w-6 h-6 sm:w-7 sm:h-7" />}
                      </button>
                      <span className="font-semibold text-sm">{m.name}</span>
                      <span className={m.enabled ? 'badge-green' : 'badge-red'}>{m.enabled ? 'فعال' : 'غیرفعال'}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <button onClick={() => { setEditingId(m.id); setEditExpiry(m.expires_at || ''); setEditQuotaGB(m.quota_bytes ? String(m.quota_bytes / 1073741824) : ''); setEditIPs(m.ip_limit ? String(m.ip_limit) : ''); }} className="text-gray-500 hover:text-brand-400 p-1"><Edit2 className="w-3.5 h-3.5" /></button>
                      <button onClick={() => handleDelete(m)} className="text-gray-500 hover:text-red-400 p-1"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-2 sm:mb-3">
                    <div className="member-stat">
                      <div className="member-stat-label"><HardDrive className="w-3 h-3" /> حجم</div>
                      <div className="member-stat-value">{formatBytes(m.used_bytes)} / {m.quota_bytes ? formatBytes(m.quota_bytes) : '∞'}</div>
                    </div>
                    <div className="member-stat">
                      <div className="member-stat-label"><Calendar className="w-3 h-3" /> انقضا</div>
                      <div className="member-stat-value">{m.expires_at ? formatDate(m.expires_at) : '∞'}</div>
                    </div>
                    <div className="member-stat">
                      <div className="member-stat-label"><Smartphone className="w-3 h-3" /> دستگاه</div>
                      <div className="member-stat-value">{m.ip_limit || '∞'}</div>
                    </div>
                    <div className="member-stat">
                      <div className="member-stat-label">تاریخ ایجاد</div>
                      <div className="member-stat-value">{formatDate(m.created_at)}</div>
                    </div>
                  </div>

                  <div className="sub-link">
                    <code>{worker?.worker_url}/sub?token={worker?.uuid}&uuid={m.token}</code>
                    <button onClick={() => copySubLink(m)} className="text-brand-400 hover:text-brand-300 shrink-0"><Copy className="w-3.5 h-3.5" /></button>
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
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="modal-overlay" onClick={() => setShowAdd(false)}>
            <motion.div initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 100, opacity: 0 }} className="modal-content" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h2 className="text-lg sm:text-xl font-bold">👤 افزودن کاربر</h2>
                <button onClick={() => setShowAdd(false)} className="btn-icon text-gray-500 hover:text-gray-300"><X className="w-5 h-5" /></button>
              </div>
              <form onSubmit={handleAdd} className="space-y-3 sm:space-y-4">
                <div><label className="label">نام کاربر</label><input value={newName} onChange={e => setNewName(e.target.value)} className="input" placeholder="علی" required /></div>
                <div><label className="label">تاریخ انقضا</label><input type="date" value={newExpiry} onChange={e => setNewExpiry(e.target.value)} className="input" /></div>
                <div className="grid grid-cols-2 gap-3">
                  <div><label className="label">سقف حجم (GB)</label><input type="number" value={newQuotaGB} onChange={e => setNewQuotaGB(e.target.value)} className="input" placeholder="10" min="0" step="0.1" /></div>
                  <div><label className="label">حد دستگاه</label><input type="number" value={newIPs} onChange={e => setNewIPs(e.target.value)} className="input" placeholder="3" min="0" /></div>
                </div>
                <button type="submit" className="btn-primary w-full py-2.5 sm:py-3">افزودن</button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
