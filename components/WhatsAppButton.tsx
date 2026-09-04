'use client';

import { useSiteConfig } from '../lib/use-site-config';
import { FaWhatsapp } from 'react-icons/fa';

// Floating WhatsApp button. Number / message / on-off are managed from the
// "Atulya Control Panel" WordPress plugin.
export default function WhatsAppButton() {
  const { whatsapp } = useSiteConfig();

  if (!whatsapp.enabled || !whatsapp.number) return null;

  const href = `https://wa.me/${whatsapp.number}?text=${encodeURIComponent(whatsapp.message || '')}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      style={{
        position: 'fixed',
        bottom: 20,
        right: 20,
        zIndex: 90,
        width: 56,
        height: 56,
        borderRadius: '50%',
        background: '#25D366',
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 6px 20px rgba(37,211,102,0.45)',
        transition: 'transform 0.2s',
      }}
      onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.transform = 'scale(1.08)')}
      onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.transform = 'none')}
    >
      <FaWhatsapp size={30} />
    </a>
  );
}
