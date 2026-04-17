import { useState } from 'react';
import './OrdersPage.css';

const initOrders = [
    { id: 'ORD-0041', customer: 'Marcus Thorne', date: '2024-06-12', items: 3, amount: 1250.00, payType: '💳 Card', status: 'Completed', payStatus: 'Paid' },
    { id: 'ORD-0040', customer: 'Apex Labs', date: '2024-06-11', items: 5, amount: 3400.00, payType: '🏦 Bank', status: 'Processing', payStatus: 'Pending' },
    { id: 'ORD-0039', customer: 'Elena Vance', date: '2024-06-11', items: 2, amount: 580.00, payType: '📱 UPI', status: 'Completed', payStatus: 'Paid' },
    { id: 'ORD-0038', customer: 'Quantum Logistics', date: '2024-06-10', items: 7, amount: 820.00, payType: '💳 Card', status: 'Failed', payStatus: 'Overdue' },
    { id: 'ORD-0037', customer: 'Beth Smith', date: '2024-06-10', items: 1, amount: 250.00, payType: '💵 Cash', status: 'Completed', payStatus: 'Paid' },
    { id: 'ORD-0036', customer: 'Marcus Thorne', date: '2024-06-09', items: 4, amount: 2100.00, payType: '💵 Cash', status: 'Pending', payStatus: 'Partial' },
    { id: 'ORD-0035', customer: 'Apex Labs', date: '2024-06-08', items: 2, amount: 660.00, payType: '📱 UPI', status: 'Completed', payStatus: 'Paid' },
];

const STATUS_CLASSES = {
    Completed: 'ord-s-completed',
    Processing: 'ord-s-processing',
    Pending: 'ord-s-pending',
    Failed: 'ord-s-failed',
    Cancelled: 'ord-s-cancelled',
};

const PAY_CLASSES = {
    Paid: 'ps-paid',
    Pending: 'ps-pending',
    Partial: 'ps-partial',
    Overdue: 'ps-overdue',
};

const STATS = [
    { label: 'TOTAL ORDERS', value: '1,247', icon: '📦', sub: '+14 today' },
    { label: 'COMPLETED', value: '1,089', icon: '✅', sub: '87.3%' },
    { label: 'PENDING', value: '142', icon: '⏳', sub: 'Awaiting action' },
    { label: 'FAILED', value: '16', icon: '❌', sub: 'Needs review' },
];

const initials = name => name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
const avatarColors = ['#dbeafe', '#ede9fe', '#dcfce7', '#fef9c3', '#fee2e2', '#e0f2fe'];
const avatarColor = name => avatarColors[name.charCodeAt(0) % avatarColors.length];

