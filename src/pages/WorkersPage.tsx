import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Server, Trash2, ExternalLink, Copy, Users, Settings, RefreshCw, Check, X, Loader2, AlertCircle } from 'lucide-react'
import { deployments, tokens } from '../lib/api'
import { genUUID } from '../lib/utils'

interface Worker { id: string; name: string; status: string; worker_url: string; uuid: string; method: string; worker_source: string; created_at: string; logs?: string; error_message?: string; kv_namespace_id?: string }
interface Token { id: string; name: string; token: string; status: string }

export default function WorkersPage() {
  const [workers, setWorkers] = useState<Worker[]>([])
  const [tokensList, setTokensList] = useState<Token[]>([])
  const [showDeploy, setShowDeploy] = useState(false)
  const [loading, setLoading] = useState(true)
  const [deploying, setDeploying] = useState(false)
  const [deployLog, setDeployLog] = useState('')
  const navigate = useNavigate()

  // Deploy form
  const [workerName, setWorkerName] = useState('')
  const [selectedToken, setSelectedToken] = useState('')
  const [proxyIP, setProxyIP] = useState('')
  const [adminPass, setAdminPass] = useState('')
  const [workerSource, setWorkerSource] = useState('edgetunnel')

  // Token form
  const [showTokenForm, setShowTokenForm] = useState(false)
  const [tokenName, setTokenName] = useState('')
  const [tokenValue, setTokenValue] = useState('')

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [deps, toks] = await Promise.all([deployments.list(), tokens.list()])
      setWorkers(deps)
      setTokensList(toks)
    } catch { /* ignore */ }
    setLoading(false)
  }

  const handleDeploy = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!workerName || !selectedToken) return
    setDeploying(true)
    setDeployLog('در حال استقرار...')
    try {
      const result = await deployments.create({
        name: workerName,
        uuid: genUUID(),
        cf_token_id: selectedToken,
        proxyip: proxyIP || undefined,
        admin_password: adminPass || undefined,
        worker_source: workerSource,
      })
      setDeployLog('✅ استقرار با موفقیت آغاز شد!')
      setTimeout(() => {
        setShowDeploy(false)
        setDeploying(false)
        setDeployLog('')
        loadData()
      }, 2000)
    } catch (err: unknown) {
      setDeployLog(`❌ ${err instanceof Error ? err.message : 'خطا در استقرار'}`)
      setDeploying(false)
    }
  }

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`ورکر "${name}" حذف شود؟`)) return
    try {
      await deployments.remove(id)
      loadData()
    } catch { /* ignore */ }
  }

  const handleAddToken = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await tokens.create(tokenName, tokenValue)
      setShowTokenForm(false)
      setTokenName('')
      setTokenValue('')
      loadData()
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'خطا')
    }
  }

  const handleDeleteToken = async (id: string) => {
    if (!confirm('توکن حذف شود؟')) return
    try {
      await tokens.remove(id)
      loadData()
    } catch { /* ignore */ }
  }

  const copySubLink = (workerUrl: string, uuid: string) => {
    const link = `${workerUrl}/sub?token=${uuid}`
    navigator.clipboard.writeText(link)
  }

  const statusBadge = (status: string) => {
    switch (status) {
      case 'deployed': return <span className="badge-green">مستقر</span>
      case 'deploying': return <span className="badge-yellow flex items-center gap-1"><Loader2 className="w-3 h-3 animate-spin" /> در حال استقرار</span>
      case 'failed': return <span className="badge-red flex items-center gap-1"><AlertCircle className="w-3 h-3" /> ناموفق</span>
      default: return <span className="badge-blue">{status}</span>
    }
  }

  return (
    <div className="min-h-screen p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">ورکرها</h1>
          <p className="text-gray-500 mt-1">استقرار و مدیریت ورکرهای پروکسی</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => setShowTokenForm(true)} className="btn-secondary flex items-center gap-2">
            <Plus className="w-4 h-4" />
            توکن CF
          </button>
          <button onClick={() => setShowDeploy(true)} className="btn-primary flex items-center gap-2" disabled={tokensList.length === 0}>
            <Plus className="w-4 h-4" />
            مستقر کردن ورکر
          </button>
        </div>
      </div>

      {/* Tokens Section */}
      <div className="card mb-6">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">🔑 توکن‌های Cloudflare</h2>
        {tokensList.length === 0 ? (
          <p className="text-gray-500 text-center py-4">هنوز توکنی اضافه نشده. اول یک توکن اضافه کنید.</p>
        ) : (
          <div className="space-y-2">
            {tokensList.map(t => (
              <div key={t.id} className="flex items-center justify-between bg-gray-800/50 rounded-xl px-4 py-3">
                <div className="flex items-center gap-3">
                  <span className="font-medium">{t.name}</span>
                  <span className="text-xs text-gray-500 font-mono">{t.token.slice(0, 12)}...{t.token.slice(-4)}</span>
                  <span className="badge-green">فعال</span>
                </div>
                <button onClick={() => handleDeleteToken(t.id)} className="text-red-400 hover:text-red-300 p-1">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Workers */}
      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 text-brand-400 animate-spin" /></div>
      ) : workers.length === 0 ? (
        <div className="card text-center py-16">
          <Server className="w-16 h-16 text-gray-700 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">هنوز ورکری ندارید</h3>
          <p className="text-gray-500 mb-6">اول یک توکن Cloudflare اضافه کنید، سپس ورکر مستقر کنید</p>
          <button onClick={() => setShowTokenForm(true)} className="btn-primary">افزودن توکن CF</button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {workers.map(w => (
            <motion.div key={w.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-lg font-semibold">{w.name}</h3>
                    {statusBadge(w.status)}
                  </div>
                  <span className="text-xs text-gray-500 font-mono">{w.worker_url || '—'}</span>
                </div>
                <button onClick={() => handleDelete(w.id, w.name)} className="text-red-400/60 hover:text-red-400 p-1">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                <span className="badge-blue">{w.method}</span>
                <span className="badge">{w.worker_source || 'edgetunnel'}</span>
                {w.kv_namespace_id && <span className="badge-green">KV متصل</span>}
              </div>

              {w.status === 'deployed' && w.worker_url && (
                <div className="bg-gray-800/50 rounded-xl p-3 mb-4">
                  <div className="text-xs text-gray-500 mb-2">لینک اشتراک:</div>
                  <div className="flex items-center gap-2">
                    <code className="text-xs text-brand-300 flex-1 truncate">{w.worker_url}/sub?token={w.uuid}</code>
                    <button onClick={() => copySubLink(w.worker_url, w.uuid)} className="text-brand-400 hover:text-brand-300 shrink-0">
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              <div className="flex gap-2">
                {w.worker_url && (
                  <a href={w.worker_url} target="_blank" rel="noopener" className="btn-secondary text-xs flex items-center gap-1 flex-1 justify-center">
                    <ExternalLink className="w-3 h-3" />
                    باز کردن
                  </a>
                )}
                {w.status === 'deployed' && (
                  <Link to={`/workers/${w.id}/members`} className="btn-primary text-xs flex items-center gap-1 flex-1 justify-center">
                    <Users className="w-3 h-3" />
                    مدیریت کاربران
                  </Link>
                )}
              </div>

              {w.error_message && (
                <div className="mt-3 bg-red-500/10 border border-red-500/30 rounded-xl px-3 py-2 text-xs text-red-400">
                  {w.error_message}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}

      {/* Deploy Modal */}
      <AnimatePresence>
        {showDeploy && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="card w-full max-w-lg glow">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">🚀 استقرار ورکر جدید</h2>
                <button onClick={() => { setShowDeploy(false); setDeployLog('') }} className="text-gray-500 hover:text-gray-300"><X className="w-5 h-5" /></button>
              </div>

              {deployLog && (
                <div className={`rounded-xl px-4 py-3 mb-4 text-sm ${deployLog.startsWith('❌') ? 'bg-red-500/10 text-red-400 border border-red-500/30' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'}`}>
                  {deployLog}
                </div>
              )}

              <form onSubmit={handleDeploy} className="space-y-4">
                <div>
                  <label className="label">نام ورکر (انگلیسی، بدون فاصله)</label>
                  <input value={workerName} onChange={e => setWorkerName(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))} className="input" placeholder="my-proxy" required pattern="[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?" />
                </div>
                <div>
                  <label className="label">منبع ورکر</label>
                  <select value={workerSource} onChange={e => setWorkerSource(e.target.value)} className="input">
                    <option value="edgetunnel">ادج‌تونل (اصلی)</option>
                    <option value="proxypanel">پنل پروکسی (ترجمه شده + مدیریت زیرمجموعه)</option>
                  </select>
                </div>
                <div>
                  <label className="label">توکن Cloudflare</label>
                  <select value={selectedToken} onChange={e => setSelectedToken(e.target.value)} className="input" required>
                    <option value="">انتخاب کنید...</option>
                    {tokensList.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label">ProxyIP (اختیاری)</label>
                  <input value={proxyIP} onChange={e => setProxyIP(e.target.value)} className="input" placeholder="104.17.0.1:443" />
                </div>
                <div>
                  <label className="label">رمز عبور ادمین ورکر (اختیاری)</label>
                  <input value={adminPass} onChange={e => setAdminPass(e.target.value)} className="input" placeholder="admin123" />
                </div>
                <button type="submit" disabled={deploying} className="btn-primary w-full py-3 text-lg disabled:opacity-50 flex items-center justify-center gap-2">
                  {deploying ? <><Loader2 className="w-5 h-5 animate-spin" /> در حال استقرار...</> : 'شروع استقرار'}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Token Modal */}
      <AnimatePresence>
        {showTokenForm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="card w-full max-w-md">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">🔑 افزودن توکن Cloudflare</h2>
                <button onClick={() => setShowTokenForm(false)} className="text-gray-500 hover:text-gray-300"><X className="w-5 h-5" /></button>
              </div>
              <div className="bg-brand-600/10 border border-brand-500/30 rounded-xl px-4 py-3 mb-4 text-sm text-brand-300">
                <strong>راهنما:</strong> از <a href="https://dash.cloudflare.com/profile/api-tokens" target="_blank" className="underline">پنل Cloudflare</a> یک توکن بسازید با دسترسی‌های:
                <ul className="list-disc list-inside mt-2 text-brand-400/80">
                  <li>Cloudflare Workers: Edit</li>
                  <li>Cloudflare KV Storage: Edit</li>
                  <li>Account Settings: Read</li>
                </ul>
              </div>
              <form onSubmit={handleAddToken} className="space-y-4">
                <div>
                  <label className="label">نام توکن</label>
                  <input value={tokenName} onChange={e => setTokenName(e.target.value)} className="input" placeholder="my-token" required />
                </div>
                <div>
                  <label className="label">مقدار توکن</label>
                  <input value={tokenValue} onChange={e => setTokenValue(e.target.value)} className="input font-mono text-xs" placeholder="xxxxxxxxxxxxxxxxxxxxxxx_xxxxxxxxx" required />
                </div>
                <button type="submit" className="btn-primary w-full py-3">ذخیره توکن</button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
