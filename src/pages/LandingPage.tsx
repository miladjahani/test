import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Shield, Zap, Users, Globe, Server, Lock, ArrowLeft, Rocket, Settings, BarChart3 } from 'lucide-react'

const features = [
  { icon: Rocket, title: 'استقرار یک‌کلیکی', desc: 'ورکر پروکسی را با یک کلیک روی Cloudflare مستقر کنید' },
  { icon: Users, title: 'مدیریت کاربران', desc: 'زیرمجموعه با محدودیت حجم، زمان و تعداد دستگاه' },
  { icon: Shield, title: 'امنیت پیشرفته', desc: 'رمزنگاری TLS، Fragment و ECH برای دور زدن محدودیت‌ها' },
  { icon: Zap, title: 'سرعت بالا', desc: 'اتصال مستقیم به شبکه جهانی Cloudflare' },
  { icon: Globe, title: 'چند پروتکل', desc: 'VLESS، Trojan، Shadowsocks، WebSocket، gRPC، XHTTP' },
  { icon: BarChart3, title: 'آمار و گزارش', desc: 'مشاهده مصرف ترافیک و وضعیت اتصال کاربران' },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-brand-600/20 via-transparent to-transparent" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] sm:w-[800px] h-[300px] sm:h-[400px] bg-brand-500/10 rounded-full blur-[80px] sm:blur-[120px]" />

        <nav className="relative z-10 flex items-center justify-between px-4 sm:px-6 py-4 max-w-7xl mx-auto">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 bg-brand-600 rounded-xl flex items-center justify-center">
              <Server className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <span className="text-base sm:text-lg font-bold">پنل پروکسی</span>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <Link to="/auth" className="btn-secondary text-xs sm:text-sm px-3 sm:px-4">ورود</Link>
            <Link to="/auth?mode=signup" className="btn-primary text-xs sm:text-sm px-3 sm:px-4">شروع رایگان</Link>
          </div>
        </nav>

        <div className="relative z-10 max-w-4xl mx-auto text-center px-4 sm:px-6 pt-12 sm:pt-20 pb-20 sm:pb-32">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="inline-flex items-center gap-2 bg-brand-600/20 border border-brand-500/30 rounded-full px-3 sm:px-4 py-1.5 mb-4 sm:mb-6">
              <Zap className="w-3 h-3 sm:w-4 sm:h-4 text-brand-400" />
              <span className="text-xs sm:text-sm text-brand-300">سریع، امن و رایگان</span>
            </div>
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-black leading-tight mb-4 sm:mb-6">
              مدیریت <span className="text-brand-400">پروکسی</span> خودت رو<br className="hidden sm:block" /> دست بگیر
            </h1>
            <p className="text-base sm:text-xl text-gray-400 mb-6 sm:mb-10 max-w-2xl mx-auto leading-relaxed">
              با یک کلیک ورکر پروکسی روی Cloudflare بسازید. کاربران زیرمجموعه اضافه کنید.
              حجم، زمان و محدودیت تعیین کنید. همه‌چیز رایگان و فارسی.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
              <Link to="/auth?mode=signup" className="btn-primary text-base sm:text-lg px-6 sm:px-8 py-2.5 sm:py-3 glow w-full sm:w-auto flex items-center justify-center gap-2">
                شروع کنید
                <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              </Link>
              <a href="#features" className="btn-secondary text-base sm:text-lg px-6 sm:px-8 py-2.5 sm:py-3 w-full sm:w-auto text-center">امکانات</a>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Stats */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 -mt-12 sm:-mt-16 mb-12 sm:mb-20">
        <div className="grid grid-cols-3 gap-2 sm:gap-4">
          {[
            { value: 'رایگان', label: 'هزینه استقرار' },
            { value: '۶ پروتکل', label: 'پروتکل پشتیبانی' },
            { value: '۰.۵ ثانیه', label: 'زمان استقرار' },
          ].map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.1 }} className="card text-center py-3 sm:py-6">
              <div className="text-lg sm:text-2xl font-bold text-brand-400">{s.value}</div>
              <div className="text-[10px] sm:text-sm text-gray-500 mt-0.5 sm:mt-1">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Features */}
      <div id="features" className="max-w-6xl mx-auto px-4 sm:px-6 pb-16 sm:pb-24">
        <div className="text-center mb-10 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold mb-2 sm:mb-4">امکانات پنل</h2>
          <p className="text-sm sm:text-base text-gray-400 max-w-xl mx-auto">همه‌چیزی که برای مدیریت حرفه‌ای پروکسی نیاز دارید</p>
        </div>
        <div className="grid-3">
          {features.map((f, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * i }}
              className="card-hover group">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-brand-600/20 rounded-xl flex items-center justify-center mb-3 sm:mb-4 group-hover:bg-brand-600/30 transition-colors">
                <f.icon className="w-5 h-5 sm:w-6 sm:h-6 text-brand-400" />
              </div>
              <h3 className="text-base sm:text-lg font-semibold mb-1 sm:mb-2">{f.title}</h3>
              <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* How it works */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pb-16 sm:pb-24">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12">چطور کار می‌کند؟</h2>
        <div className="space-y-3 sm:space-y-6">
          {[
            { step: '۱', title: 'توکن Cloudflare بسازید', desc: 'از پنل Cloudflare یک API Token با دسترسی Workers بسازید', icon: Lock },
            { step: '۲', title: 'ورکر را مستقر کنید', desc: 'نام ورکر را انتخاب کنید و با یک کلیک مستقر شود', icon: Settings },
            { step: '۳', title: 'کاربران زیرمجموعه بسازید', desc: 'برای هر کاربر UUID اختصاصی، حجم و زمان تعیین کنید', icon: Users },
          ].map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 * i }}
              className="flex items-start gap-3 sm:gap-5 card">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-brand-600 rounded-xl flex items-center justify-center shrink-0 text-white font-bold text-base sm:text-lg">
                {s.step}
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-semibold mb-0.5 sm:mb-1">{s.title}</h3>
                <p className="text-xs sm:text-sm text-gray-400">{s.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-6 sm:py-8 text-center text-gray-500 text-xs sm:text-sm">
        <p>ساخته شده برای جامعه فارسی‌زبان ⚡</p>
      </footer>
    </div>
  )
}
