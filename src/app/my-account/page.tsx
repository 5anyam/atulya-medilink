'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../../lib/auth-context';
import { Package, LogOut, ShoppingBag, ChevronDown, ChevronUp, X, CheckCircle2, Clock, Truck, Star } from 'lucide-react';

interface OrderItem {
  name: string;
  quantity: number;
  price: string;
}

interface Order {
  id: number;
  order_number: string;
  date_created: string;
  status: string;
  total: string | number;
  items: OrderItem[];
}

/* ─── Status step config ─── */
const STATUS_STEPS = [
  { key: 'placed',     label: 'Order Placed',  icon: '🛒' },
  { key: 'processing', label: 'Processing',     icon: '📦' },
  { key: 'shipped',    label: 'Shipped',        icon: '🚚' },
  { key: 'delivered',  label: 'Delivered',      icon: '✅' },
];

function getStepIndex(status: string): number {
  switch (status) {
    case 'pending':    return 0;
    case 'processing':
    case 'on-hold':    return 1;
    case 'shipped':    return 2;
    case 'completed':  return 3;
    default:           return 0;
  }
}

function StatusBadge({ status }: { status: string }) {
  const cfg: Record<string, { bg: string; color: string; label: string }> = {
    pending:    { bg: '#fef3c7', color: '#d97706', label: 'Pending' },
    processing: { bg: '#dbeafe', color: '#1d4ed8', label: 'Processing' },
    'on-hold':  { bg: '#f3e8ff', color: '#7c3aed', label: 'On Hold' },
    completed:  { bg: '#dcfce7', color: '#15803d', label: 'Delivered' },
    cancelled:  { bg: '#fee2e2', color: '#b91c1c', label: 'Cancelled' },
    refunded:   { bg: '#f1f5f9', color: '#475569', label: 'Refunded' },
  };
  const c = cfg[status] ?? { bg: '#f4f4f5', color: '#6b7280', label: status };
  return (
    <span style={{ background: c.bg, color: c.color, fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', padding: '4px 10px', borderRadius: 20 }}>
      {c.label}
    </span>
  );
}

function OrderTracker({ status }: { status: string }) {
  if (status === 'cancelled' || status === 'refunded') {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '14px 16px', background: '#fee2e2', border: '1px solid #fecaca', borderRadius: 12, marginTop: 16 }}>
        <X size={18} color="#b91c1c" />
        <div>
          <p style={{ fontSize: 13, fontWeight: 700, color: '#b91c1c' }}>
            {status === 'cancelled' ? 'Order Cancelled' : 'Order Refunded'}
          </p>
          <p style={{ fontSize: 12, color: '#ef4444', marginTop: 2 }}>
            {status === 'cancelled' ? 'Your order has been cancelled. Refund will be processed in 5-7 business days.' : 'Refund has been initiated.'}
          </p>
        </div>
      </div>
    );
  }

  const activeStep = getStepIndex(status);

  return (
    <div style={{ marginTop: 16, padding: '16px 0 4px' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', position: 'relative' }}>
        {/* Progress line */}
        <div style={{ position: 'absolute', top: 18, left: 'calc(12.5% - 1px)', right: 'calc(12.5% - 1px)', height: 3, background: '#e5e7eb', borderRadius: 2, zIndex: 0 }}>
          <div style={{
            height: '100%',
            borderRadius: 2,
            background: 'linear-gradient(90deg, #0d9488, #059669)',
            width: `${(activeStep / (STATUS_STEPS.length - 1)) * 100}%`,
            transition: 'width 0.5s ease',
          }} />
        </div>

        {STATUS_STEPS.map((step, i) => {
          const done    = i <= activeStep;
          const current = i === activeStep;
          return (
            <div key={step.key} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', zIndex: 1 }}>
              <div style={{
                width: 36, height: 36, borderRadius: '50%',
                background: done ? (current ? '#0d9488' : '#059669') : '#fff',
                border: `3px solid ${done ? '#0d9488' : '#e5e7eb'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 16,
                boxShadow: current ? '0 0 0 4px rgba(13,148,136,0.18)' : 'none',
                transition: 'all 0.3s',
              }}>
                {done ? (current ? step.icon : <CheckCircle2 size={16} color="#fff" />) : (
                  <span style={{ fontSize: 14 }}>{step.icon}</span>
                )}
              </div>
              <p style={{ fontSize: 10, fontWeight: current ? 700 : 500, color: done ? '#0d9488' : '#9ca3af', marginTop: 8, textAlign: 'center', lineHeight: 1.3, whiteSpace: 'nowrap' }}>
                {step.label}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function OrderCard({ order, token, onCancelled }: { order: Order; token: string; onCancelled: () => void }) {
  const [expanded, setExpanded]         = useState(false);
  const [cancelling, setCancelling]     = useState(false);
  const [cancelError, setCancelError]   = useState('');
  const [showConfirm, setShowConfirm]   = useState(false);

  const canCancel = ['pending', 'processing', 'on-hold'].includes(order.status);
  const date = new Date(order.date_created).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  const total = typeof order.total === 'number' ? order.total.toLocaleString('en-IN') : Number(order.total).toLocaleString('en-IN');

  async function handleCancel() {
    setCancelling(true);
    setCancelError('');
    try {
      const res = await fetch(`/api/orders/${order.id}/cancel`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setShowConfirm(false);
        onCancelled();
      } else {
        setCancelError(data.message || 'Could not cancel order.');
      }
    } catch {
      setCancelError('Network error. Please try again.');
    } finally {
      setCancelling(false);
    }
  }

  return (
    <div style={{ background: '#fff', border: '1px solid #f0f0f0', borderRadius: 16, overflow: 'hidden', boxShadow: '0 1px 6px rgba(0,0,0,0.05)', marginBottom: 16 }}>
      {/* Header row */}
      <div style={{ padding: '18px 20px', display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 160 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <p style={{ fontSize: 15, fontWeight: 800, color: '#111' }}>Order #{order.order_number}</p>
            <StatusBadge status={order.status} />
          </div>
          <p style={{ fontSize: 12, color: '#9ca3af' }}>{date} · {order.items.length} item{order.items.length !== 1 ? 's' : ''}</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <p style={{ fontSize: 22, fontWeight: 900, color: '#111' }}>₹{total}</p>
          <button
            onClick={() => setExpanded(e => !e)}
            style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 600, color: '#0d9488', background: '#f0fdf9', border: '1px solid #99f6e4', borderRadius: 8, padding: '6px 12px', cursor: 'pointer' }}
          >
            {expanded ? 'Hide' : 'Details'} {expanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
          </button>
        </div>
      </div>

      {/* Status tracker */}
      <div style={{ padding: '0 20px 20px' }}>
        <OrderTracker status={order.status} />
      </div>

      {/* Expanded details */}
      {expanded && (
        <div style={{ borderTop: '1px solid #f0f0f0', padding: '16px 20px', background: '#fafafa' }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#9ca3af', marginBottom: 12 }}>Items Ordered</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {order.items.map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', background: '#fff', border: '1px solid #f0f0f0', borderRadius: 10 }}>
                <div style={{ width: 36, height: 36, background: '#f0fdf9', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Package size={16} color="#0d9488" />
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 13, fontWeight: 600, color: '#111', lineHeight: 1.3 }}>{item.name}</p>
                  <p style={{ fontSize: 12, color: '#9ca3af' }}>Qty: {item.quantity} × ₹{item.price}</p>
                </div>
                <p style={{ fontSize: 13, fontWeight: 700, color: '#111' }}>₹{(Number(item.price) * item.quantity).toLocaleString('en-IN')}</p>
              </div>
            ))}
          </div>

          {/* Cancel section */}
          {canCancel && (
            <div style={{ marginTop: 16 }}>
              {!showConfirm ? (
                <button
                  onClick={() => setShowConfirm(true)}
                  style={{ fontSize: 13, fontWeight: 600, color: '#b91c1c', background: '#fee2e2', border: '1px solid #fecaca', borderRadius: 8, padding: '8px 18px', cursor: 'pointer' }}
                >
                  Cancel Order
                </button>
              ) : (
                <div style={{ background: '#fff7f7', border: '1px solid #fecaca', borderRadius: 12, padding: '14px 16px' }}>
                  <p style={{ fontSize: 13, fontWeight: 600, color: '#111', marginBottom: 12 }}>Are you sure you want to cancel this order?</p>
                  {cancelError && <p style={{ fontSize: 12, color: '#b91c1c', marginBottom: 10 }}>{cancelError}</p>}
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button
                      onClick={handleCancel}
                      disabled={cancelling}
                      style={{ padding: '8px 18px', background: '#b91c1c', color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: cancelling ? 'not-allowed' : 'pointer', opacity: cancelling ? 0.7 : 1 }}
                    >
                      {cancelling ? 'Cancelling...' : 'Yes, Cancel'}
                    </button>
                    <button
                      onClick={() => setShowConfirm(false)}
                      style={{ padding: '8px 18px', background: '#f4f4f5', color: '#6b7280', border: '1px solid #e5e7eb', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
                    >
                      Keep Order
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function MyAccountPage() {
  const [orders, setOrders]   = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');
  const { user, token, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!token) { router.push('/login'); return; }
    loadOrders();
  }, [token]);

  async function loadOrders() {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/orders', {
        headers: { 'Authorization': `Bearer ${token}` },
        cache: 'no-store',
      });
      const data = await res.json();
      if (data.success) {
        setOrders(data.orders ?? []);
      } else {
        setError(data.message || 'Failed to load orders.');
      }
    } catch {
      setError('Could not connect. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  if (!user) return null;

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb', paddingBottom: 60 }}>

      {/* Header */}
      <div style={{ background: '#fff', borderBottom: '1px solid #f0f0f0', padding: '0 20px' }}>
        <div style={{ maxWidth: 760, margin: '0 auto', padding: '20px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 900, color: '#111', letterSpacing: '-0.02em' }}>My Account</h1>
            <p style={{ fontSize: 13, color: '#6b7280', marginTop: 2 }}>
              Welcome, <strong style={{ color: '#0d9488' }}>{user.name}</strong> · {user.email}
            </p>
          </div>
          <button
            onClick={() => { logout(); router.push('/'); }}
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 16px', background: '#fee2e2', color: '#b91c1c', border: 'none', borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: 'pointer' }}
          >
            <LogOut size={14} /> Sign Out
          </button>
        </div>
      </div>

      <div style={{ maxWidth: 760, margin: '0 auto', padding: '28px 20px' }}>

        {/* Quick stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 28 }}>
          {[
            { label: 'Total Orders', value: orders.length, icon: ShoppingBag, color: '#0d9488' },
            { label: 'Completed', value: orders.filter(o => o.status === 'completed').length, icon: CheckCircle2, color: '#059669' },
            { label: 'Pending', value: orders.filter(o => ['pending','processing','on-hold'].includes(o.status)).length, icon: Clock, color: '#d97706' },
          ].map((stat, i) => (
            <div key={i} style={{ background: '#fff', border: '1px solid #f0f0f0', borderRadius: 14, padding: '16px 18px', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
              <stat.icon size={18} color={stat.color} style={{ marginBottom: 8 }} />
              <p style={{ fontSize: 24, fontWeight: 900, color: '#111', lineHeight: 1 }}>{stat.value}</p>
              <p style={{ fontSize: 11, color: '#9ca3af', fontWeight: 600, marginTop: 4 }}>{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Orders */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <h2 style={{ fontSize: 17, fontWeight: 800, color: '#111' }}>Your Orders</h2>
          <button onClick={loadOrders} style={{ fontSize: 12, fontWeight: 600, color: '#0d9488', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
            Refresh
          </button>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <div style={{ width: 40, height: 40, border: '3px solid #e5e7eb', borderTopColor: '#0d9488', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 14px' }} />
            <p style={{ fontSize: 13, color: '#9ca3af' }}>Loading your orders...</p>
          </div>
        ) : error ? (
          <div style={{ textAlign: 'center', padding: '40px 20px', background: '#fff', borderRadius: 16, border: '1px solid #f0f0f0' }}>
            <p style={{ fontSize: 14, color: '#b91c1c', marginBottom: 14 }}>{error}</p>
            <button onClick={loadOrders} style={{ background: '#0d9488', color: '#fff', border: 'none', borderRadius: 8, padding: '9px 20px', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
              Try Again
            </button>
          </div>
        ) : orders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', background: '#fff', borderRadius: 16, border: '1px solid #f0f0f0' }}>
            <div style={{ width: 64, height: 64, background: '#f0fdf9', borderRadius: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <Package size={28} color="#0d9488" />
            </div>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: '#111', marginBottom: 8 }}>No orders yet</h3>
            <p style={{ fontSize: 13, color: '#9ca3af', marginBottom: 20 }}>Your orders will appear here once you make a purchase.</p>
            <Link href="/shop" style={{ display: 'inline-block', background: '#0d9488', color: '#fff', borderRadius: 10, padding: '11px 24px', fontSize: 13, fontWeight: 700, textDecoration: 'none' }}>
              Start Shopping
            </Link>
          </div>
        ) : (
          orders.map(order => (
            <OrderCard key={order.id} order={order} token={token!} onCancelled={loadOrders} />
          ))
        )}

        {/* Help */}
        <div style={{ marginTop: 24, padding: '16px 20px', background: '#fff', border: '1px solid #f0f0f0', borderRadius: 14, display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
          <Truck size={20} color="#0d9488" />
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: '#111' }}>Need help with an order?</p>
            <p style={{ fontSize: 12, color: '#9ca3af' }}>Contact us on WhatsApp or email for quick support.</p>
          </div>
          <a href="https://wa.me/919818400981" target="_blank" rel="noreferrer"
            style={{ background: '#22c55e', color: '#fff', fontSize: 12, fontWeight: 700, padding: '8px 16px', borderRadius: 8, textDecoration: 'none' }}>
            WhatsApp
          </a>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 480px) {
          .stat-grid { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>
    </div>
  );
}
