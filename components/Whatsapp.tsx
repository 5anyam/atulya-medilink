import { IconBrandWhatsapp } from '@tabler/icons-react';
import Link from 'next/link';

function Whatsapp() {
  return (
    <Link
      passHref
      href="https://api.whatsapp.com/send?phone=918851180015"
      target="_blank"
      rel="noopener noreferrer"
      style={{ position: 'fixed', bottom: 90, right: 20, zIndex: 999, display: 'block' }}
    >
      <div style={{ position: 'relative', width: 52, height: 52 }}>
        <IconBrandWhatsapp
          style={{
            background: '#25d366',
            color: 'white',
            height: 52,
            width: 52,
            borderRadius: 12,
            padding: 8,
            display: 'block',
            boxShadow: '0 4px 14px rgba(37,211,102,0.45)',
          }}
        />
      </div>
    </Link>
  );
}

export default Whatsapp;