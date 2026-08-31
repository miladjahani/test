import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Trash2, ExternalLink, Copy, Users, X, Loader2, AlertCircle } from 'lucide-react'
import { deployments, tokens } from '../lib/api'
import { genUUID } from '../lib/utils'

interface Worker { id: string; name: string; status: string; worker_url: string; uuid: string; method: string; worker_source: string; created_at: string; logs?: string; error_message?: string; kv_namespace_id?: string }
interface CfToken { id: string; name: string; token: string; status: string }

export default function WorkersPage() {
  const [workers, setWorkers] = useState<Worker[]>([])
  const [tokensList, setTokensList] = useState<CfToken[]>([])
  const [showDeploy, setShowDeploy] = useState(false)
  const [loading, setLoading] = useState(true)
  const [deploying, setDeploying] = useState(false)
  const [deployLog, setDeployLog] = useState('')

  const [workerName, setWorkerName] = useState('')
  const [selectedToken, setSelectedToken] = useState('')
  const [proxyIP, setProxyIP] = useState('')
  const [adminPass, setAdminPass] = useState('')
  const [workerSource, setWorkerSource] = useState('edgetunnel')

  const [showTokenForm, setShowTokenForm] = useState(false)
  const [tokenName, setTokenName] = useState('')
  const [tokenValue, setTokenValue] = useState('')

  useEffect(() => { loadData() }, [])

  const loadData = async () => {
    try {
      const [deps, toks] = await Promise.all([deployments.list(), tokens.list()])
      setWorkers(deps)
      setTokensList(toks)
    } catch {}
    setLoading(false)
  }

  const handleDeploy = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!workerName || !selectedToken) return
    setDeploying(true)
    setDeployLog('در حال استقرار...')
    try {
      await deployments.create({ name: workerName, uuid: genUUID(), cf_token_id: selectedToken, proxyip: proxyIP || undefined, admin_password: adminPass || undefined, worker_source: workerSource })
      setDeployLog('✅ استقرار آغاز شد!')
      setTimeout(() => { setShowDeploy(false); setDeploying(false); setDeployLog(''); loadData() }, 2000)
    } catch (err: unknown) {
      setDeployLog(`❌ ${err instanceof Error ? err.message : 'خطا'}`)
      setDeploying(false)
    }
  }

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`ورکر "${name}" حذف شود؟`)) return
    try { await deployments.remove(id); loadData() } catch {}
  }

  const handleAddToken = async (e: React.FormEvent) => {
    e.preventDefault()
    try { await tokens.create(tokenName, tokenValue); setShowTokenForm(false); setTokenName(''); setTokenValue(''); loadData() } catch (err: unknown) { alert(err instanceof Error ? err.message : 'خطا') }
  }

  const handleDeleteToken = async (id: string) => {
    if (!confirm('توکن حذف شود؟')) return
    try { await tokens.remove(id); loadData() } catch {}
  }

  const copyLink = (url: string, uuid: string) => { navigator.clipboard.writeText(`${url}/sub?token=${uuid}`) }

  const statusBadge = (status: string) => {
    switch (status) {
      case 'deployed': return <span className="badge-green">مستقر</span>
      case 'deploying': return <span className="badge-yellow"><Loader2 className="w-3 h-3 animate-spin" /> در حال استقرار</span>
      case 'failed': return <span className="badge-red"><AlertCircle className="w-3 h-3" /> ناموفق</span>
      default: return <span className="badge-blue">{status}</span>
    }
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">ورکرها</h1>
          <p className="page-subtitle">استقرار و مدیریت ورکرهای پروکسی</p>
        </div>
        <div className="flex gap-2 self-start">
          <button onClick={() => setShowTokenForm(true)} className="btn-secondary flex items-center gap-1.5 text-xs sm:text-sm">
            <Plus className="w-3.5 h-3.5" /> <span className="hidden sm:inline">توکن CF</span><span className="sm:hidden">توکن</span>
          </button>
          <button onClick={() => setShowDeploy(true)} className="btn-primary flex items-center gap-1.5 text-xs sm:text-sm" disabled={tokensList.length === 0}>
            <Plus className="w-3.5 h-3.5" /> <span className="hidden sm:inline">ورکر جدید</span><span className="sm:hidden">جدید</span>
          </button>
        </div>
      </div>

      {/* Tokens */}
      {tokensList.length > 0 && (
        <div className="card mb-4 sm:mb-6">
          <h2 className="text-sm sm:text-base font-semibold mb-3 flex items-center gap-2">🔑 توکن‌های Cloudflare</h2>
          <div className="space-y-2">
            {tokensList.map(t => (
              <div key={t.id} className="flex items-center justify-between bg-gray-800/50 rounded-xl px-3 sm:px-4 py-2.5">
                <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                  <span className="font-medium text-sm truncate">{t.name}</span>
                  <span className="text-[10px] sm:text-xs text-gray-500 font-mono hidden sm:inline">{t.token.slice(0, 12)}...{t.token.slice(-4)}</span>
                  <span className="badge-green">فعال</span>
                </div>
                <button onClick={() => handleDeleteToken(t.id)} className="text-red-400 hover:text-red-300 p-1 shrink-0"><Trash2 className="w-4 h-4" /></button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Workers */}
      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 text-brand-400 animate-spin" /></div>
      ) : workers.length === 0 ? (
        <div className="card text-center py-12 sm:py-16">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
            <Plus className="w-6 h-6 sm:w-8 sm:h-8 text-gray-600" />
          </div>
          <h3 className="text-lg sm:text-xl font-semibold mb-2">هنوز ورکری ندارید</h3>
          <p className="text-gray-500 text-xs sm:text-sm mb-4 sm:mb-6">اول یک توکن Cloudflare اضافه کنید</p>
          <button onClick={() => setShowTokenForm(true)} className="btn-primary text-sm">افزودن توکن CF</button>
        </div>
      ) : (
        <div className="grid-2">
          {workers.map(w => (
            <motion.div key={w.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card">
              <div className="flex items-start justify-between mb-2 sm:mb-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h3 className="text-base sm:text-lg font-semibold truncate">{w.name}</h3>
                    {statusBadge(w.status)}
                  </div>
                  <span className="worker-url">{w.worker_url || '—'}</span>
                </div>
                <button onClick={() => handleDelete(w.id, w.name)} className="text-red-400/60 hover:text-red-400 p-1 shrink-0"><Trash2 className="w-4 h-4" /></button>
              </div>

              <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-3">
                <span className="badge-blue">{w.method}</span>
                <span className="badge">{w.worker_source || 'edgetunnel'}</span>
                {w.kv_namespace_id && <span className="badge-green">KV</span>}
              </div>

              {w.status === 'deployed' && w.worker_url && (
                <div className="sub-link mb-3">
                  <code>{w.worker_url}/sub?token={w.uuid}</code>
                  <button onClick={() => copyLink(w.worker_url, w.uuid)} className="text-brand-400 hover:text-brand-300 shrink-0"><Copy className="w-3.5 h-3.5" /></button>
                </div>
              )}

              <div className="flex gap-2">
                {w.worker_url && (
                  <a href={w.worker_url} target="_blank" rel="noopener" className="btn-secondary btn-sm flex items-center gap-1 flex-1 justify-center">
                    <ExternalLink className="w-3 h-3" /> باز کردن
                  </a>
                )}
                {w.status === 'deployed' && (
                  <Link to={`/workers/${w.id}/members`} className="btn-primary btn-sm flex items-center gap-1 flex-1 justify-center">
                    <Users className="w-3 h-3" /> کاربران
                  </Link>
                )}
              </div>

              {w.error_message && (
                <div className="mt-2 bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2 text-[10px] sm:text-xs text-red-400">{w.error_message}</div>
              )}
            </motion.div>
          ))}
        </div>
      )}

      {/* Deploy Modal */}
      <AnimatePresence>
        {showDeploy && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="modal-overlay" onClick={() => { setShowDeploy(false); setDeployLog('') }}>
            <motion.div initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 100, opacity: 0 }} className="modal-content" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h2 className="text-lg sm:text-xl font-bold">🚀 استقرار ورکر</h2>
                <button onClick={() => { setShowDeploy(false); setDeployLog('') }} className="btn-icon text-gray-500 hover:text-gray-300"><X className="w-5 h-5" /></button>
              </div>
              {deployLog && (
                <div className={`rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 mb-4 text-xs sm:text-sm ${deployLog.startsWith('❌') ? 'bg-red-500/10 text-red-400 border border-red-500/30' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'}`}>{deployLog}</div>
              )}
              <form onSubmit={handleDeploy} className="space-y-3 sm:space-y-4">
                <div>
                  <label className="label">نام ورکر</label>
                  <input value={workerName} onChange={e => setWorkerName(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))} className="input" placeholder="my-proxy" required />
                </div>
                <div>
                  <label className="label">توکن Cloudflare</label>
                  <select value={selectedToken} onChange={e => setSelectedToken(e.target.value)} className="select" required>
                    <option value="">انتخاب کنید...</option>
                    {tokensList.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label">منبع ورکر</label>
                  <select value={workerSource} onChange={e => setWorkerSource(e.target.value)} className="select">
                    <option value="edgetunnel">ادج‌تونل (اصلی)</option>
                    <option value="proxypanel">پنل پروکسی (ترجمه شده)</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="label">ProxyIP</label>
                    <input value={proxyIP} onChange={e => setProxyIP(e.target.value)} className="input" placeholder="اختیاری" />
                  </div>
                  <div>
                    <label className="label">رمز ادمین</label>
                    <input value={adminPass} onChange={e => setAdminPass(e.target.value)} className="input" placeholder="admin123" />
                  </div>
                </div>
                <button type="submit" disabled={deploying} className="btn-primary w-full py-2.5 sm:py-3 disabled:opacity-50 flex items-center justify-center gap-2">
                  {deploying ? <><Loader2 className="w-4 h-4 animate-spin" /> در حال استقرار...</> : 'شروع استقرار'}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Token Modal */}
      <AnimatePresence>
        {showTokenForm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="modal-overlay" onClick={() => setShowTokenForm(false)}>
            <motion.div initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 100, opacity: 0 }} className="modal-content" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h2 className="text-lg sm:text-xl font-bold">🔑 افزودن توکن</h2>
                <button onClick={() => setShowTokenForm(false)} className="btn-icon text-gray-500 hover:text-gray-300"><X className="w-5 h-5" /></button>
              </div>
              <div className="bg-brand-600/10 border border-brand-500/30 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 mb-4 text-xs sm:text-sm text-brand-300">
                از <a href="https://dash.cloudflare.com/profile/api-tokens" target="_blank" className="underline">پنل Cloudflare</a> توکن بسازید با دسترسی Workers و KV و D1
              </div>
              <form onSubmit={handleAddToken} className="space-y-3 sm:space-y-4">
                <div><label className="label">نام توکن</label><input value={tokenName} onChange={e => setTokenName(e.target.value)} className="input" placeholder="my-token" required /></div>
                <div><label className="label">مقدار توکن</label><input value={tokenValue} onChange={e => setTokenValue(e.target.value)} className="input font-mono text-xs" placeholder="cfut_..." required /></div>
                <button type="submit" className="btn-primary w-full py-2.5 sm:py-3">ذخیره</button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
