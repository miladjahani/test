import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { LogOut, Key, Shield, Trash2 } from 'lucide-react'
import { clearToken } from '../lib/api'

export default function SettingsPage() {
  const navigate = useNavigate()

  const handleLogout = () => {
    clearToken()
    navigate('/')
  }

  return (
    <div className="min-h-screen p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">تنظیمات</h1>

      <div className="space-y-4">
        <div className="card">
          <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
            <Key className="w-5 h-5 text-amber-400" />
            توکن‌های Cloudflare
          </h2>
          <p className="text-gray-500 text-sm mb-4">
            توکن‌ها را از صفحه <a href="https://dash.cloudflare.com/profile/api-tokens" target="_blank" className="text-brand-400 underline">تنظیمات API</a> Cloudflare بسازید.
          </p>
          <p className="text-gray-500 text-sm">
            دسترسی‌های مورد نیاز: <code className="bg-gray-800 px-1.5 py-0.5 rounded text-brand-300 text-xs">Workers:Edit</code> و <code className="bg-gray-800 px-1.5 py-0.5 rounded text-brand-300 text-xs">KV:Edit</code>
          </p>
        </div>

        <div className="card">
          <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
            <Shield className="w-5 h-5 text-emerald-400" />
            امنیت
          </h2>
          <p className="text-gray-500 text-sm">
            رمز عبور خود را از طریق صفحه ورود تغییر دهید. توکن‌های Cloudflare شما فقط در دیتابیس ذخیره می‌شوند و هرگز نمایش داده نمی‌شوند.
          </p>
        </div>

        <button onClick={handleLogout} className="btn-danger flex items-center gap-2 w-full justify-center py-3">
          <LogOut className="w-5 h-5" />
          خروج از حساب
        </button>
      </div>
    </div>
  )
}
