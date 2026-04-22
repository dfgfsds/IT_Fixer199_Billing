// import { useEffect, useState } from 'react';
// import './OrdersPage.css';
// import Api from "../api-endpoints/ApiUrls";
// import axiosInstance from '../configs/axios-middleware';

// const initOrders = [
//     { id: 'ORD-0041', customer: 'Marcus Thorne', date: '2024-06-12', items: 3, amount: 1250.00, payType: '💳 Card', status: 'Completed', payStatus: 'Paid' },
//     { id: 'ORD-0040', customer: 'Apex Labs', date: '2024-06-11', items: 5, amount: 3400.00, payType: '🏦 Bank', status: 'Processing', payStatus: 'Pending' },
//     { id: 'ORD-0039', customer: 'Elena Vance', date: '2024-06-11', items: 2, amount: 580.00, payType: '📱 UPI', status: 'Completed', payStatus: 'Paid' },
//     { id: 'ORD-0038', customer: 'Quantum Logistics', date: '2024-06-10', items: 7, amount: 820.00, payType: '💳 Card', status: 'Failed', payStatus: 'Overdue' },
//     { id: 'ORD-0037', customer: 'Beth Smith', date: '2024-06-10', items: 1, amount: 250.00, payType: '💵 Cash', status: 'Completed', payStatus: 'Paid' },
//     { id: 'ORD-0036', customer: 'Marcus Thorne', date: '2024-06-09', items: 4, amount: 2100.00, payType: '💵 Cash', status: 'Pending', payStatus: 'Partial' },
//     { id: 'ORD-0035', customer: 'Apex Labs', date: '2024-06-08', items: 2, amount: 660.00, payType: '📱 UPI', status: 'Completed', payStatus: 'Paid' },
// ];

// const STATUS_CLASSES = {
//     Completed: 'ord-s-completed',
//     Processing: 'ord-s-processing',
//     Pending: 'ord-s-pending',
//     Failed: 'ord-s-failed',
//     Cancelled: 'ord-s-cancelled',
// };

// const PAY_CLASSES = {
//     Paid: 'ps-paid',
//     Pending: 'ps-pending',
//     Partial: 'ps-partial',
//     Overdue: 'ps-overdue',
// };

// const STATS = [
//     { label: 'TOTAL ORDERS', value: '1,247', icon: '📦', sub: '+14 today' },
//     { label: 'COMPLETED', value: '1,089', icon: '✅', sub: '87.3%' },
//     { label: 'PENDING', value: '142', icon: '⏳', sub: 'Awaiting action' },
//     { label: 'FAILED', value: '16', icon: '❌', sub: 'Needs review' },
// ];

// const initials = name => name?.split(' ').map(w => w[0])?.join('')?.slice(0, 2)?.toUpperCase();
// const avatarColors = ['#dbeafe', '#ede9fe', '#dcfce7', '#fef9c3', '#fee2e2', '#e0f2fe'];
// const avatarColor = name => avatarColors[name?.charCodeAt(0) % avatarColors?.length];

// /* ── Order Detail Drawer ── */
// function OrderDrawer({ order, onClose }) {
//     if (!order) return null;
//     return (
//         <div className="ord-drawer-overlay" onClick={onClose}>
//             <div className="ord-drawer" onClick={e => e.stopPropagation()}>
//                 <div className="ord-drawer-head">
//                     <div>
//                         <div className="fw-600" style={{ fontSize: 16 }}>{order.id}</div>
//                         <div className="txt-xs txt-light">{order.customer} · {order.date}</div>
//                     </div>
//                     <button className="modal-close" onClick={onClose}>✕</button>
//                 </div>
//                 <div className="ord-drawer-body">
//                     <div className="ord-detail-grid">
//                         <div><div className="inv-label">STATUS</div><span className={`ord-status-badge ₹{STATUS_CLASSES[order.status]}`}>{order.status}</span></div>
//                         <div><div className="inv-label">PAYMENT STATUS</div><span className={`inv-status-btn ₹{PAY_CLASSES[order.payStatus]} inv-status-active`} style={{ display: 'inline-block', marginTop: 4 }}>{order.payStatus}</span></div>
//                         <div><div className="inv-label">PAYMENT TYPE</div><div className="fw-600" style={{ marginTop: 4 }}>{order.payType}</div></div>
//                         <div><div className="inv-label">ITEMS</div><div className="fw-600" style={{ marginTop: 4 }}>{order.items} items</div></div>
//                     </div>
//                     <div className="ord-amount-card">
//                         <div className="inv-label">ORDER TOTAL</div>
//                         <div className="ord-drawer-amount">₹{order.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
//                     </div>
//                     <div className="ord-actions">
//                         <button className="btn btn-outline" style={{ flex: 1 }}>🖨 Print Receipt</button>
//                         <button className="btn btn-primary" style={{ flex: 1 }}>📄 View Invoice</button>
//                     </div>
//                     {order.payStatus !== 'Paid' && (
//                         <button className="btn btn-primary" style={{ width: '100%', marginTop: 8 }}>⚡ Record Payment</button>
//                     )}
//                 </div>
//             </div>
//         </div>
//     );
// }

