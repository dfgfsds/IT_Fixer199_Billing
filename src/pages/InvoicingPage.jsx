import { useState, useRef, useEffect } from 'react';
import './InvoicingPage.css';
import axiosInstance from '../configs/axios-middleware';
import Api from "../api-endpoints/ApiUrls"
import { useAuth } from '../contexts/AuthContext';
import toast, { Toaster } from 'react-hot-toast';

const Plus = ({ size = 24 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="5" x2="12" y2="19"></line>
        <line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>
);
const X = ({ size = 24 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
);

/* ─── Product Catalog ─── */
const PRODUCT_CATALOG = [
    { name: 'Initial Consultation (Premium)', hsn: '998311', price: 245.00, tax: 18, category: 'Consultation', icon: '🩺' },
    { name: 'Standard Echo Scan', hsn: '998312', price: 1120.00, tax: 12, category: 'Procedure', icon: '🔊' },
    { name: 'Sterile Gauze Pack (50pk)', hsn: '300610', price: 18.50, tax: 5, category: 'Retail', icon: '🩹' },
    { name: 'Advanced Prenatal Vitamins', hsn: '210690', price: 45.99, tax: 5, category: 'Retail', icon: '💊' },
    { name: 'Premium Subscription', hsn: '997331', price: 1250.00, tax: 18, category: 'Service', icon: '⭐' },
    { name: 'System Maintenance', hsn: '997332', price: 150.00, tax: 18, category: 'Service', icon: '⚙️' },
    { name: 'Blood Test - Full Panel', hsn: '998313', price: 85.00, tax: 5, category: 'Lab', icon: '🩸' },
    { name: 'Physiotherapy Session', hsn: '998315', price: 60.00, tax: 12, category: 'Procedure', icon: '🏋️' },
    { name: 'Dental Checkup', hsn: '998316', price: 120.00, tax: 12, category: 'Consultation', icon: '🦷' },
    { name: 'X-Ray Imaging', hsn: '998317', price: 200.00, tax: 12, category: 'Procedure', icon: '🔬' },
    { name: 'Annual Health Package', hsn: '998318', price: 999.00, tax: 18, category: 'Package', icon: '📋' },
    { name: 'Paracetamol 500mg (10 strips)', hsn: '300490', price: 12.50, tax: 5, category: 'Pharmacy', icon: '💊' },
];

// const defaultItems = [
//     { id: 1, name: 'Premium Subscription', hsn: '997331', qty: 1, price: 1250.00, tax: 8.5 },
//     { id: 2, name: 'System Maintenance', hsn: '997332', qty: 5, price: 150.00, tax: 8.5 },
// ];
let nextId = 2;

/* ─── Product Search Autocomplete ─── */
// function ProductSearch({ value, onChange, onSelect }) {
//     const [open, setOpen] = useState(false);
//     const [query, setQuery] = useState(value);
//     const wrapRef = useRef(null);

//     // Sync if parent resets
//     useEffect(() => { setQuery(value); }, [value]);

//     // Close on outside click
//     useEffect(() => {
//         const handler = (e) => { if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false); };
//         document.addEventListener('mousedown', handler);
//         return () => document.removeEventListener('mousedown', handler);
//     }, []);

//     const suggestions = query.trim().length > 0
//         ? PRODUCT_CATALOG.filter(p => p.name.toLowerCase().includes(query.toLowerCase()) || p.hsn.includes(query) || p.category.toLowerCase().includes(query.toLowerCase()))
//         : PRODUCT_CATALOG;

//     const handleInput = (e) => {
//         setQuery(e.target.value);
//         onChange(e.target.value);
//         setOpen(true);
//     };

//     const handleSelect = (product) => {
//         setQuery(product.name);
//         onSelect(product);
//         setOpen(false);
//     };

//     return (
//         <div className="prod-search-wrap" ref={wrapRef}>
//             <input
//                 className="input"
//                 value={query}
//                 onChange={handleInput}
//                 onFocus={() => setOpen(true)}
//                 placeholder="Type to search products…"
//                 style={{ minWidth: 200 }}
//             />
//             {open && suggestions.length > 0 && (
//                 <div className="prod-suggestions">
//                     {suggestions.slice(0, 8).map(p => (
//                         <div key={p.name} className="prod-suggestion-item" onMouseDown={() => handleSelect(p)}>
//                             <span className="prod-sugg-icon">{p.icon}</span>
//                             <div className="prod-sugg-info">
//                                 <div className="prod-sugg-name">{p.name}</div>
//                                 <div className="prod-sugg-meta">
//                                     <span className="prod-sugg-cat">{p.category}</span>
//                                     <span className="prod-sugg-hsn">HSN: {p.hsn}</span>
//                                     <span className="prod-sugg-price">₹{p.price.toFixed(2)}</span>
//                                 </div>
//                             </div>
//                         </div>
//                     ))}
//                 </div>
//             )}
//         </div>
//     );
// }

function ProductSearch({ value, onChange, onSelect }) {
    const [list, setList] = useState([]);
    const [show, setShow] = useState(false);

    const handleSearch = async (val) => {
        onChange(val);

        if (!val) {
            setList([]);
            return;
        }

        const data = await fetchProducts(val);
        setList(data);
        setShow(true);
    };

    const fetchProducts = async (search) => {
        try {
            const params = new URLSearchParams();

            if (search) params.append("barcode", search); // barcode search

            const res = await axiosInstance.get(
                `${Api.products}?${params.toString()}`
            );

            return res?.data?.products || [];
        } catch (err) {
            console.error("Product fetch error", err);
            return [];
        }

    };

    return (
        <div style={{ position: "relative" }}>
            <input
                className="input"
                value={value}
                placeholder="Scan / Enter product"
                onChange={(e) => handleSearch(e.target.value)}
                onFocus={() => value && setShow(true)}
            />

            {show && list.length > 0 && (
                <div
                    style={{
                        position: "absolute",
                        background: "#fff",
                        border: "1px solid #ddd",
                        width: "100%",
                        zIndex: 10,
                        maxHeight: "200px",
                        overflowY: "auto"
                    }}
                >
                    {list.map((p) => (
                        <div
                            key={p.id}
                            style={{ padding: "8px", cursor: "pointer" }}
                            onMouseDown={() => {
                                console.log("Product selected:", p);
                                onSelect({
                                    name: p?.name,
                                    hsn: p?.hsn,
                                    price: p.selling_price,
                                    tax: p.tax || 0
                                });
                                setShow(false);
                            }}
                        >
                            {p.name} ({p.barcode})
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

function CustomerSearch({ label, value, onChange, onSelect, placeholder, type = "text", customers = [] }) {
    const [show, setShow] = useState(false);
    const [filtered, setFiltered] = useState([]);

    useEffect(() => {
        if (!value || value.length < 1) {
            setFiltered([]);
            return;
        }
        const query = value.toLowerCase();
        const results = customers.filter(c =>
            c.name?.toLowerCase().includes(query) ||
            c.email?.toLowerCase().includes(query) ||
            c.mobile_number?.includes(query)
        ).slice(0, 8);
        setFiltered(results);
    }, [value, customers]);

    return (
        <div className="inv-field" style={{ position: 'relative' }}>
            <label className="inv-label">{label}</label>
            <div style={{ position: 'relative' }}>
                <input
                    className="input"
                    type={type}
                    placeholder={placeholder}
                    value={value}
                    onChange={(e) => {
                        onChange(e.target.value);
                        setShow(true);
                    }}
                    onFocus={() => value && setShow(true)}
                    onBlur={() => setTimeout(() => setShow(false), 200)}
                />
                {show && filtered.length > 0 && (
                    <div className="cust-suggestions">
                        {filtered.map(c => (
                            <div key={c.id} className="cust-suggestion-item" onMouseDown={() => {
                                console.log("Customer selected:", c);
                                onSelect(c);
                                setShow(false);
                            }}>
                                <div className="cust-sugg-name">{c.name}</div>
                                <div className="cust-sugg-meta">{c.email} • {c.mobile_number}</div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

const PAYMENT_TYPES = [
    { id: 'cash', label: 'Cash', icon: '💵', usePOS: false },
    { id: 'upi', label: 'UPI', icon: '📱', usePOS: true },
    { id: 'wallet', label: 'Wallet', icon: '👛', usePOS: false },
];

const PAYMENT_STATUSES = [
    { id: 'pending', label: 'Pending', cls: 'ps-pending' },
    { id: 'paid', label: 'Paid', cls: 'ps-paid' },
    { id: 'partial', label: 'Partial', cls: 'ps-partial' },
    { id: 'overdue', label: 'Overdue', cls: 'ps-overdue' },
];

/* ─── Print Template ─── */
function printInvoice({ customerName, customerEmail, customerNumber, invoiceNo, issueDate, items = [], subtotal = 0, taxAmount = 0, total = 0, notes, paymentType, paymentStatus, amountPaid = 0 }) {
    const remaining = Math.max(0, total - amountPaid);
    const html = `<html><head><title>Invoice ${invoiceNo}</title>
    <style>
      body{font-family:'Segoe UI',sans-serif;padding:40px;color:#111}
      h1{font-size:22px;margin-bottom:4px}.sub{color:#666;font-size:13px;margin-bottom:30px}
      .meta{display:grid;grid-template-columns:1fr 1fr 1fr;gap:20px;margin-bottom:28px}
      .ml{font-size:10px;font-weight:700;letter-spacing:.06em;color:#999;text-transform:uppercase}
      .mv{font-size:14px;font-weight:600;margin-top:3px}
      table{width:100%;border-collapse:collapse;margin-bottom:24px}
      th{border-bottom:2px solid #e5e7eb;padding:9px 10px;text-align:left;font-size:11px;font-weight:700;color:#6b7280;text-transform:uppercase}
      td{padding:11px 10px;border-bottom:1px solid #f3f4f6;font-size:13.5px}
      .totals{width:280px;margin-left:auto}
      .row{display:flex;justify-content:space-between;padding:4px 0;font-size:13.5px;color:#555}
      .tot{font-size:17px;font-weight:800;color:#111;border-top:2px solid #e5e7eb;padding-top:10px;margin-top:6px}
      .rem{color:#ef4444;font-weight:700}
      .badge{display:inline-block;padding:3px 10px;border-radius:14px;font-size:11px;font-weight:700}
      .paid{background:#dcfce7;color:#166534}.pending{background:#fef9c3;color:#854d0e}
      .overdue{background:#fee2e2;color:#991b1b}.partial{background:#dbeafe;color:#1e40af}
      .footer{margin-top:40px;font-size:12px;color:#999;border-top:1px solid #e5e7eb;padding-top:16px}
    </style></head><body>
    <h1>🧾 Custodian Billing — Invoice</h1>
    <p class="sub">FrontDesk Pro | Billing Terminal 01 | ${new Date().toLocaleDateString()}</p>
    <div class="meta">
      <div><div class="ml">Customer</div><div class="mv">${customerName || '—'}<br/><small style="font-weight:400;color:#666">${customerEmail || ''} ${customerNumber ? '• ' + customerNumber : ''}</small></div></div>
      <div><div class="ml">Invoice No.</div><div class="mv">${invoiceNo}</div></div>
      <div><div class="ml">Issue Date</div><div class="mv">${issueDate}</div></div>
      <div><div class="ml">Payment Type</div><div class="mv">${paymentType?.label || '—'}</div></div>
      <div><div class="ml">Status</div><div class="mv"><span class="badge ${paymentStatus?.id || 'pending'}">${paymentStatus?.label || 'Pending'}</span></div></div>
    </div>
    <table>
      <thead><tr><th>Service / Product</th><th>Qty</th><th>Price</th><th>Tax %</th><th>Subtotal</th></tr></thead>
      <tbody>${items.map(i => `< tr ><td>${i.name || '—'}</td><td>${i.qty}</td><td>₹${i.price.toFixed(2)}</td><td>${i.tax}%</td><td><b>₹${(i.qty * i.price).toFixed(2)}</b></td></tr> `).join('')}</tbody>
    </table>
    <div class="totals">
      <div class="row"><span>Subtotal</span><span>₹${subtotal?.toFixed(2)}</span></div>
      <div class="row"><span>Tax (8.5%)</span><span>₹${taxAmount?.toFixed(2)}</span></div>
      <div class="row tot"><span>Total</span><span>₹${total?.toFixed(2)}</span></div>
      <div class="row"><span>Amount Paid</span><span>₹${amountPaid?.toFixed(2)}</span></div>
      ${remaining > 0 ? `<div class="row rem" ><span>Balance Remaining</span><span>₹${remaining?.toFixed(2)}</span></div > ` : ''}
    </div>
    ${notes ? `< p style = "margin-top:24px;font-size:13px;color:#555" > <b>Note:</b> ${notes}</p > ` : ''}
    <div class="footer">© 2024 Custodian Pro. Standard Financial Ledger protocols v4.2</div>
    </body></html>`;
    const w = window.open('', '_blank');
    w.document.write(html);
    w.document.close();
    w.print();
}

/* ─── Preview Modal ─── */
function PreviewModal({ open, onClose, data, onPrint }) {
    if (!open) return null;
    const { customerName, customerEmail, customerNumber, invoiceNo, issueDate, items, subtotal, taxAmount, total, notes, paymentType, paymentStatus, amountPaid } = data;
    const remaining = Math.max(0, total - amountPaid);
    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-box" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <div><div className="fw-600" style={{ fontSize: 16 }}>Invoice Preview</div><div className="txt-xs txt-light">Review before saving or printing</div></div>
                    <button className="modal-close" onClick={onClose}>✕</button>
                </div>
                <div className="modal-body">
                    <div className="preview-brand">
                        <div className="preview-logo"><svg width="18" height="18" viewBox="0 0 24 24" fill="none"><rect x="2" y="5" width="20" height="14" rx="3" stroke="#fff" strokeWidth="1.8" /><rect x="6" y="9" width="8" height="2" rx="1" fill="#fff" /></svg></div>
                        <div><div className="fw-600" style={{ fontSize: 15 }}>Custodian Billing</div><div className="txt-xs txt-light">FrontDesk Pro | Billing Terminal 01</div></div>
                        {paymentStatus && <span className={`inv-ps-badge ${paymentStatus.cls}`} style={{ marginLeft: 'auto' }}>{paymentStatus.label}</span>}
                    </div>
                    <div className="preview-meta">
                        <div><div className="inv-label">CUSTOMER</div><div className="fw-600">{customerName || '—'}</div><div className="txt-xs txt-light">{customerEmail} {customerNumber && `• ${customerNumber}`}</div></div>
                        <div><div className="inv-label">INVOICE NO.</div><div className="fw-600">{invoiceNo}</div></div>
                        <div><div className="inv-label">ISSUE DATE</div><div className="fw-600">{issueDate}</div></div>
                        <div><div className="inv-label">PAYMENT TYPE</div><div className="fw-600">{paymentType ? `${paymentType.icon} ${paymentType.label}` : '—'}</div></div>
                    </div>
                    <table className="preview-table">
                        <thead><tr><th>Item</th><th>Qty</th><th>Price</th><th>Tax</th><th>Subtotal</th></tr></thead>
                        <tbody>{items.map(i => (
                            <tr key={i.id}><td>{i.name || '—'}</td><td>{i.qty}</td><td>₹{Number(i.price || 0).toFixed(2)}</td><td>{i.tax}%</td><td className="fw-600">₹{(Number(i.qty || 0) * Number(i.price || 0)).toFixed(2)}</td></tr>
                        ))}</tbody>
                    </table>
                    <div className="preview-totals">
                        <div className="preview-total-row"><span>Subtotal</span><span>₹{Number(subtotal || 0).toFixed(2)}</span></div>
                        <div className="preview-total-row"><span>Tax (8.5%)</span><span>₹{Number(taxAmount || 0).toFixed(2)}</span></div>
                        <div className="preview-total-row preview-grand-total"><span>TOTAL</span><span>₹{Number(total || 0).toFixed(2)}</span></div>
                        <div className="preview-total-row"><span>Amount Paid</span><span className="txt-success fw-600">₹{Number(amountPaid || 0).toFixed(2)}</span></div>
                        {remaining > 0 && <div className="preview-total-row"><span>Balance Remaining</span><span className="txt-danger fw-600">₹{Number(remaining || 0).toFixed(2)}</span></div>}
                    </div>
                    {notes && <div className="preview-notes"><b>Note:</b> {notes}</div>}
                </div>
                <div className="modal-footer">
                    <button className="btn btn-outline" onClick={onClose}>Close</button>
                    <button className="btn btn-outline" onClick={() => printInvoice(data)}>🖨 Print</button>
                    <button className="btn btn-primary" onClick={onClose}>✓ Save Invoice</button>
                </div>
            </div>
        </div>
    );
}

/* ─── Manual Confirmation Modal (Cash / fallback) ─── */
function ManualConfirmModal({ open, onClose, onConfirm, total, isFallback }) {
    const [cashGiven, setCashGiven] = useState('');
    const [confirmed, setConfirmed] = useState(false);

    const change = cashGiven && parseFloat(cashGiven) >= total
        ? (parseFloat(cashGiven) - total).toFixed(2) : null;

    const handleConfirm = () => {
        setConfirmed(true);
        setTimeout(() => { onConfirm(); handleClose(); }, 1200);
    };
    const handleClose = () => { setCashGiven(''); setConfirmed(false); onClose(); };

    if (!open) return null;
    return (
        <div className="modal-overlay" onClick={handleClose}>
            <div className="modal-box modal-box-pos" onClick={e => e.stopPropagation()}>
                {!confirmed ? (
                    <>
                        <div className="modal-header">
                            <div>
                                <div className="fw-600" style={{ fontSize: 16 }}>{isFallback ? '🖐 Manual Confirmation' : '💵 Cash Payment'}</div>
                                <div className="txt-xs txt-light">{isFallback ? 'Confirm payment received manually' : 'Collect cash and record payment'}</div>
                            </div>
                            <button className="modal-close" onClick={handleClose}>✕</button>
                        </div>
                        <div className="modal-body">
                            <div className="pos-amount-display">
                                <div className="pos-amount-label">Amount Due</div>
                                <div className="pos-amount">₹{total.toFixed(2)}</div>
                                {isFallback && <div className="pos-method" style={{ color: '#f59e0b' }}>⚠️ POS Unavailable — Manual Mode</div>}
                            </div>
                            <div className="pos-cash-section">
                                <label className="inv-label" style={{ marginBottom: 6, display: 'block' }}>CASH / AMOUNT TENDERED</label>
                                <div className="pos-cash-input">
                                    <span className="pos-dollar">₹</span>
                                    <input
                                        className="input" type="number" placeholder="0.00"
                                        value={cashGiven} onChange={e => setCashGiven(e.target.value)}
                                        style={{ paddingLeft: 26, fontSize: 17, fontWeight: 700 }}
                                    />
                                </div>
                                {change !== null && (
                                    <div className="pos-change">Change to return: <b>₹{change}</b></div>
                                )}
                                {cashGiven && parseFloat(cashGiven) < total && (
                                    <div className="pos-partial-warn">⚠️ Partial payment — ₹{(total - parseFloat(cashGiven)).toFixed(2)} will remain outstanding</div>
                                )}
                            </div>
                            {isFallback && (
                                <div className="manual-info">
                                    <div className="manual-info-icon">📋</div>
                                    <div>Verify payment with customer receipt, bank screenshot, or signed acknowledgment before confirming.</div>
                                </div>
                            )}
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-outline" onClick={handleClose}>Cancel</button>
                            <button className="btn btn-primary" onClick={handleConfirm} disabled={!cashGiven}>
                                ✓ Confirm Payment
                            </button>
                        </div>
                    </>
                ) : (
                    <div className="pos-result pos-success" style={{ minHeight: 220 }}>
                        <div className="pos-result-icon">✓</div>
                        <div className="fw-600" style={{ fontSize: 18 }}>Payment Recorded!</div>
                        <div className="txt-sm txt-light">Manual confirmation saved successfully.</div>
                    </div>
                )}
            </div>
        </div>
    );
}

/* ─── POS Terminal Modal (Card / UPI / Bank only) ─── */
function POSModal({ open, onClose, onConfirm, total, paymentType }) {
    const [posStep, setPosStep] = useState('waiting');

    const handleProcess = () => {
        setPosStep('processing');
        setTimeout(() => setPosStep(Math.random() > 0.1 ? 'success' : 'failed'), 2200);
    };
    const handleClose = () => { setPosStep('waiting'); onClose(); };

    if (!open) return null;

    const prompts = {
        card: { icon: '💳', text: 'Please swipe, insert, or tap the customer\'s card on the terminal.' },
        upi: { icon: '📱', text: 'Ask customer to scan QR code or enter UPI ID to complete payment.' },
        bank: { icon: '🏦', text: 'Bank transfer initiated. Reference ID will be generated after confirmation.' },
    };
    const prompt = prompts[paymentType?.id] || prompts.card;

    return (
        <div className="modal-overlay" onClick={handleClose}>
            <div className="modal-box modal-box-pos" onClick={e => e.stopPropagation()}>
                {posStep === 'waiting' && (
                    <>
                        <div className="modal-header">
                            <div><div className="fw-600" style={{ fontSize: 16 }}>⚡ POS Payment Terminal</div><div className="txt-xs txt-light">Authorize payment from hardware terminal</div></div>
                            <button className="modal-close" onClick={handleClose}>✕</button>
                        </div>
                        <div className="modal-body">
                            <div className="pos-amount-display">
                                <div className="pos-amount-label">Amount Due</div>
                                <div className="pos-amount">₹{total.toFixed(2)}</div>
                                {paymentType && <div className="pos-method">{paymentType.icon} {paymentType.label}</div>}
                            </div>
                            <div className="pos-card-prompt">
                                <div className="pos-card-icon">{prompt.icon}</div>
                                <div>{prompt.text}</div>
                            </div>
                            <div className="pos-steps">
                                <div className="pos-step pos-step-active"><span className="pos-step-dot">1</span>Present method on terminal</div>
                                <div className="pos-step"><span className="pos-step-dot">2</span>Authorize transaction</div>
                                <div className="pos-step"><span className="pos-step-dot">3</span>Print receipt</div>
                            </div>
                            <button className="pos-fallback-btn" onClick={() => { handleClose(); }}>
                                ⚠️ POS unavailable? Use manual confirmation
                            </button>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-outline" onClick={handleClose}>Cancel</button>
                            <button className="btn btn-primary" onClick={handleProcess}>Authorize &amp; Process →</button>
                        </div>
                    </>
                )}
                {posStep === 'processing' && (
                    <div className="pos-processing">
                        <div className="pos-spinner"></div>
                        <div className="fw-600" style={{ fontSize: 16 }}>Processing Payment…</div>
                        <div className="txt-sm txt-light">Communicating with terminal. Please wait.</div>
                    </div>
                )}
                {posStep === 'success' && (
                    <div className="pos-result pos-success">
                        <div className="pos-result-icon">✓</div>
                        <div className="fw-600" style={{ fontSize: 18 }}>Payment Confirmed!</div>
                        <div className="txt-sm txt-light">Transaction completed successfully.</div>
                        <div className="pos-txn-id">TXN-{Math.floor(Math.random() * 90000 + 10000)}</div>
                        <div className="modal-footer" style={{ border: 'none', paddingTop: 0 }}>
                            <button className="btn btn-outline">🖨 Print Receipt</button>
                            <button className="btn btn-primary" onClick={() => { onConfirm(); handleClose(); }}>Done ✓</button>
                        </div>
                    </div>
                )}
                {posStep === 'failed' && (
                    <div className="pos-result pos-failed">
                        <div className="pos-result-icon pos-result-icon-fail">✕</div>
                        <div className="fw-600" style={{ fontSize: 18 }}>Payment Failed</div>
                        <div className="txt-sm txt-light">Transaction declined. Try again or use manual confirmation.</div>
                        <div className="modal-footer" style={{ border: 'none', paddingTop: 0 }}>
                            <button className="btn btn-outline" onClick={() => setPosStep('waiting')}>← Try Again</button>
                            <button className="btn btn-outline" onClick={handleClose}>Cancel</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

/* ─── Main Page ─── */
export default function InvoicingPage() {
    const [items, setItems] = useState([{
        id: 1,
        type: 'PRODUCT',
        category_id: '',
        product_id: '',
        name: '',
        qty: 1,
        price: 0,
        tax: 8.5,
        attributes: {},
        serial_numbers: [],
        discount: "", device_id: "", brand: "", hsn: "", description: "", issue_description_text: "",
        availableSerials: [],
        productsList: [],
        isLoadingProducts: false,
        isLoadingSerials: false
    }]);
    const [customerName, setCustomerName] = useState('');
    const [customerEmail, setCustomerEmail] = useState('');
    const [customerNumber, setCustomerNumber] = useState('');
    const [notes, setNotes] = useState('');
    const [tags, setTags] = useState(['Q4_RECURRING', 'VIP_PRIORITY']);
    const [invoiceNo, setInvoiceNo] = useState('');
    const [issueDate, setIssueDate] = useState(new Date().toISOString().split('T')[0]);
    const [paymentType, setPaymentType] = useState(null);
    const [paymentStatus, setPaymentStatus] = useState(PAYMENT_STATUSES[0]);
    const [amountPaid, setAmountPaid] = useState('');
    const [showPreview, setShowPreview] = useState(false);
    const [showPOS, setShowPOS] = useState(false);
    const [showManual, setShowManual] = useState(false);
    const [manualIsFallback, setManualIsFallback] = useState(false);
    const [barcodeQuery, setBarcodeQuery] = useState('');

    const subtotal = items?.reduce((s, i) => s + i?.qty * i?.price, 0);
    const taxAmount = items?.reduce((s, i) => s + i?.qty * i?.price * i.tax / 100, 0);
    const total = subtotal + taxAmount;
    const paidNum = parseFloat(amountPaid) || 0;
    const remaining = Math.max(0, total - paidNum);
    const [customers, setCustomers] = useState([]);
    const [allCategories, setAllCategories] = useState([]);
    const [allProducts, setAllProducts] = useState([]);
    const { user } = useAuth();
    const hubId = user?.hubs?.[0]?.id || user?.hub_id || user?.hubId || user?.hub?.id || "";

    console.log("DEBUG: Logged in User Profile:", user);
    console.log("Active Hub ID:", hubId);

    const addItem = () => setItems([...items, {
        id: nextId++,
        type: 'PRODUCT',
        category_id: '',
        product_id: '',
        name: '',
        qty: 1,
        price: 0,
        tax: 8.5,
        attributes: {},
        serial_numbers: [],
        discount: "", device_id: "", brand: "", hsn: "", description: "", issue_description_text: "",
        availableSerials: [],
        productsList: [],
        isLoadingProducts: false,
        isLoadingSerials: false
    }]);
    // const applyProduct = (id, product) => setItems(items.map(i =>
    //     i.id === id ? { ...i, name: product.name, hsn: product.hsn, price: product.price, tax: product.tax } : i
    // ));
    const applyProduct = (id, product) => setItems(items?.map(i =>
        i.id === id
            ? {
                ...i,
                name: product.name,
                hsn: product.hsn,
                price: product.price,
                tax: product.tax,
                qty: 1
            }
            : i
    ));
    console.log(items)
    const removeItem = (id) => setItems(items.filter(i => i.id !== id));
    const updateItem = (id, field, val) => setItems(prev => prev.map(i => i.id === id ? { ...i, [field]: val } : i));

    const invoiceData = { customerName, customerEmail, customerNumber, invoiceNo, issueDate, items, subtotal, taxAmount, total, notes, paymentType, paymentStatus, amountPaid: paidNum };

    const handleCheckout = () => {
        if (!paymentType) return alert('Please select a payment type first.');
        if (paymentType.usePOS) {
            setShowPOS(true);
        } else {
            // Cash → manual confirmation
            setManualIsFallback(false);
            setShowManual(true);
        }
    };

    const fetchCustomers = async (size = 1000) => {
        try {
            //   setLoading(true);

            const response = await axiosInstance.get(
                `${Api.allUsers}?role=CUSTOMER&size=${size}`
            );

            setCustomers(response.data?.users || []);

        } catch (error) {
            console.error("Failed to fetch customers:", error);
            toast.error("Failed to load customers list");
        } finally {
            //   setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const res = await axiosInstance.get(Api.categories);
            console.log("Categories API response:", res.data);
            const rawCategories = res.data?.categories || res.data?.data || res.data || [];
            const filtered = rawCategories.filter(c =>
                String(c.type).toUpperCase() === "PRODUCT" &&
                String(c.status).toUpperCase() === "ACTIVE"
            );
            console.log("Filtered categories:", filtered);
            setAllCategories(filtered);
        } catch (err) {
            console.error("Failed to fetch categories:", err);
            toast.error("Failed to load categories");
        }
    };

    const fetchAllProducts = async () => {
        try {
            const res = await axiosInstance.get(`${Api.products}?size=1000&include_attribute=true&include_pricing=true`);
            console.log("All Products response:", res.data);
            const products = res.data?.products || res.data?.data || res.data || [];
            setAllProducts(products);
        } catch (err) {
            console.error("Failed to fetch all products:", err);
            toast.error("Failed to load products list");
        }
    };

    const fetchProductsForCategory = async (itemId, categoryId) => {
        updateItem(itemId, 'isLoadingProducts', true);
        try {
            const res = await axiosInstance.get(`${Api.products}?category_id=${categoryId}&include_attribute=true&include_pricing=true`);
            console.log(`Products for category ${categoryId}:`, res.data);
            const products = res.data?.products || res.data?.data || res.data || [];
            setItems(prev => prev.map(item => item.id === itemId ? { ...item, productsList: products, isLoadingProducts: false } : item));
        } catch (err) {
            console.error("Failed to fetch products:", err);
            toast.error("Failed to load products for this category");
            updateItem(itemId, 'isLoadingProducts', false);
        }
    };

    const fetchSerialsForProduct = async (itemId, productId) => {
        updateItem(itemId, 'isLoadingSerials', true);
        try {
            const res = await axiosInstance.get(`${Api.productSerialAvailability}?product_id=${productId}`);
            console.log(`Serials for product ${productId}:`, res.data);
            const availabilityData = res.data?.availability || res.data?.serial_numbers || res.data?.data || res.data || [];
            let serials = [];
            const dataToLoop = Array.isArray(availabilityData) ? availabilityData : [];
            dataToLoop.forEach((item) => {
                if (item.available_serial_numbers) {
                    if (typeof item.available_serial_numbers === "string") {
                        const split = item.available_serial_numbers.split(",").map(s => s.trim()).filter(Boolean);
                        serials = [...serials, ...split];
                    } else if (Array.isArray(item.available_serial_numbers)) {
                        serials = [...serials, ...item.available_serial_numbers];
                    }
                } else if (item.serial_numbers && Array.isArray(item.serial_numbers)) {
                    serials = [...serials, ...item.serial_numbers];
                } else if (typeof item === 'string') {
                    serials.push(item);
                } else if (item.serial_number) {
                    serials.push(item.serial_number);
                }
            });
            const uniqueSerials = [...new Set(serials)];
            setItems(prev => prev.map(item => item.id === itemId ? { ...item, availableSerials: uniqueSerials, isLoadingSerials: false } : item));
        } catch (err) {
            console.error("Failed to fetch serials:", err);
            toast.error("Failed to load stock availability");
            updateItem(itemId, 'isLoadingSerials', false);
        }
    };

    useEffect(() => {
        fetchCustomers("1000");
        fetchCategories();
        fetchAllProducts();
    }, []);


    const openManualFallback = () => {
        setShowPOS(false);
        setManualIsFallback(true);
        setShowManual(true);
    };

    const handleBarcodeSearch = (val) => {
        setBarcodeQuery(val);
        if (!val) return;

        // Try to find product by barcode or SKU
        const product = allProducts.find(p =>
            String(p.barcode).trim() === String(val).trim()
        );

        if (product) {
            // Found it! Add to items
            let amount = 0;
            const priceObj = product.product_pricing?.[0] || product.pricing?.[0];
            if (priceObj && priceObj.price) amount = priceObj.price;
            else if (product.price) amount = product.price;
            else if (product.selling_price) amount = product.selling_price;

            const newItem = {
                id: nextId++,
                type: 'PRODUCT',
                category_id: product.categories?.[0]?.id || '',
                product_id: product.id,
                name: product.name,
                qty: 1,
                price: amount,
                tax: product.tax || 0,
                attributes: {},
                serial_numbers: [],
                discount: "",
                device_id: "",
                brand: product.brand_name || product.brand || "",
                hsn: product.hsn || "",
                description: "",
                issue_description_text: "",
                availableSerials: [],
                productsList: [],
                isLoadingProducts: false,
                isLoadingSerials: false
            };

            setItems(prev => {
                // If first item is empty, replace it
                if (prev.length === 1 && !prev[0].product_id) {
                    return [newItem];
                }
                // Check if product already exists to increment qty? (User didn't ask but typical)
                // For now just append as per request "automatically have that product"
                return [...prev, newItem];
            });

            setBarcodeQuery(''); // Clear
            toast.success(`Found: ${product.name}`);
            fetchSerialsForProduct(newItem.id, product.id);
        }
    };

    const handleSaveAndPreview = async () => {
        if (!customerName || !customerNumber) {
            toast.error("Customer Name and Number are required!");
            return;
        }
        if (!items || items.length === 0 || !items[0].product_id) {
            toast.error("At least one valid item is required!");
            return;
        }

        try {
            const payload = {
                customer_name: customerName,
                customer_number: customerNumber.replace(/\D/g, ''),
                customer_email: customerEmail || "",
                customer_gst: "",
                address: "Shop Address",
                google_address: "",
                latitude: 0,
                longitude: 0,
                slot_id: null,
                is_instant_slot: false,
                is_otp_required: false,
                is_paid: remaining <= 0,
                payment_method: paymentType ? paymentType.id.toUpperCase() : "CASH",
                transaction_id: "",
                no_assignment: true,
                no_razorpay: true,
                order_platform: "SHOP",
                order_type: "B2C",
                partial_payment_amount: paidNum.toString(),
                user_id: null,
                hub_id: hubId,
                zone_id: user?.zone_id || null,
                items: items.map(item => {
                    const cleanAttributes = Object.fromEntries(
                        Object.entries(item.attributes || {}).filter(([_, v]) => v !== "" && v !== null)
                    );
                    return {
                        type: item.type || "PRODUCT",
                        quantity: Number(item.qty),
                        issue_description_text: item.issue_description_text || "",
                        description: item.description || "",
                        attributes: JSON.stringify(cleanAttributes),
                        serial_numbers: item.serial_numbers?.filter(sn => sn.trim() !== "") || [],
                        discount: String(item.discount || "0"),
                        device_id: item.device_id || "",
                        media: [],
                        brand: item.brand || "",
                        hsn_code: item.hsn || "",
                        product_id: item.product_id,
                        amount: String(item.price || "0"),
                    };
                })
            };

            const response = await axiosInstance.post(Api.publicOrder, payload);
            if (response.data) {
                toast.success("Order Created Successfully!");
                setShowPreview(true);
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to create order");
            console.error("Order creation failed:", err);
        }
    };

    const handlePaymentConfirmed = () => {
        setPaymentStatus(PAYMENT_STATUSES.find(s => s.id === (remaining <= 0 ? 'paid' : 'partial')));
        if (paidNum === 0) setAmountPaid(total.toFixed(2));
    };

    return (
        <div className="inv">
            {/* Header */}
            <div className="inv-header">
                <div>
                    <h1 className="section-title">New Invoice</h1>
                    <p className="section-subtitle">Create a professional ledger entry for your client.</p>
                </div>
                <div className="inv-header-actions">
                    <button className="btn btn-outline" onClick={() => printInvoice(invoiceData)}>Print</button>
                    <button className="btn btn-outline" onClick={() => setShowPreview(true)}>Preview</button>
                    <button className="btn btn-primary" onClick={handleSaveAndPreview}>Place Order</button>
                </div>
            </div>

            <div className="inv-grid">
                {/* ── Left ── */}
                <div className="inv-left">
                    {/* Customer + meta */}
                    <div className="card card-pad">
                        <div className="inv-meta">
                            <CustomerSearch
                                label="CUSTOMER NUMBER"
                                placeholder="Customer phone number"
                                value={customerNumber}
                                customers={customers}
                                onChange={(val) => {
                                    const clean = val.replace(/\D/g, '');
                                    if (clean.length <= 10) setCustomerNumber(clean);
                                }}
                                onSelect={(c) => {
                                    setCustomerName(c.name || '');
                                    setCustomerEmail(c.email || '');
                                    setCustomerNumber(c.mobile_number || '');
                                }}
                            />
                            <CustomerSearch
                                label="CUSTOMER NAME"
                                placeholder="Customer name"
                                value={customerName}
                                customers={customers}
                                onChange={setCustomerName}
                                onSelect={(c) => {
                                    setCustomerName(c.name || '');
                                    setCustomerEmail(c.email || '');
                                    setCustomerNumber(c.mobile_number || '');
                                }}
                            />
                            <CustomerSearch
                                label="CUSTOMER EMAIL"
                                placeholder="Customer email"
                                type="email"
                                value={customerEmail}
                                customers={customers}
                                onChange={setCustomerEmail}
                                onSelect={(c) => {
                                    setCustomerName(c.name || '');
                                    setCustomerEmail(c.email || '');
                                    setCustomerNumber(c.mobile_number || '');
                                }}
                            />
                            <div className="inv-field">
                                <label className="inv-label">INVOICE NUMBER</label>
                                <input className="input" placeholder="Enter invoice number" value={invoiceNo} onChange={e => setInvoiceNo(e.target.value)} />
                            </div>
                            <div className="inv-field">
                                <label className="inv-label">ISSUE DATE</label>
                                <input className="input" type="date" value={issueDate} onChange={e => setIssueDate(e.target.value)} />
                            </div>
                        </div>
                    </div>


                    {/* Billing Items */}
                    <div className="card" style={{ marginTop: 14 }}>
                        <div className="inv-items-head" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderBottom: '1px solid var(--border)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                                <span className="fw-600" style={{ fontSize: '15px' }}>Billing Items</span>
                                <div style={{ position: 'relative' }}>
                                    <input
                                        className="input"
                                        style={{ width: '250px', height: '34px', fontSize: '13px', background: '#fcfcfc' }}
                                        placeholder="Enter Barcode"
                                        value={barcodeQuery}
                                        onChange={e => handleBarcodeSearch(e.target.value)}
                                        autoFocus
                                    />
                                </div>
                            </div>
                            <button className="btn btn-primary btn-sm" onClick={addItem}>⊕ Add Item</button>
                        </div>
                        <div className="items-list" style={{ marginTop: '16px', padding: '0 16px', paddingBottom: '16px' }}>
                            {items?.map((item, index) => (
                                <div key={item.id} className="item-card group">
                                    {items.length > 1 && (
                                        <button className="item-remove-btn" onClick={() => removeItem(item.id)}>✕</button>
                                    )}

                                    <div className="item-grid">
                                        {/* <div className="col-span-3">
                                            <label className="inv-label text-xs uppercase block mb-1">CATEGORY *</label>
                                            <select
                                                className="input w-full"
                                                value={item.category_id}
                                                onChange={(e) => {
                                                    const catId = e.target.value;
                                                    setItems(prev => prev.map(i => i.id === item.id ? {
                                                        ...i,
                                                        category_id: catId,
                                                        product_id: '',
                                                        availableSerials: [],
                                                        serial_numbers: [],
                                                        attributes: {}
                                                    } : i));
                                                    if (catId) fetchProductsForCategory(item.id, catId);
                                                }}
                                            >
                                                <option value="">Choose Category</option>
                                                {allCategories.map(cat => (
                                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                                ))}
                                            </select>
                                        </div> */}

                                        <div className="col-span-4">
                                            <label className="inv-label text-xs uppercase block mb-1">PRODUCT *</label>
                                            <select
                                                className="input w-full"
                                                value={item.product_id}
                                                // disabled={!item.category_id || item.isLoadingProducts}
                                                onChange={(e) => {
                                                    const prodId = e.target.value;
                                                    // const prod = item.productsList.find(p => String(p.id) === String(prodId));
                                                    const prod = allProducts.find(p => String(p.id) === String(prodId));

                                                    let amount = 0;
                                                    if (prod) {
                                                        const priceObj = prod.product_pricing?.[0] || prod.pricing?.[0];
                                                        if (priceObj && priceObj.price) amount = priceObj.price;
                                                        else if (prod.price) amount = prod.price;
                                                        else if (prod.selling_price) amount = prod.selling_price;
                                                    }

                                                    setItems(prev => prev.map(i => i.id === item.id ? {
                                                        ...i,
                                                        product_id: prodId,
                                                        name: prod?.name || '',
                                                        price: amount,
                                                        tax: prod?.tax || 0,
                                                        brand: prod?.brand_name || prod?.brand || '',
                                                        hsn: prod?.hsn || '',
                                                        description: '',
                                                        serial_numbers: [],
                                                        attributes: {}
                                                    } : i));
                                                    if (prodId) fetchSerialsForProduct(item.id, prodId);
                                                }}
                                            >
                                                <option value="">Choose product</option>
                                                {allProducts?.map(p => (
                                                    <option key={p.id} value={p.id}>{p.name}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="col-span-2">
                                            <label className="inv-label text-xs uppercase block mb-1">QTY *</label>
                                            <input
                                                className="input w-full"
                                                type="number"
                                                min="1"
                                                value={item.qty}
                                                onChange={e => {
                                                    const newQty = Math.max(1, Number(e.target.value));
                                                    setItems(prev => prev.map(i => i.id === item.id ? {
                                                        ...i,
                                                        qty: newQty,
                                                        serial_numbers: i.serial_numbers.slice(0, newQty)
                                                    } : i));
                                                }}
                                            />
                                        </div>

                                        <div className="col-span-3">
                                            <label className="inv-label text-xs uppercase block mb-1">AMOUNT *</label>
                                            <input
                                                className="input w-full"
                                                type="number"
                                                min="0"
                                                value={item.price}
                                                onChange={e => updateItem(item.id, 'price', Number(e.target.value))}
                                            />
                                        </div>

                                        <div className="col-span-3">
                                            <label className="inv-label text-xs uppercase block mb-1">DISCOUNT</label>
                                            <input className="input w-full" type="number" min="0" placeholder="0.00" value={item.discount} onChange={e => updateItem(item.id, 'discount', e.target.value)} />
                                        </div>

                                        {/* Dynamic Attributes Mapping */}
                                        {(() => {
                                            const prod = allProducts.find(p => String(p.id) === String(item.product_id));
                                            const attrList = prod?.attributes || [];
                                            if (attrList.length === 0) return null;

                                            const grouped = {};
                                            attrList.forEach(a => {
                                                const name = a.attribute_name || a.name || "Option";
                                                const id = a.attribute_id;
                                                if (!grouped[name]) grouped[name] = { id, name, options: [] };
                                                grouped[name].options.push(a);
                                            });

                                            const groups = Object.values(grouped);
                                            if (groups.length === 0) return null;

                                            return (
                                                <div className="col-span-12 item-grid mt-2">
                                                    {groups.map(group => (
                                                        <div className="col-span-3" key={group.name}>
                                                            <label className="inv-label text-xs uppercase block mb-1">{group.name}</label>
                                                            <select
                                                                className="input w-full"
                                                                value={item.attributes[group.id] || ""}
                                                                onChange={(e) => {
                                                                    const val = e.target.value;
                                                                    setItems(prev => prev.map(i => i.id === item.id ? {
                                                                        ...i, attributes: { ...i.attributes, [group.id]: val }
                                                                    } : i));
                                                                }}
                                                            >
                                                                <option value="">Select {group.name}</option>
                                                                {group.options.map((opt) => (
                                                                    <option key={opt.id || opt.value_id} value={opt.id || opt.value_id}>{opt.value}</option>
                                                                ))}
                                                            </select>
                                                        </div>
                                                    ))}
                                                </div>
                                            );
                                        })()}

                                        {/* Additional Item Fields Block */}
                                        {/*
                                        <div className="col-span-12 item-grid mt-2">
                                            <div className="col-span-4">
                                                <label className="inv-label text-xs uppercase block mb-1">BRAND</label>
                                                <input className="input w-full" placeholder="Brand name" value={item.brand} onChange={e => updateItem(item.id, 'brand', e.target.value)} />
                                            </div>
                                            <div className="col-span-4">
                                                <label className="inv-label text-xs uppercase block mb-1">HSN CODE</label>
                                                <input className="input w-full" placeholder="HSN Code" value={item.hsn} onChange={e => updateItem(item.id, 'hsn', e.target.value)} />
                                            </div>
                                            <div className="col-span-4">
                                                <label className="inv-label text-xs uppercase block mb-1">DEVICE ID</label>
                                                <input className="input w-full" placeholder="Device ID" value={item.device_id} onChange={e => updateItem(item.id, 'device_id', e.target.value)} />
                                            </div>
                                        </div>

                                        <div className="col-span-12 mt-2">
                                            <label className="inv-label text-xs uppercase block mb-1">ITEM DESCRIPTION</label>
                                            <input className="input w-full" placeholder="Item specific description" value={item.description} onChange={e => updateItem(item.id, 'description', e.target.value)} />
                                        </div>
                                        <div className="col-span-12 mt-2">
                                            <label className="inv-label text-xs uppercase block mb-1">ISSUE DESCRIPTION / INSTRUCTION</label>
                                            <input className="input w-full" placeholder="Enter issue details" value={item.issue_description_text} onChange={e => updateItem(item.id, 'issue_description_text', e.target.value)} />
                                        </div>
                                        */}

                                        {/* Serial Numbers Grid */}
                                        {item.product_id && (
                                            <div className="col-span-12 sn-box mt-2">
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <label className="inv-label text-xs uppercase block">SERIAL NUMBERS ({item.qty}) *</label>
                                                    {(!item.availableSerials || item.availableSerials.length === 0) && !item.isLoadingSerials && (
                                                        <span className="text-xs" style={{ color: 'var(--danger)' }}>No stock found in this hub</span>
                                                    )}
                                                    {item.isLoadingSerials && <span className="text-xs text-light">Loading stock...</span>}
                                                </div>
                                                <div className="sn-grid">
                                                    {Array.from({ length: item.qty }).map((_, idx) => {
                                                        const otherSelectedSns = items.flatMap((it) => {
                                                            if (it.product_id === item.product_id) {
                                                                return (it.serial_numbers || []).filter((_, sIdx) => !(it.id === item.id && sIdx === idx));
                                                            }
                                                            return [];
                                                        });

                                                        return (
                                                            <select
                                                                key={idx}
                                                                className="input w-full"
                                                                value={item.serial_numbers[idx] || ''}
                                                                disabled={item.isLoadingSerials}
                                                                onChange={(e) => {
                                                                    const newSerials = [...item.serial_numbers];
                                                                    newSerials[idx] = e.target.value;
                                                                    updateItem(item.id, 'serial_numbers', newSerials);
                                                                }}
                                                            >
                                                                <option value="">Choose S/N {idx + 1}</option>
                                                                {(() => {
                                                                    const pool = item.availableSerials || [];
                                                                    const filteredOptions = pool.filter(sn => !otherSelectedSns.includes(sn));

                                                                    if (pool.length === 0) return <option disabled>🚫 No available stock</option>;
                                                                    if (filteredOptions.length === 0 && pool.length > 0) return <option disabled>No more units left</option>;

                                                                    return filteredOptions.map(sn => <option key={sn} value={sn}>{sn}</option>);
                                                                })()}
                                                            </select>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>


                    {/* Payment Type + Status */}
                    <div className="card card-pad" style={{ marginTop: 14 }}>
                        <div className="inv-pay-row">
                            <div className="inv-pay-col">
                                <div className="inv-label" style={{ marginBottom: 10 }}>PAYMENT TYPE</div>
                                <div className="inv-pay-types">
                                    {PAYMENT_TYPES.map(pt => (
                                        <button key={pt.id}
                                            className={`inv-pay-type-btn ${paymentType?.id === pt.id ? 'inv-pay-type-active' : ''}`}
                                            onClick={() => setPaymentType(pt)}>
                                            <span>{pt.icon}</span>
                                            <span className="txt-xs fw-600">{pt.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                            {/* <div className="inv-pay-col">
                                <div className="inv-label" style={{ marginBottom: 10 }}>PAYMENT STATUS</div>
                                <div className="inv-status-btns">
                                    {PAYMENT_STATUSES.map(ps => (
                                        <button key={ps.id}
                                            className={`inv-status-btn ${ps.cls} ${paymentStatus?.id === ps.id ? 'inv-status-active' : ''}`}
                                            onClick={() => setPaymentStatus(ps)}>
                                            {ps.label}
                                        </button>
                                    ))}
                                </div>
                            </div> */}
                        </div>
                    </div>

                    {/* Amount Paid / Remaining */}
                    <div className="card card-pad" style={{ marginTop: 14 }}>
                        <div className="inv-amt-row">
                            <div className="inv-amt-col">
                                <div className="inv-label" style={{ marginBottom: 7 }}>BALANCE REMAINING</div>
                                <div className={`inv-remaining ${remaining > 0 ? 'inv-remaining-due' : 'inv-remaining-clear'}`}>
                                    {remaining > 0 ? `₹${remaining.toFixed(2)} due` : '✓ Fully Paid'}
                                </div>
                            </div>
                            <div className="inv-amt-col">
                                <div className="inv-label" style={{ marginBottom: 7 }}>INVOICE TOTAL</div>
                                <div className="inv-total-display">₹{total.toFixed(2)}</div>
                            </div>
                            {/* <div className="inv-amt-divider"></div> */}
                            <div className="inv-amt-col">
                                <label className="inv-label" style={{ marginBottom: 7, display: 'block' }}>AMOUNT PAID</label>
                                <div className="inv-amt-input">
                                    <span className="inv-amt-dollar">₹</span>
                                    <input
                                        className="input"
                                        type="number"
                                        placeholder="0.00"
                                        value={amountPaid}
                                        onChange={e => setAmountPaid(e.target.value)}
                                        style={{ paddingLeft: 26, fontWeight: 600 }}
                                    />
                                </div>
                            </div>
                        </div>
                        {paidNum > 0 && paidNum < total && (
                            <div className="inv-partial-bar">
                                <div className="progress-bar" style={{ height: 6, marginTop: 12 }}>
                                    <div className="progress-fill" style={{ width: `${Math.min(100, (paidNum / total) * 100).toFixed(1)}%` }}></div>
                                </div>
                                <div className="txt-xs txt-light" style={{ marginTop: 4 }}>{((paidNum / total) * 100).toFixed(0)}% collected</div>
                            </div>
                        )}
                    </div>
                </div>

                {/* ── Right Summary ── */}
                <div className="inv-right">
                    <div className="card card-pad">
                        <div className="inv-sum-title">
                            📋 Invoice Summary
                            {paymentStatus && <span className={`inv-ps-badge ${paymentStatus.cls}`}>{paymentStatus.label}</span>}
                        </div>
                        <div className="inv-sum-rows">
                            <div className="inv-sum-row"><span>Subtotal</span><span>₹{subtotal?.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span></div>
                            <div className="inv-sum-row"><span>Tax (8.5%)</span><span>₹{taxAmount?.toFixed(2)}</span></div>
                        </div>
                        <div className="inv-sum-total">
                            <span>TOTAL AMOUNT</span>
                            <span>₹{total.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                        </div>

                        {/* Paid / Remaining mini summary */}
                        <div className="inv-paid-summary">
                            <div className="inv-paid-row">
                                <span className="txt-xs txt-light">Amount Paid</span>
                                <span className="fw-600 txt-success">₹{paidNum.toFixed(2)}</span>
                            </div>
                            <div className="inv-paid-row">
                                <span className="txt-xs txt-light">Remaining</span>
                                <span className={`fw-600 ${remaining > 0 ? 'txt-danger' : 'txt-success'}`}>
                                    {remaining > 0 ? `₹${remaining.toFixed(2)}` : 'Settled ✓'}
                                </span>
                            </div>
                        </div>

                        {paymentType && (
                            <div className="inv-pay-selected">{paymentType.icon} <span className="fw-600">{paymentType.label}</span><span className="txt-xs txt-light" style={{ marginLeft: 6 }}>selected</span></div>
                        )}

                        <div className="inv-compliance">
                            <span className="dot dot-green"></span>
                            <div>
                                <div className="fw-600" style={{ fontSize: '12px' }}>COMPLIANCE VERIFIED</div>
                                <div className="txt-xs txt-light" style={{ marginTop: '2px' }}>Standard Financial Ledger protocols v4.2</div>
                            </div>
                        </div>

                        {/* Checkout buttons */}
                        <div className="inv-checkout-btns">
                            {/* <button className="inv-pos-btn" onClick={handleCheckout}>
                                {paymentType?.usePOS === false ? '💵 Record Cash Payment' : '⚡ Confirm via POS Terminal'}
                            </button> */}
                            <button className="inv-manual-btn" onClick={() => { setManualIsFallback(true); setShowManual(true); }}>
                                🖐 Manual Confirmation
                            </button>
                        </div>
                    </div>

                    {/*
                    <div className="card card-pad" style={{ marginTop: 14 }}>
                        <div className="inv-label" style={{ marginBottom: '8px' }}>NOTES TO CUSTOMER</div>
                        <textarea className="input inv-notes" placeholder="Thank you for your business..." value={notes} onChange={e => setNotes(e.target.value)} rows={4} />
                        <div className="inv-label" style={{ margin: '14px 0 8px' }}>INTERNAL TAGS</div>
                        <div className="inv-tags">
                            {tags.map(t => (
                                <span key={t} className="inv-tag">{t} <button onClick={() => setTags(tags.filter(x => x !== t))}>×</button></span>
                            ))}
                            <button className="inv-tag inv-tag-add">⊕</button>
                        </div>
                    </div>
                    */}
                </div>
            </div>

            {/* Modals */}
            <PreviewModal open={showPreview} onClose={() => setShowPreview(false)} data={invoiceData} />
            <POSModal
                open={showPOS} onClose={() => setShowPOS(false)}
                onConfirm={handlePaymentConfirmed} total={total} paymentType={paymentType}
            />
            <ManualConfirmModal
                open={showManual} onClose={() => setShowManual(false)}
                onConfirm={handlePaymentConfirmed} total={total} isFallback={manualIsFallback}
            />
            <Toaster position="top-right" reverseOrder={false} />
        </div>
    );
}
