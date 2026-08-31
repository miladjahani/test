import { useNavigate } from 'react-router-dom'
import { LogOut, Key, Shield } from 'lucide-react'
import { clearToken } from '../lib/api'

export default function SettingsPage() {
  const navigate = useNavigate()
  const handleLogout = () => { clearToken(); navigate('/') }

  return (
    <div className="page-container max-w-3xl">
      <h1 className="page-title mb-6 sm:mb-8">تنظیمات</h1>
      <div className="space-y-4">
        <div className="card">
          <h2 className="text-base sm:text-lg font-semibold flex items-center gap-2 mb-3 sm:mb-4"><Key className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" /> توکن‌های Cloudflare</h2>
          <p className="text-gray-500 text-xs sm:text-sm mb-2">توکن‌ها را از صفحه <a href="https://dash.cloudflare.com/profile/api-tokens" target="_blank" className="text-brand-400 underline">تنظیمات API</a> Cloudflare بسازید.</p>
          <p className="text-gray-500 text-xs sm:text-sm">دسترسی‌ها: <code className="bg-gray-800 px-1.5 py-0.5 rounded text-brand-300 text-xs">Workers:Edit</code> و <code className="bg-gray-800 px-1.5 py-0.5 rounded text-brand-300 text-xs">KV:Edit</code> و <code className="bg-gray-800 px-1.5 py-0.5 rounded text-brand-300 text-xs">D1:Edit</code></p>
        </div>
        <div className="card">
          <h2 className="text-base sm:text-lg font-semibold flex items-center gap-2 mb-3 sm:mb-4"><Shield className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" /> امنیت</h2>
          <p className="text-gray-500 text-xs sm:text-sm">رمز عبور خود را از طریق صفحه ورود تغییر دهید. توکن‌های Cloudflare فقط در دیتابیس ذخیره می‌شوند.</p>
        </div>
        <button onClick={handleLogout} className="btn-danger w-full py-2.5 sm:py-3 flex items-center justify-center gap-2">
          <LogOut className="w-4 h-4 sm:w-5 sm:h-5" /> خروج از حساب
        </button>
      </div>
    </div>
  )
}
