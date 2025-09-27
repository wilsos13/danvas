cat > src/components/ui/button.tsx <<'EOF'
import React from 'react';

export function Button({ variant = 'default', className = '', ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'default' | 'secondary' }) {
  const base = 'px-4 py-2 rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-offset-2';
  const styles = variant === 'secondary'
    ? 'bg-gray-100 text-black hover:bg-gray-200'
    : 'bg-blue-600 text-white hover:bg-blue-700';
  return <button className={`${base} ${styles} ${className}`} {...props} />;
}
EOF
