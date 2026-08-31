export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}

export function formatBytes(bytes: number): string {
  if (!bytes || bytes === 0) return '۰ بایت';
  const k = 1024;
  const sizes = ['بایت', 'کیلوبایت', 'مگابایت', 'گیگابایت', 'ترابایت'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export function formatDate(date: string | null): string {
  if (!date) return '—';
  return new Date(date).toLocaleDateString('fa-IR', { year: 'numeric', month: 'short', day: 'numeric' });
}

export function timeAgo(date: string): string {
  if (!date) return '—';
  const diff = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (diff < 60) return 'همین الان';
  if (diff < 3600) return `${Math.floor(diff / 60)} دقیقه پیش`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} ساعت پیش`;
  return `${Math.floor(diff / 86400)} روز پیش`;
}

export function genUUID(): string {
  return crypto.randomUUID?.() ?? 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });
}

export const ACTION_LABELS: Record<string, string> = {
  token_created: 'توکن جدید ساخته شد',
  token_deleted: 'توکن حذف شد',
  deployment_created: 'ورکر جدید مستقر شد',
  deployment_deployed: 'ورکر با موفقیت مستقر شد',
  deployment_failed: 'استقرار ورکر ناموفق بود',
  deployment_deleted: 'ورکر حذف شد',
  member_created: 'کاربر زیرمجموعه اضافه شد',
  member_deleted: 'کاربر زیرمجموعه حذف شد',
};
