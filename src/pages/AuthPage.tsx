import { useState } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Server, Mail, Lock, Eye, EyeOff } from 'lucide-react'
import { auth, setToken } from '../lib/api'

export default function AuthPage() {
  const [searchParams] = useSearchParams()
  const isSignup = searchParams.get('mode') === 'signup'
  const [mode, setMode] = useState<'login' | 'signup'>(isSignup ? 'signup' : 'login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      if (mode === 'signup') await auth.signup(email, password)
      const result = await auth.login(email, password)
      setToken(result.token)
      navigate('/dashboard')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'خطا در اتصال')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8">
      <div className="absolute inset-0 bg-gradient-to-b from-brand-600/10 via-transparent to-transparent" />

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative w-full max-w-md">
        <Link to="/" className="flex items-center justify-center gap-2 sm:gap-3 mb-6 sm:mb-8">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-brand-600 rounded-xl flex items-center justify-center">
            <Server className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </div>
          <span className="text-lg sm:text-xl font-bold">پنل پروکسی</span>
        </Link>

        <div className="card glow">
          <h2 className="text-xl sm:text-2xl font-bold text-center mb-1">
            {mode === 'login' ? 'ورود به حساب' : 'ساخت حساب جدید'}
          </h2>
          <p className="text-gray-500 text-center text-xs sm:text-sm mb-6 sm:mb-8">
            {mode === 'login' ? 'ایمیل و رمز عبور خود را وارد کنید' : 'اطلاعات خود را وارد کنید'}
          </p>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-xs sm:text-sm rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 mb-4 text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
            <div>
              <label className="label">ایمیل</label>
              <div className="relative">
                <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="input pr-10" placeholder="example@email.com" required />
              </div>
            </div>
            <div>
              <label className="label">رمز عبور</label>
              <div className="relative">
                <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input type={showPass ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} className="input pr-10 pl-10" placeholder="حداقل ۶ کاراکتر" required minLength={6} />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full py-2.5 sm:py-3 text-sm sm:text-base disabled:opacity-50">
              {loading ? 'لطفاً صبر کنید...' : mode === 'login' ? 'ورود' : 'ساخت حساب'}
            </button>
          </form>

          <div className="text-center mt-4 sm:mt-6 text-xs sm:text-sm text-gray-500">
            {mode === 'login' ? (
              <>حساب ندارید؟ <button onClick={() => setMode('signup')} className="text-brand-400 hover:text-brand-300">ساخت حساب</button></>
            ) : (
              <>حساب دارید؟ <button onClick={() => setMode('login')} className="text-brand-400 hover:text-brand-300">ورود</button></>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  )
}