// export default function OrdersPage() {
//     // const [orders] = useState(initOrders);
//     const [search, setSearch] = useState('');
//     const [filterStatus, setFilterStatus] = useState('All');
//     const [selected, setSelected] = useState(null);
//     const [orders, setOrders] = useState([]);
// console.log(orders)
//     // ✅ TRIGGER API
//     useEffect(() => {
//         fetchOrders();
//     }, []);

//     // ✅ FETCH ORDERS (API FILTER)
//     const fetchOrders = async () => {
//         try {
//             // setLoading(true);

//             const params = new URLSearchParams();

//             // params.append("page", String(filters.page));
//             params.append("limit", "20");
//             params.append("is_active", "true");

//             // if (filters.search) params.append("search", filters.search);
//             // if (filters.startDate) params.append("start_date", filters.startDate);
//             // if (filters.endDate) params.append("end_date", filters.endDate);

//             const response = await axiosInstance.get(
//                 `${Api?.orders}?${params.toString()}`
//             );

//             setOrders(response?.data?.orders || []);

//         } catch (error) {
//             console.error("Failed to fetch orders:", error);
//         } finally {
//             // setLoading(false);
//         }
//     };

//     const filtered = orders.filter(o => {
//         const matchSearch = !search || o?.customer_name?.toLowerCase()?.includes(search?.toLowerCase()) || o?.id?.toLowerCase()?.includes(search?.toLowerCase());
//         const matchStatus = filterStatus === 'All' || o?.order_status === filterStatus;
//         return matchSearch && matchStatus;
//     });
// console.log(filtered)
//     const totalRevenue = filtered?.reduce((s, o) => s + (o?.payment_status === 'Paid' ? o?.amount : 0), 0);

//     return (
//         <div className="ord">
//             {/* Header */}
//             <div className="ord-header">
//                 <div>
//                     <h1 className="section-title">Orders</h1>
//                     <p className="section-subtitle">Track and manage all billing orders and transactions.</p>
//                 </div>
//                 <div style={{ display: 'flex', gap: 8 }}>
//                     <button className="btn btn-outline">↓ Export</button>
//                     <button className="btn btn-primary">＋ New Order</button>
//                 </div>
//             </div>

//             {/* Stats */}
//             <div className="ord-stats">
//                 {STATS.map(s => (
//                     <div key={s.label} className="stat-card">
//                         <div className="ord-stat-icon">{s.icon}</div>
//                         <div className="stat-label">{s.label}</div>
//                         <div className="stat-value">{s.value}</div>
//                         <div className="stat-sub">{s.sub}</div>
//                     </div>
//                 ))}
//             </div>

//             {/* Filters */}
//             <div className="ord-filters">
//                 <div className="ord-search">
//                     <span className="ord-search-icon">🔍</span>
//                     <input
//                         className="input"
//                         placeholder="Search by customer or order ID..."
//                         value={search}
//                         onChange={e => setSearch(e.target.value)}
//                         style={{ paddingLeft: 32 }}
//                     />
//                 </div>
//                 <div className="ord-filter-tabs">
//                     {['All', 'Completed', 'Pending', 'Processing', 'Failed'].map(s => (
//                         <button
//                             key={s}
//                             className={`ord-filter-tab ₹{filterStatus === s ? 'ord-filter-active' : ''}`}
//                             onClick={() => setFilterStatus(s)}
//                         >{s}</button>
//                     ))}
//                 </div>
//                 <div className="ord-revenue-pill">
//                     💰 Collected: <b>₹{totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}</b>
//                 </div>
//             </div>

