import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import './DashboardPage.css';

const revenueData = [
    { month: 'Jan', revenue: 78000, costs: 52000 },
    { month: 'Feb', revenue: 92000, costs: 61000 },
    { month: 'Mar', revenue: 67000, costs: 48000 },
    { month: 'Apr', revenue: 105000, costs: 72000 },
    { month: 'May', revenue: 118000, costs: 77000 },
    { month: 'Jun', revenue: 142000, costs: 95000 },
];

const activity = [
    { id: 1, type: 'payment', title: 'Payment Received from Marcus Thorne', sub: 'Invoice #INV-9201 • 2 hours ago', amount: '+₹1,250.00', status: 'COMPLETED', statusClass: 'act-completed', icon: '👤' },
    { id: 2, type: 'invoice', title: 'New Invoice Created for Apex Labs', sub: 'Invoice #INV-9204 • 4 hours ago', amount: '₹3,400.00', status: 'AWAITING PAYMENT', statusClass: 'act-awaiting', icon: '📄' },
    { id: 3, type: 'profile', title: 'Customer Profile Updated: Elena Vance', sub: 'Contact details updated • 5 hours ago', amount: 'ID: CUST-882', status: '', statusClass: '', icon: '👤' },
    { id: 4, type: 'failed', title: 'Payment Failed: Quantum Logistics', sub: 'Card Declined • 8 hours ago', amount: '₹820.00', status: 'ACTION REQUIRED', statusClass: 'act-failed', icon: '⚠️' },
];

const quickActions = [
    { icon: '📄', label: 'New Bill' },
    { icon: '🔍', label: 'Search Customer' },
    { icon: '📊', label: 'Reports' },
    { icon: '🎧', label: 'Concierge' },
];

export default function DashboardPage() {
    return (
        <div className="dash">
            {/* Header */}
            <div className="dash-header">
                <div>
                    <h1 className="section-title">Overview Dashboard</h1>
                    <p className="section-subtitle">Monitoring activity for June 12, 2024</p>
                </div>
                <div className="dash-header-actions">
                    <button className="btn btn-outline btn-sm">📅 Last 7 Days</button>
                    <button className="btn btn-outline btn-sm">↓ Export</button>
                </div>
            </div>

            {/* Stat Cards */}
            <div className="dash-stats">
                <div className="stat-card">
                    <div className="stat-chip stat-chip-blue">🖥 <span className="chip-up">↑ 12%</span></div>
                    <div className="stat-label">TODAY'S REVENUE</div>
                    <div className="stat-value">₹14,285.40</div>
                </div>
                <div className="stat-card">
                    <div className="stat-chip stat-chip-red">📋 <span className="chip-warn">! Critical</span></div>
                    <div className="stat-label">PENDING INVOICES</div>
                    <div className="stat-value">42</div>
                </div>
                <div className="stat-card">
                    <div className="stat-chip stat-chip-green">👤 <span className="chip-up">+8 this week</span></div>
                    <div className="stat-label">TOTAL CUSTOMERS</div>
                    <div className="stat-value">1,892</div>
                </div>
                <div className="stat-card">
                    <div className="stat-chip stat-chip-gray">📊</div>
                    <div className="stat-label">AVG. INVOICE VALUE</div>
                    <div className="stat-value">₹340.22</div>
                </div>
            </div>

            {/* Main content grid */}
            <div className="dash-main">
                {/* Left: Activity + Financial Chart */}
                <div className="dash-left">
                    {/* Recent Activity */}
                    <div className="card">
                        <div className="dash-section-head">
                            <span className="fw-600" style={{ fontSize: '15px' }}>Recent Activity</span>
                            <a href="#" className="txt-primary txt-sm fw-600">View all transactions</a>
                        </div>
                        <div className="activity-list">
                            {activity.map(a => (
                                <div className="activity-item" key={a.id}>
                                    <div className="avatar" style={{ fontSize: '16px', background: '#f3f4f6' }}>{a.icon}</div>
                                    <div className="activity-info">
                                        <div className="activity-title">{a.title}</div>
                                        <div className="activity-sub txt-xs txt-light">{a.sub}</div>
                                    </div>
                                    <div className="activity-right">
                                        <div className={`activity-amount fw-600 ₹{a.type === 'failed' ? 'txt-danger' : a.type === 'payment' ? 'txt-success' : ''}`}>{a.amount}</div>
                                        {a.status && <div className={`activity-status ₹{a.statusClass}`}>{a.status}</div>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Financial Health Chart */}
                    <div className="card card-pad-lg" style={{ marginTop: '20px' }}>
                        <div className="dash-section-head">
                            <div>
                                <div className="fw-600" style={{ fontSize: '15px' }}>Financial Health</div>
                                <div className="txt-xs txt-light">Revenue vs Operating Costs (Monthly)</div>
                            </div>
                            <div className="chart-legend">
                                <span><span className="dot dot-blue" style={{ background: '#93c5fd' }}></span> Revenue</span>
                                <span><span className="dot dot-blue" style={{ background: '#c7d2fe' }}></span> Costs</span>
                            </div>
                        </div>
                        <div style={{ height: 200, marginTop: 16 }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={revenueData} barGap={4} barCategoryGap="30%">
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                                    <YAxis hide />
                                    <Tooltip formatter={(v) => `₹${v.toLocaleString()}`} contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e5e7eb' }} />
                                    <Bar dataKey="revenue" fill="#93c5fd" radius={[4, 4, 0, 0]} />
                                    <Bar dataKey="costs" fill="#c7d2fe" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="chart-summary">
                            <div><div className="chart-sum-label">GROSS PROFIT</div><div className="chart-sum-val">₹122,042.00</div></div>
                            <div><div className="chart-sum-label">TAX LIABILITY</div><div className="chart-sum-val">₹18,402.00</div></div>
                            <div><div className="chart-sum-label">NET MARGIN</div><div className="chart-sum-val txt-success">32.4%</div></div>
                        </div>
                    </div>
                </div>

                {/* Right: Quick Actions + Receivables */}
                <div className="dash-right">
                    {/* Quick Actions */}
                    <div className="card card-pad">
                        <div className="fw-600 mb-10" style={{ fontSize: '15px', marginBottom: '14px' }}>Quick Actions</div>
                        <div className="qa-grid">
                            {quickActions.map(q => (
                                <button key={q.label} className="qa-btn">
                                    <span className="qa-icon">{q.icon}</span>
                                    <span className="txt-xs fw-600 txt-light">{q.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Total Receivables */}
                    <div className="recv-card" style={{ marginTop: '16px' }}>
                        <div className="recv-label">TOTAL RECEIVABLES</div>
                        <div className="recv-logo">
                            <svg width="18" height="18" viewBox="0 0 24 24"><rect x="2" y="5" width="20" height="14" rx="3" stroke="#93c5fd" strokeWidth="2" /><rect x="6" y="9" width="8" height="2" rx="1" fill="#93c5fd" /></svg>
                        </div>
                        <div className="recv-amount">₹245,092.00</div>
                        <hr style={{ borderColor: 'rgba(255,255,255,0.15)', margin: '12px 0' }} />
                        <div className="recv-row">
                            <span>Settled this month</span>
                            <span className="fw-600">₹182,400</span>
                        </div>
                        <div className="progress-bar" style={{ margin: '8px 0', background: 'rgba(255,255,255,0.2)' }}>
                            <div className="progress-fill" style={{ width: '74%', background: '#60a5fa' }}></div>
                        </div>
                        <div className="recv-row txt-xs" style={{ opacity: 0.75 }}>
                            <span>74% of target reached</span>
                            <span>Goal: ₹250k</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
