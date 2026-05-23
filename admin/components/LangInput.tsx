'use client';

import type { LangBundle } from '@/lib/types';

interface Props {
  label?: string;
  value: LangBundle | null | undefined;
  onChange: (v: LangBundle) => void;
  textarea?: boolean;
  required?: boolean;
}

export default function LangInput({ label, value, onChange, textarea, required }: Props) {
  const v: LangBundle = value || { ru: '', uz: '' };
  const Field: any = textarea ? 'textarea' : 'input';
  return (
    <div className="space-y-2">
      {label && (
        <div className="label">
          {label} {required && <span className="text-red-500">*</span>}
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <div>
          <div className="text-xs text-gray-500 mb-1">RU</div>
          <Field
            className="input"
            rows={textarea ? 3 : undefined}
            value={v.ru || ''}
            onChange={(e: any) => onChange({ ...v, ru: e.target.value })}
            required={required}
          />
        </div>
        <div>
          <div className="text-xs text-gray-500 mb-1">UZ</div>
          <Field
            className="input"
            rows={textarea ? 3 : undefined}
            value={v.uz || ''}
            onChange={(e: any) => onChange({ ...v, uz: e.target.value })}
          />
        </div>
      </div>
    </div>
  );
}
