import { useState } from 'react';
import './PaymentsPage.css';

const transactions = [
    { id: 'TXN-90284', name: 'Arthur Morgan', time: '12:45 PM', method: 'Visa ···· 4242', amount: '₹1,240.00', status: 'COMPLETED', statusClass: 'pay-completed', initials: 'AM', color: '#dbeafe' },
    { id: 'TXN-90285', name: 'Elena Lombardi', time: '12:38 PM', method: 'Bank Transfer', amount: '₹4,850.50', status: 'PROCESSING', statusClass: 'pay-processing', initials: 'EL', color: '#ede9fe' },
    { id: 'TXN-90286', name: 'John Wick', time: '11:55 AM', method: 'Mastercard ···· 8812', amount: '₹920.00', status: 'FAILED', statusClass: 'pay-failed', initials: 'JW', color: '#fee2e2' },
    { id: 'TXN-90287', name: 'Beth Smith', time: '10:22 AM', method: 'Cash', amount: '₹250.00', status: 'COMPLETED', statusClass: 'pay-completed', initials: 'BS', color: '#dcfce7' },
];

const invoices = [
    'INV-2024-001 - Modern Tech (Due: ₹1,240)',
    'INV-2024-002 - Apex Labs (Due: ₹3,400)',
    'INV-2024-003 - Elena Vance (Due: ₹580)',
];

export default function PaymentsPage() {
    const [payMethod, setPayMethod] = useState('CARD');
    const [selectedInv, setSelectedInv] = useState(invoices[0]);
    const [amount, setAmount] = useState('1,240.00');

    return (
        <div className="pay">
            {/* Top row */}
            <div className="pay-top">
                {/* Left: Receivables + Transactions */}
                <div className="pay-left">
                    <div className="card card-pad">
                        <div className="pay-recv-label">TOTAL RECEIVABLES</div>
                        <div className="pay-recv-amount">₹142,850.<span style={{ fontSize: '24px' }}>00</span></div>
                        <div className="pay-growth">
                            <span className="pay-growth-badge">↑ +12.5% vs last month</span>
                            <span className="txt-xs txt-light">Updated 2 minutes ago</span>
                        </div>
                        <div className="progress-bar" style={{ marginTop: 10, height: 6 }}>
                            <div className="progress-fill" style={{ width: '72%' }}></div>
                        </div>
                    </div>

                    <div className="card" style={{ marginTop: 16 }}>
                        <div className="pay-section-head">
                            <span className="fw-600" style={{ fontSize: '15px' }}>Recent Transactions</span>
                            <a href="#" className="txt-primary txt-sm fw-600">View All →</a>
                        </div>
                        <div className="table-wrap">
                            <table>
                                <thead>
                                    <tr>
                                        <th>CUSTOMER / ID</th>
                                        <th style={{ textAlign: 'right' }}>AMOUNT</th>
                                        <th>STATUS</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {transactions.map(t => (
                                        <tr key={t.id}>
                                            <td>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                                    <div className="avatar" style={{ background: t.color, fontSize: '11px', fontWeight: 700 }}>{t.initials}</div>
                                                    <div>
                                                        <div className="fw-600" style={{ fontSize: '13.5px' }}>{t.name}</div>
                                                        <div className="txt-xs txt-light">{t.id} • {t.time} · {t.method}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td style={{ textAlign: 'right', fontWeight: 600, color: t.status === 'FAILED' ? 'var(--danger)' : 'var(--text-dark)' }}>{t.amount}</td>
                                            <td>
                                                <span className={`pay-status ₹{t.statusClass}`}>
                                                    <span className={`dot ₹{t.status === 'COMPLETED' ? 'dot-green' : t.status === 'PROCESSING' ? 'dot-blue' : 'dot-red'}`}></span>
                                                    {t.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Auto Receipt */}
                    <div className="card pay-auto-receipt" style={{ marginTop: 16 }}>
                        <div className="pay-receipt-icon">✔</div>
                        <div className="pay-receipt-info">
                            <h3 className="fw-600" style={{ fontSize: '17px' }}>Auto-Receipt Generation</h3>
                            <p className="txt-sm txt-light" style={{ marginTop: 4, lineHeight: 1.6 }}>Enable automatic PDF generation for every successful transaction. Receipts are securely signed and archived in the Digital Ledger for audit compliance.</p>
                        </div>
                        <div className="pay-receipt-actions">
                            <button className="btn btn-outline btn-sm">Configure PDF</button>
                            <button className="btn btn-outline btn-sm">Send Sample</button>
                        </div>
                    </div>
                </div>

                {/* Right: Fast Checkout + Process Terminal */}
                <div className="pay-right">
                    <div className="pay-fast-checkout">
                        <div className="pay-fast-icon">⚡</div>
                        <h3>Fast Checkout</h3>
                        <p>Process a new payment directly to any open invoice in seconds.</p>
                        <button className="btn" style={{ background: '#fff', color: 'var(--primary)', fontWeight: 700, marginTop: 4 }}>Start Terminal</button>
                    </div>

                    <div className="card card-pad" style={{ marginTop: 16 }}>
                        <div className="fw-600" style={{ fontSize: '15px' }}>Process Terminal</div>
                        <div className="txt-xs txt-light" style={{ marginBottom: 16, marginTop: 2 }}>Handle one-off or invoice-linked payments.</div>

                        <div className="pay-field">
                            <label className="pay-field-label">SELECT ACTIVE INVOICE</label>
                            <select className="input" value={selectedInv} onChange={e => setSelectedInv(e.target.value)}>
                                {invoices.map(i => <option key={i}>{i}</option>)}
                            </select>
                        </div>

                        <div className="pay-field" style={{ marginTop: 14 }}>
                            <label className="pay-field-label">PAYMENT METHOD</label>
                            <div className="pay-methods">
                                {['CARD', 'CASH', 'BANK'].map(m => (
                                    <button key={m} className={`pay-method-btn ₹{payMethod === m ? 'pay-method-active' : ''}`} onClick={() => setPayMethod(m)}>
                                        <span>{m === 'CARD' ? '💳' : m === 'CASH' ? '💵' : '🏦'}</span>
                                        <span className="txt-xs fw-600">{m}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="pay-field" style={{ marginTop: 14 }}>
                            <label className="pay-field-label">AMOUNT TO PROCESS</label>
                            <div className="pay-amount-input">
                                <span className="pay-dollar">₹</span>
                                <input className="input" value={amount} onChange={e => setAmount(e.target.value)} style={{ paddingLeft: '26px', fontSize: '20px', fontWeight: '700' }} />
                            </div>
                        </div>

                        <button className="pay-auth-btn" style={{ marginTop: 18 }}>Authorize Transaction</button>
                        <button className="pay-draft-btn">🖨 Generate Draft Receipt</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
