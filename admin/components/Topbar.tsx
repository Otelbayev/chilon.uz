'use client';

export default function Topbar({ title, action }: { title: string; action?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-3">
      <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
      {action}
    </div>
  );
}
