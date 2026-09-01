interface QRCodeViewProps {
  value: string
  size?: number
  className?: string
}

export function QRCodeView({ size = 160, className = '' }: QRCodeViewProps) {
  return (
    <div
      className={`qr-code-view ${className}`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        background: '#ffffff',
        padding: '12px',
        borderRadius: '12px',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
        display: 'grid',
        placeItems: 'center',
        position: 'relative'
      }}
    >
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Background */}
        <rect width="100" height="100" fill="#FFFFFF" rx="4" />
        
        {/* Finder Pattern Top-Left */}
        <rect x="6" y="6" width="28" height="28" fill="#0A0908" rx="4" />
        <rect x="12" y="12" width="16" height="16" fill="#FFFFFF" rx="2" />
        <rect x="16" y="16" width="8" height="8" fill="#D4AF37" rx="1" />

        {/* Finder Pattern Top-Right */}
        <rect x="66" y="6" width="28" height="28" fill="#0A0908" rx="4" />
        <rect x="72" y="12" width="16" height="16" fill="#FFFFFF" rx="2" />
        <rect x="76" y="16" width="8" height="8" fill="#D4AF37" rx="1" />

        {/* Finder Pattern Bottom-Left */}
        <rect x="6" y="66" width="28" height="28" fill="#0A0908" rx="4" />
        <rect x="12" y="72" width="16" height="16" fill="#FFFFFF" rx="2" />
        <rect x="16" y="76" width="8" height="8" fill="#D4AF37" rx="1" />

        {/* Simulated QR Data Matrix Modules */}
        <rect x="40" y="8" width="6" height="6" fill="#0A0908" rx="1" />
        <rect x="52" y="8" width="6" height="6" fill="#0A0908" rx="1" />
        <rect x="40" y="20" width="18" height="6" fill="#0A0908" rx="1" />
        <rect x="46" y="30" width="6" height="12" fill="#0A0908" rx="1" />
        
        <rect x="8" y="40" width="6" height="18" fill="#0A0908" rx="1" />
        <rect x="20" y="46" width="12" height="6" fill="#0A0908" rx="1" />
        
        <rect x="66" y="40" width="12" height="6" fill="#0A0908" rx="1" />
        <rect x="82" y="40" width="6" height="18" fill="#0A0908" rx="1" />
        <rect x="72" y="52" width="16" height="6" fill="#0A0908" rx="1" />

        <rect x="40" y="66" width="6" height="12" fill="#0A0908" rx="1" />
        <rect x="52" y="72" width="12" height="6" fill="#0A0908" rx="1" />
        <rect x="40" y="84" width="18" height="6" fill="#0A0908" rx="1" />
        
        <rect x="66" y="66" width="12" height="12" fill="#0A0908" rx="2" />
        <rect x="84" y="66" width="6" height="6" fill="#D4AF37" rx="1" />
        <rect x="72" y="84" width="18" height="6" fill="#0A0908" rx="1" />

        {/* Center Brand Badge Overlay */}
        <rect x="38" y="38" width="24" height="24" fill="#0A0908" rx="4" stroke="#D4AF37" strokeWidth="2" />
        <text x="50" y="53" fill="#D4AF37" fontSize="10" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">HC</text>
      </svg>
    </div>
  )
}