//             {/* Table */}
//             <div className="card">
//                 <div className="table-wrap">
//                     <table>
//                         <thead>
//                             <tr>
//                                 <th>ORDER ID</th>
//                                 <th>CUSTOMER</th>
//                                 <th>DATE</th>
//                                 <th>ITEMS</th>
//                                 <th>PAYMENT TYPE</th>
//                                 <th style={{ textAlign: 'right' }}>AMOUNT</th>
//                                 <th>ORDER STATUS</th>
//                                 <th>PAY STATUS</th>
//                                 <th>ACTIONS</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {filtered.map(o => (
//                                 <tr key={o?.id} className="ord-row" onClick={() => setSelected(o)}>
//                                     <td><span className="ord-id">{o?.id}</span></td>
//                                     <td>
//                                         <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
//                                             <div className="avatar" style={{ background: avatarColor(o?.customer_name), fontSize: '11px', fontWeight: 700 }}>{initials(o?.customer_name)}</div>
//                                             <span className="fw-600" style={{ fontSize: '13.5px' }}>{o?.customer_name}</span>
//                                         </div>
//                                     </td>
//                                     <td className="txt-light" style={{ fontSize: 13 }}>{o.date}</td>
//                                     <td className="fw-600">{o.items}</td>
//                                     <td style={{ fontSize: 13 }}>{o.payType}</td>
//                                     <td style={{ textAlign: 'right', fontWeight: 700, fontSize: 14 }}>₹{o?.total_price.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
//                                     <td><span className={`ord-status-badge ₹{STATUS_CLASSES[o?.order_status]}`}>{o?.order_status}</span></td>
//                                     <td><span className={`inv-status-btn ₹{PAY_CLASSES[o?.payment_status]} inv-status-active`} style={{ display: 'inline-block' }}>{o?.payment_status}</span></td>
//                                     <td onClick={e => e.stopPropagation()}>
//                                         <div style={{ display: 'flex', gap: 4 }}>
//                                             <button className="btn btn-ghost btn-sm" title="Print">🖨</button>
//                                             <button className="btn btn-ghost btn-sm" title="Invoice">📄</button>
//                                         </div>
//                                     </td>
//                                 </tr>
//                             ))}
//                             {filtered.length === 0 && (
//                                 <tr><td colSpan={9} style={{ textAlign: 'center', padding: '32px', color: 'var(--text-light)' }}>No orders found.</td></tr>
//                             )}
//                         </tbody>
//                     </table>
//                 </div>
//                 <div className="cat-pagination">
//                     <span className="txt-xs txt-light">Showing {filtered.length} of {orders.length} orders</span>
//                     <div className="cat-pages">
//                         <button className="page-btn">‹</button>
//                         <button className="page-btn page-btn-active">1</button>
//                         <button className="page-btn">2</button>
//                         <button className="page-btn">›</button>
//                     </div>
//                 </div>
//             </div>

//             {/* Detail Drawer */}
//             <OrderDrawer order={selected} onClose={() => setSelected(null)} />
//         </div>
//     );
// }
import { useEffect, useState, useMemo } from 'react';
import './OrdersPage.css';
import Api from "../api-endpoints/ApiUrls";
import axiosInstance from '../configs/axios-middleware';
import toast from 'react-hot-toast';
import AddPaymentModal from '../components/AddPaymentModal';
import OrderPreviewModal from '../components/OrderPreviewModal';

/* ---------------- CONSTANTS & HELPERS ---------------- */
const mapPaymentStatus = (status) => {
    const mapping = {
        "SUCCESS": "Paid",
        "PENDING": "Pending",
        "PROCESSING": "Pending",
        "PARTIALLY_REFUNDED": "Partial",
        "FAILED": "Failed",
        "CANCELLED": "Failed",
        "REFUNDED": "Refunded",
        "CREDIT": "Credit"
    };
    return mapping[status] || status;
};

const PAY_CLASSES = {
    Paid: 'ps-paid',
    Pending: 'ps-pending',
    Partial: 'ps-partial',
    Failed: 'ps-failed',
    Refunded: 'ps-refunded',
    Credit: 'ps-credit'
};

const STATUS_CLASSES = {
    PENDING: 'ord-s-pending',
    CONFIRMED: 'ord-s-processing',
    ASSIGNED: 'ord-s-processing',
    IN_PROGRESS: 'ord-s-processing',
    IN_TRANSIT: 'ord-s-transit',
    SERVICE_IN_PROGRESS: 'ord-s-service',
    COMPLETED: 'ord-s-completed',
    CANCELLED: 'ord-s-cancelled',
    REFUNDED: 'ord-s-refunded',
};

