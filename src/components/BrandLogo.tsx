// Black logo inside, Neon surrounding
// Attractive High-Contrast Logo: Neon Emerald background, Black Zap inside (scaled small)
// Black logo inside, Neon surrounding
// Attractive High-Contrast Logo: Neon Emerald background, Black Zap inside (scaled slightly larger)
export const SMASH_LOGO_DATA_URL = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA1MTIgNTEyIj4KICA8ZyBmaWx0ZXI9InVybCgjZ2xvdykiPgogICAgPHJlY3Qgd2lkdGg9IjUxMiIgaGVpZ2h0PSI1MTIiIHJ4PSIxNDAiIGZpbGw9IiMxMGI5ODEiLz4KICAgIDxyZWN0IHdpZHRoPSI0ODAiIGhlaWdodD0iNDgwIiB4PSIxNiIgeT0iMTYiIHJ4PSIxMzAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjMiIHN0cm9rZS13aWR0aD0iMiIvPgogIDwvZz4KICA8cGF0aCBkPSJNMzA0IDk2TDE3MiAzMTJoNzJsLTI4IDEwNEwzNDAgMjY0aC03Mmw0OC0xNjh6IiBmaWxsPSIjMDUwNTA1Ii8+CiAgPGRlZnM+CiAgICA8ZmlsdGVyIGlkPSJnbG93IiB4PSItMjAlIiB5PSItMjAlIiB3aWR0aD0iMTQwJSIgaGVpZ2h0PSIxNDAlIj4KICAgICAgPGZlR2F1c3NpYW5CbHVyIHN0ZERldmlhdGlvbj0iMTAiIHJlc3VsdD0iYmx1ciIvPgogICAgICA8ZmVDb21wb3NpdGUgaW49IlNvdXJjZUdyYXBoaWMiIGluMj0iYmx1ciIgb3BlcmF0b3I9Im92ZXIiLz4KICAgIDwvZmlsdGVyPgogIDwvZGVmcz4KPC9zdmc+";

import React from 'react';

export const BrandLogo: React.FC<{ className?: string }> = ({ className = "w-10 h-10" }) => (
  <div className={`rounded-xl flex items-center justify-center overflow-hidden bg-[#10b981] shadow-[0_0_20px_rgba(16,185,129,0.3)] ${className}`}>
    <img src={SMASH_LOGO_DATA_URL} alt="Smash" className="w-full h-full object-cover p-1" />
  </div>
);
