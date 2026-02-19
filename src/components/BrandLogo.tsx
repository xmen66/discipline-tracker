export const SMASH_LOGO_DATA_URL = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA1MTIgNTEyIj4KICA8cmVjdCB3aWR0aD0iNTEyIiBoZWlnaHQ9IjUxMiIgcng9IjEyMCIgZmlsbD0iIzA1MDUwNSIvPgogIDxwYXRoIGQ9Ik0yODggMzJMMTI4IDI4OGg5NmwtMzIgMTkyTDM4NCAyMjRoLTk2bDY0LTE5MnoiIGZpbGw9IiMxMGI5ODEiIGZpbHRlcj0iZHJvcC1zaGFkb3coMCAwIDEwcHggIzEwYjk4MSkiLz4KPC9zdmc+";

import React from 'react';

export const BrandLogo: React.FC<{ className?: string }> = ({ className = "w-10 h-10" }) => (
  <div className={`rounded-xl flex items-center justify-center overflow-hidden bg-[#10b981] shadow-[0_0_20px_rgba(16,185,129,0.3)] ${className}`}>
    <img src={SMASH_LOGO_DATA_URL} alt="Smash" className="w-full h-full object-cover" />
  </div>
);