export default function OrdersPage() {
    const [orders, setOrders] = useState([]);
    const [search, setSearch] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');

    // Modal state
    const [selectedOrderForPayment, setSelectedOrderForPayment] = useState(null);
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [viewOrderId, setViewOrderId] = useState(null);

    // ✅ DATE FILTERS
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    // ✅ PAGINATION
    const [page, setPage] = useState(1);
    const [limit] = useState(20);
    const [totalPages, setTotalPages] = useState(1);
    const [isLoading, setIsLoading] = useState(false);

    /* ---------------- INITIALIZE DATES ---------------- */
    useEffect(() => {
        const today = new Date().toISOString().split('T')[0];
        setStartDate(today);
        setEndDate(today);
    }, []);

    /* ---------------- API FETCH ---------------- */
    const fetchOrders = async () => {
        setIsLoading(true);
        try {
            const params = new URLSearchParams({
                page: page,
                limit: limit,
                is_active: "true",
                order_platform: "SHOP"
            });

            if (startDate) params.append("start_date", startDate);
            if (endDate) params.append("end_date", endDate);

            const res = await axiosInstance.get(`${Api.orders}?${params.toString()}`);

            // Handle both Array or Object response structure
            const data = Array.isArray(res?.data) ? res.data : (res?.data?.orders || []);
            setOrders(data);
            setTotalPages(res?.data?.pagination?.totalPages || 1);
        } catch (err) {
            console.error("Fetch orders error", err);
        } finally {
            setIsLoading(false);
        }
    };

    // Refetch when dates or page change
    useEffect(() => {
        if (startDate && endDate) {
            fetchOrders();
        }
    }, [page, startDate, endDate]);

    /* ---------------- HANDLERS ---------------- */
    const handleSearchChange = (e) => {
        setSearch(e.target.value);
    };

    const handleFilterChange = (status) => {
        setFilterStatus(status);
    };

    /* ---------------- CALCULATIONS (Professional Instant Search) ---------------- */
    const { filteredOrders, revenue } = useMemo(() => {
        const query = search.toLowerCase().trim();

        const filtered = orders.filter(o => {
            // 1. Payment Status Filter
            const matchStatus = filterStatus === 'All' || o?.payment_status === filterStatus;

            // 2. Instant Search Filter (ID, Name, or Phone)
            const matchSearch = !query ||
                o?.id?.toLowerCase().includes(query) ||
                o?.customer_name?.toLowerCase().includes(query) ||
                o?.customer_number?.includes(query);

            return matchStatus && matchSearch;
        });

        // Revenue should only count Paid (SUCCESS) orders
        const total = filtered.reduce((acc, o) =>
            acc + (o?.payment_status === 'SUCCESS' ? Number(o?.total_price || 0) : 0), 0
        );

        return { filteredOrders: filtered, revenue: total };
    }, [orders, filterStatus, search]);

    /* ---------------- UI ---------------- */
    return (
        <div className="ord-container">
            {/* HEADER & DATE PICKERS */}
            <div className="ord-header-section">
                <div>
                    <h1 className="section-title">Order Management</h1>
                    <p className="section-subtitle">Manage transactions and order fulfillment states.</p>
                </div>

                <div className="date-filter-group">
                    <div className="input-field">
                        <label>From</label>
                        <input type="date" className="input" value={startDate} onChange={e => { setStartDate(e.target.value); setPage(1); }} />
                    </div>
                    <div className="input-field">
                        <label>To</label>
                        <input type="date" className="input" value={endDate} onChange={e => { setEndDate(e.target.value); setPage(1); }} />
                    </div>
                </div>
            </div>

            {/* QUICK STATS & SEARCH */}
            <div className="ord-controls-row">
                <div className="ord-search-wrapper">
                    <input
                        className="input search-input"
                        placeholder="Search"
                        value={search}
                        onChange={handleSearchChange}
                    />
                </div>

                <div className="ord-stats-cards">
                    <div className="stat-pill">
                        <span className="stat-label">Total Revenue</span>
                        <span className="stat-value">₹{revenue.toLocaleString('en-IN')}</span>
                    </div>
                </div>
            </div>

            {/* STATUS TABS */}
            <div className="ord-tab-container">
                {[
                    { id: 'All', label: 'All' },
                    { id: 'SUCCESS', label: 'Paid' },
                    { id: 'PENDING', label: 'Pending' },
                    { id: 'CREDIT', label: 'Credit' }
                ].map(s => (
                    <button
                        key={s.id}
                        className={`tab-btn ${filterStatus === s.id ? 'tab-active' : ''}`}
                        onClick={() => handleFilterChange(s.id)}
                    >
                        {s.label}
                    </button>
                ))}
            </div>

            {/* DATA TABLE */}
            <div className="card table-card">
                <div className="table-wrap">
                    <table className={isLoading ? "table-loading" : ""}>
                        <thead>
                            <tr>
                                <th style={{ width: '60px' }}>S.No.</th>
                                <th>Order Details</th>
                                <th>Customer</th>
                                <th>Amount</th>
                                <th>Balance</th>
                                <th>Order Status</th>
                                <th>Payment</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredOrders.map((o, idx) => (
                                <tr key={o?.id}>
                                    <td style={{ color: '#64748b', fontWeight: '600' }}>
                                        {(page - 1) * limit + idx + 1}
                                    </td>
                                    <td>
                                        <div className="order-id-cell">
                                            <span className="id-text">#{o?.id?.slice(0, 8)}</span>
                                            <span className="date-text">{new Date(o.created_at).toLocaleDateString()}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="cust-cell">
                                            <p className="cust-name">{o?.customer_name}</p>
                                            <p className="cust-phone">{o?.customer_number}</p>
                                        </div>
                                    </td>
                                    <td className="amount-cell">₹{Number(o?.total_price).toFixed(2)}</td>
                                    <td className="amount-cell" style={{ fontWeight: '600', color: Number(o?.amount_to_be_paid) > 0 ? '#dc2626' : '#059669' }}>
                                        ₹{Number(o?.amount_to_be_paid || 0).toFixed(2)}
                                    </td>
                                    <td>
                                        <span className={`badge ${STATUS_CLASSES[o?.order_status]}`}>
                                            {o?.order_status}
                                        </span>
                                    </td>
                                    <td>
                                        <span className={`badge-pill ${PAY_CLASSES[mapPaymentStatus(o?.payment_status)]}`}>
                                            {mapPaymentStatus(o?.payment_status)}
                                        </span>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                            <button
                                                className="btn btn-outline btn-sm"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setViewOrderId(o.id);
                                                }}
                                                title="View Details"
                                                style={{ padding: '4px 8px' }}
                                            >
                                                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" color="#4b5563">
                                                    <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
                                                    <path fillRule="evenodd" d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 010-1.113zM17.25 12a5.25 5.25 0 11-10.5 0 5.25 5.25 0 0110.5 0z" clipRule="evenodd" />
                                                </svg>
                                            </button>
                                            <button
                                                className={`btn btn-sm ${Number(o?.amount_to_be_paid) > 0 ? 'btn-primary' : 'btn-disabled'}`}
                                                disabled={Number(o?.amount_to_be_paid) <= 0}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setSelectedOrderForPayment(o);
                                                    setIsPaymentModalOpen(true);
                                                }}
                                                style={{ padding: '4px 12px', fontSize: '12px', cursor: Number(o?.amount_to_be_paid) <= 0 ? 'not-allowed' : 'pointer' }}
                                            >
                                                Pay
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredOrders.length === 0 && !isLoading && (
                                <tr>
                                    <td colSpan={7}>
                                        <div className="ord-empty-state">
                                            <h3>No orders found</h3>
                                            <p>There are no transactions matching your current filters or date range.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                </div>

                {/* IMPROVED PAGINATION */}
                <div className="pagination-footer">
                    <p className="page-info">Showing Page <b>{page}</b> of {totalPages}</p>
                    <div className="pagination-controls">
                        <button
                            className="p-btn"
                            disabled={page === 1}
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                        >
                            Previous
                        </button>

                        <div className="p-numbers">
                            {/* Logic to show limited page numbers if totalPages is high */}
                            {[...Array(totalPages)].map((_, i) => (
                                (i + 1 === 1 || i + 1 === totalPages || Math.abs(page - (i + 1)) <= 1) && (
                                    <button
                                        key={i}
                                        className={`p-num ${page === i + 1 ? "active" : ""}`}
                                        onClick={() => setPage(i + 1)}
                                    >
                                        {i + 1}
                                    </button>
                                )
                            ))}
                        </div>

                        <button
                            className="p-btn"
                            disabled={page === totalPages}
                            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>

            {/* PREVIEW MODAL */}
            <OrderPreviewModal
                open={!!viewOrderId}
                orderId={viewOrderId}
                onClose={() => setViewOrderId(null)}
            />

            {/* PAYMENT MODAL */}
            {isPaymentModalOpen && (
                <AddPaymentModal
                    order={selectedOrderForPayment}
                    onClose={() => {
                        setIsPaymentModalOpen(false);
                        setSelectedOrderForPayment(null);
                    }}
                    onSuccess={() => {
                        setIsPaymentModalOpen(false);
                        setSelectedOrderForPayment(null);
                        fetchOrders(); // Refresh table
                    }}
                />
            )}
        </div>
    );
}