/* ── Order Detail Drawer ── */
function OrderDrawer({ order, onClose }) {
    if (!order) return null;
    return (
        <div className="ord-drawer-overlay" onClick={onClose}>
            <div className="ord-drawer" onClick={e => e.stopPropagation()}>
                <div className="ord-drawer-head">
                    <div>
                        <div className="fw-600" style={{ fontSize: 16 }}>{order.id}</div>
                        <div className="txt-xs txt-light">{order.customer} · {order.date}</div>
                    </div>
                    <button className="modal-close" onClick={onClose}>✕</button>
                </div>
                <div className="ord-drawer-body">
                    <div className="ord-detail-grid">
                        <div><div className="inv-label">STATUS</div><span className={`ord-status-badge ₹{STATUS_CLASSES[order.status]}`}>{order.status}</span></div>
                        <div><div className="inv-label">PAYMENT STATUS</div><span className={`inv-status-btn ₹{PAY_CLASSES[order.payStatus]} inv-status-active`} style={{ display: 'inline-block', marginTop: 4 }}>{order.payStatus}</span></div>
                        <div><div className="inv-label">PAYMENT TYPE</div><div className="fw-600" style={{ marginTop: 4 }}>{order.payType}</div></div>
                        <div><div className="inv-label">ITEMS</div><div className="fw-600" style={{ marginTop: 4 }}>{order.items} items</div></div>
                    </div>
                    <div className="ord-amount-card">
                        <div className="inv-label">ORDER TOTAL</div>
                        <div className="ord-drawer-amount">₹{order.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
                    </div>
                    <div className="ord-actions">
                        <button className="btn btn-outline" style={{ flex: 1 }}>🖨 Print Receipt</button>
                        <button className="btn btn-primary" style={{ flex: 1 }}>📄 View Invoice</button>
                    </div>
                    {order.payStatus !== 'Paid' && (
                        <button className="btn btn-primary" style={{ width: '100%', marginTop: 8 }}>⚡ Record Payment</button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function OrdersPage() {
    const [orders] = useState(initOrders);
    const [search, setSearch] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');
    const [selected, setSelected] = useState(null);

    const filtered = orders.filter(o => {
        const matchSearch = !search || o.customer.toLowerCase().includes(search.toLowerCase()) || o.id.toLowerCase().includes(search.toLowerCase());
        const matchStatus = filterStatus === 'All' || o.status === filterStatus;
        return matchSearch && matchStatus;
    });

    const totalRevenue = filtered.reduce((s, o) => s + (o.payStatus === 'Paid' ? o.amount : 0), 0);

    return (
        <div className="ord">
            {/* Header */}
            <div className="ord-header">
                <div>
                    <h1 className="section-title">Orders</h1>
                    <p className="section-subtitle">Track and manage all billing orders and transactions.</p>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                    <button className="btn btn-outline">↓ Export</button>
                    <button className="btn btn-primary">＋ New Order</button>
                </div>
            </div>

            {/* Stats */}
            <div className="ord-stats">
                {STATS.map(s => (
                    <div key={s.label} className="stat-card">
                        <div className="ord-stat-icon">{s.icon}</div>
                        <div className="stat-label">{s.label}</div>
                        <div className="stat-value">{s.value}</div>
                        <div className="stat-sub">{s.sub}</div>
                    </div>
                ))}
            </div>

            {/* Filters */}
            <div className="ord-filters">
                <div className="ord-search">
                    <span className="ord-search-icon">🔍</span>
                    <input
                        className="input"
                        placeholder="Search by customer or order ID..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        style={{ paddingLeft: 32 }}
                    />
                </div>
                <div className="ord-filter-tabs">
                    {['All', 'Completed', 'Pending', 'Processing', 'Failed'].map(s => (
                        <button
                            key={s}
                            className={`ord-filter-tab ₹{filterStatus === s ? 'ord-filter-active' : ''}`}
                            onClick={() => setFilterStatus(s)}
                        >{s}</button>
                    ))}
                </div>
                <div className="ord-revenue-pill">
                    💰 Collected: <b>₹{totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}</b>
                </div>
            </div>

            {/* Table */}
            <div className="card">
                <div className="table-wrap">
                    <table>
                        <thead>
                            <tr>
                                <th>ORDER ID</th>
                                <th>CUSTOMER</th>
                                <th>DATE</th>
                                <th>ITEMS</th>
                                <th>PAYMENT TYPE</th>
                                <th style={{ textAlign: 'right' }}>AMOUNT</th>
                                <th>ORDER STATUS</th>
                                <th>PAY STATUS</th>
                                <th>ACTIONS</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map(o => (
                                <tr key={o.id} className="ord-row" onClick={() => setSelected(o)}>
                                    <td><span className="ord-id">{o.id}</span></td>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                                            <div className="avatar" style={{ background: avatarColor(o.customer), fontSize: '11px', fontWeight: 700 }}>{initials(o.customer)}</div>
                                            <span className="fw-600" style={{ fontSize: '13.5px' }}>{o.customer}</span>
                                        </div>
                                    </td>
                                    <td className="txt-light" style={{ fontSize: 13 }}>{o.date}</td>
                                    <td className="fw-600">{o.items}</td>
                                    <td style={{ fontSize: 13 }}>{o.payType}</td>
                                    <td style={{ textAlign: 'right', fontWeight: 700, fontSize: 14 }}>₹{o.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                                    <td><span className={`ord-status-badge ₹{STATUS_CLASSES[o.status]}`}>{o.status}</span></td>
                                    <td><span className={`inv-status-btn ₹{PAY_CLASSES[o.payStatus]} inv-status-active`} style={{ display: 'inline-block' }}>{o.payStatus}</span></td>
                                    <td onClick={e => e.stopPropagation()}>
                                        <div style={{ display: 'flex', gap: 4 }}>
                                            <button className="btn btn-ghost btn-sm" title="Print">🖨</button>
                                            <button className="btn btn-ghost btn-sm" title="Invoice">📄</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filtered.length === 0 && (
                                <tr><td colSpan={9} style={{ textAlign: 'center', padding: '32px', color: 'var(--text-light)' }}>No orders found.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <div className="cat-pagination">
                    <span className="txt-xs txt-light">Showing {filtered.length} of {orders.length} orders</span>
                    <div className="cat-pages">
                        <button className="page-btn">‹</button>
                        <button className="page-btn page-btn-active">1</button>
                        <button className="page-btn">2</button>
                        <button className="page-btn">›</button>
                    </div>
                </div>
            </div>

            {/* Detail Drawer */}
            <OrderDrawer order={selected} onClose={() => setSelected(null)} />
        </div>
    );
}
