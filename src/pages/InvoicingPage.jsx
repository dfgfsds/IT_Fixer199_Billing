import { useState, useRef, useEffect } from 'react';
import './InvoicingPage.css';
import axiosInstance from '../configs/axios-middleware';
import Api from "../api-endpoints/ApiUrls"
import { useAuth } from '../contexts/AuthContext';
import toast, { Toaster } from 'react-hot-toast';
import Select from 'react-select';

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

            if (search) params.append("barcode", search);

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
// function printInvoice({ customerName, customerEmail, customerNumber, invoiceNo, issueDate, items = [], subtotal = 0, taxAmount = 0, total = 0, notes, paymentType, paymentStatus, amountPaid = 0, address }) {
//     const remaining = Math.max(0, Number(total || 0) - Number(amountPaid || 0));
//     const invDate = issueDate || new Date().toLocaleDateString();

//     const html = `<!DOCTYPE html><html><head><title></title>
//     <style>
//       body { font-family: 'Inter', system-ui, -apple-system, sans-serif; padding: 20px; color: #111; line-height: 1.5; }
//       .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; }
//       .logo-box { display: flex; align-items: center; gap: 12px; }
//       .logo-img { height: 40px; width: auto; object-fit: contain; }
//       .company-name { font-size: 20px; font-weight: 800; color: #111; letter-spacing: -0.5px; }
//       .sub { color: #6b7280; font-size: 11px; margin-top: 2px; }
//       .meta { display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; margin-bottom: 30px; }
//       .ml { font-size: 9px; font-weight: 700; letter-spacing: 0.05em; color: #9ca3af; text-transform: uppercase; }
//       .mv { font-size: 13px; font-weight: 600; color: #1f2937; margin-top: 2px; }
//       table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
//       th { border-bottom: 2px solid #f3f4f6; padding: 10px 8px; text-align: left; font-size: 10px; font-weight: 700; color: #6b7280; text-transform: uppercase; }
//       td { padding: 10px 8px; border-bottom: 1px solid #f3f4f6; font-size: 12px; color: #374151; }
//       .totals { width: 250px; margin-left: auto; }
//       .row { display: flex; justify-content: space-between; padding: 4px 0; font-size: 12px; color: #4b5563; }
//       .tot { font-size: 16px; font-weight: 800; color: #111; border-top: 2px solid #111; padding-top: 8px; margin-top: 6px; }
//       .rem { color: #dc2626; font-weight: 700; }
//       .badge { display: inline-block; padding: 2px 8px; border-radius: 99px; font-size: 10px; font-weight: 700; text-transform: uppercase; }
//       .paid { background: #dcfce7; color: #166534; }
//       .pending { background: #fef9c3; color: #854d0e; }
//       .partial { background: #dbeafe; color: #1e40af; }
//       .footer { margin-top: 40px; font-size: 10px; color: #9ca3af; border-top: 1px solid #f3f4f6; padding-top: 15px; text-align: center; }
//       @media print {
//         body { padding: 1cm; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
//         @page { margin: 0; }
//       }
//     </style></head><body>
//     <div class="header">
//         <div>
//             <div class="logo-box">
//                 <img src="/logo.png" class="logo-img" onerror="this.style.display='none'"/>
//                 <span class="company-name">ITFixer</span>
//             </div>
//             <div style="margin-top: 10px; font-size: 11px; color: #4b5563; line-height: 1.5;">
//                 No.91, Ground Floor, Kothari Nagar 2nd Main Road,<br/>
//                 Ramapuram, Chennai - 600089<br/>
//                 Phone: 9385939985<br/>
//                 Email: info@itfixer199.com
//             </div>
//         </div>
//     </div>

//     <div class="meta">
//       <div>
//         <div class="ml">Customer</div>
//         <div class="mv">${customerName || 'Walk-in Customer'}</div>
//         <div class="mv" style="font-size:11px; color:#6b7280; font-weight:400;">${customerEmail || ''} ${customerNumber ? (customerEmail ? ' • ' : '') + customerNumber : ''}</div>
//         ${address ? `<div class="mv" style="font-size:11px; color:#6b7280; font-weight:400; margin-top:4px;">${address}</div>` : ''}
//       </div>
//       <div><div class="ml">Issue Date</div><div class="mv">${invDate}</div></div>
//       <div><div class="ml">Payment Method</div><div class="mv">${paymentType?.label || 'Cash'}</div></div>
//     </div>

//     <table>
//       <thead><tr><th>Items & Services</th><th style="text-align:center">Qty</th><th style="text-align:right">Price</th><th style="text-align:right">Subtotal</th></tr></thead>
//       <tbody>
//         ${(items || []).map(i => `
//           <tr>
//             <td>
//                 <div style="font-weight:600">${i.name || 'Untitled Item'}</div>
//                 ${i.serial_numbers?.length ? `<div style="font-size:9px; color:#6b7280; margin-top:2px">S/N: ${i.serial_numbers.join(', ')}</div>` : ''}
//             </td>
//             <td style="text-align:center">${i.qty || 1}</td>
//             <td style="text-align:right">₹${Number(i.price || 0)?.toFixed(2)}</td>
//             <td style="text-align:right; font-weight:600">₹${(Number(i.qty || 1) * Number(i.price || 0))?.toFixed(2)}</td>
//           </tr>
//         `).join('')}
//       </tbody>
//     </table>

//     <div class="totals">
//       <div class="row"><span>Subtotal</span><span>₹${Number(subtotal || 0)?.toFixed(2)}</span></div>
//       <div class="row"><span>CGST/SGST (incl.)</span><span>₹${Number(taxAmount || 0)?.toFixed(2)}</span></div>
//       <div class="row tot"><span>Total Amount</span><span>₹${Number(total || 0)?.toFixed(2)}</span></div>
//       <div class="row" style="margin-top: 8px;"><span>Amount Paid</span><span style="font-weight:600; color:#059669">₹${Number(amountPaid || 0)?.toFixed(2)}</span></div>
//       ${remaining > 0 ? `<div class="row rem"><span>Balance Due</span><span>₹${remaining?.toFixed(2)}</span></div>` : ''}
//     </div>

//     ${notes ? `<div style="margin-top:30px; font-size:12px; color:#4b5563; border-left: 3px solid #e5e7eb; padding-left: 12px;"><b>Notes:</b><br/>${notes}</div>` : ''}

//     <div class="footer">
//         Thank you for choosing ITFixer!<br/>
//         © ${new Date().getFullYear()} ITFixer. All Rights Reserved.
//     </div>
//     </body></html>`;

//     // Create a hidden iframe
//     const iframe = document.createElement('iframe');
//     iframe.style.position = 'fixed';
//     iframe.style.right = '0';
//     iframe.style.bottom = '0';
//     iframe.style.width = '0';
//     iframe.style.height = '0';
//     iframe.style.border = '0';
//     document.body.appendChild(iframe);

//     const doc = iframe.contentWindow.document;
//     doc.open();
//     doc.write(html);
//     doc.close();

//     // Trigger print
//     iframe.contentWindow.focus();
//     setTimeout(() => {
//         iframe.contentWindow.print();
//         setTimeout(() => {
//             document.body.removeChild(iframe);
//         }, 1000);
//     }, 500);
// }

// /* ─── Preview Modal ─── */
// function PreviewModal({ open, onClose, data, onPrint }) {
//     if (!open) return null;
//     const { customerName, customerEmail, customerNumber, invoiceNo, issueDate, items, subtotal, taxAmount, total, notes, paymentType, paymentStatus, amountPaid } = data;
//     const remaining = Math.max(0, total - amountPaid);
//     return (
//         <div className="modal-overlay" onClick={onClose}>
//             <div className="modal-box" onClick={e => e.stopPropagation()}>
//                 <div className="modal-header">
//                     <div><div className="fw-600" style={{ fontSize: 16 }}>Invoice Preview</div><div className="txt-xs txt-light">Review before saving or printing</div></div>
//                     <button className="modal-close" onClick={onClose}>✕</button>
//                 </div>
//                 <div className="modal-body">
//                     <div className="preview-brand">
//                         <div className="preview-logo" style={{ background: 'transparent' }}>
//                             <img src="/logo.png" alt="ITFixer" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
//                         </div>
//                         <div>
//                             <div className="fw-600" style={{ fontSize: 15 }}>ITFixer</div>
//                             <div className="txt-xs txt-light">Professional Billing System</div>
//                         </div>
//                     </div>
//                     <div className="preview-meta">
//                         <div><div className="inv-label">CUSTOMER</div><div className="fw-600">{customerName || '—'}</div><div className="txt-xs txt-light">{customerEmail} {customerNumber && `• ${customerNumber}`}</div></div>
//                         <div><div className="inv-label">INVOICE NO.</div><div className="fw-600">{invoiceNo}</div></div>
//                         <div><div className="inv-label">ISSUE DATE</div><div className="fw-600">{issueDate}</div></div>
//                         <div><div className="inv-label">PAYMENT METHOD</div><div className="fw-600">{paymentType ? `${paymentType.icon} ${paymentType.label}` : '—'}</div></div>
//                     </div>
//                     <table className="preview-table">
//                         <thead><tr><th>Item</th><th>Qty</th><th>Price</th><th>Tax</th><th>Subtotal</th></tr></thead>
//                         <tbody>{items.map(i => (
//                             <tr key={i.id}><td>{i.name || '—'}</td><td>{i.qty}</td><td>₹{Number(i.price || 0).toFixed(2)}</td><td>0%</td><td className="fw-600">₹{(Number(i.qty || 0) * Number(i.price || 0)).toFixed(2)}</td></tr>
//                         ))}</tbody>
//                     </table>
//                     <div className="preview-totals">
//                         <div className="preview-total-row"><span>Subtotal</span><span>₹{Number(subtotal || 0).toFixed(2)}</span></div>
//                         {/* <div className="preview-total-row"><span>Tax (8.5%)</span><span>₹{Number(taxAmount || 0).toFixed(2)}</span></div> */}
//                         <div className="preview-total-row preview-grand-total"><span>TOTAL</span><span>₹{Number(total || 0).toFixed(2)}</span></div>
//                         <div className="preview-total-row"><span>Amount Paid</span><span className="txt-success fw-600">₹{Number(amountPaid || 0).toFixed(2)}</span></div>
//                         {remaining > 0 && <div className="preview-total-row"><span>Balance Remaining</span><span className="txt-danger fw-600">₹{Number(remaining || 0).toFixed(2)}</span></div>}
//                     </div>
//                     {notes && <div className="preview-notes"><b>Note:</b> {notes}</div>}
//                 </div>
//                 <div className="modal-footer">
//                     <button className="btn btn-outline" onClick={onClose}>Close</button>
//                     <button className="btn btn-outline" onClick={() => printInvoice(data)}>🖨 Print</button>
//                     <button className="btn btn-primary" onClick={onClose}>✓ Save Invoice</button>
//                 </div>
//             </div>
//         </div>
//     );
// }
const printInvoice = (orderData, invoiceNumber) => {
    const { customerName, customerNumber, customerGst, invoiceNo, issueDate, items, customerAddress = [] } = orderData;

    // Logic and Calculations
    const totalQty = items.reduce((acc, curr) => acc + parseInt(curr?.qty || 0), 0);
    const totalDiscount = items.reduce((acc, curr) => acc + (parseFloat(curr?.discount || 0)), 0);

    const netAmount = items.reduce((acc, item) => {
        const qty = parseFloat(item?.qty || 0);
        const price = parseFloat(item?.price || 0);
        const disc = parseFloat(item?.discount || 0);
        return acc + (qty * price - disc);
    }, 0);

    const taxableValue = netAmount / 1.18;
    const totalGst = netAmount - taxableValue;
    const cgst_sgst = totalGst / 2;

    const itemsCount = items.length;
    const emptyRowsNeeded = Math.max(0, 15 - itemsCount); // Kept the 15 rows logic from first code

    const numberToWords = (num) => {
        const a = ['', 'One ', 'Two ', 'Three ', 'Four ', 'Five ', 'Six ', 'Seven ', 'Eight ', 'Nine ', 'Ten ', 'Eleven ', 'Twelve ', 'Thirteen ', 'Fourteen ', 'Fifteen ', 'Sixteen ', 'Seventeen ', 'Eighteen ', 'Nineteen '];
        const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
        if ((num = num.toString()).length > 9) return 'overflow';
        let n = ('000000000' + num).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
        if (!n) return '';
        let str = '';
        str += (Number(n[1]) !== 0) ? (a[Number(n[1])] || b[n[1][0]] + ' ' + a[n[1][1]]) + 'Crore ' : '';
        str += (Number(n[2]) !== 0) ? (a[Number(n[2])] || b[n[2][0]] + ' ' + a[n[2][1]]) + 'Lakh ' : '';
        str += (Number(n[3]) !== 0) ? (a[Number(n[3])] || b[n[3][0]] + ' ' + a[n[3][1]]) + 'Thousand ' : '';
        str += (Number(n[4]) !== 0) ? (a[Number(n[4])] || b[n[4][0]] + ' ' + a[n[4][1]]) + 'Hundred ' : '';
        str += (Number(n[5]) !== 0) ? ((str !== '') ? 'and ' : '') + (a[Number(n[5])] || b[n[5][0]] + ' ' + a[n[5][1]]) + 'Rs. Only' : '';
        return str;
    };
    // ${item?.serial_numbers ? item.serial_numbers.map(serial => `<br/>SN: ${serial}`).join('') : ''}.


    const html = `
    <html>
    <head>
      <title>Invoice - ITFIXER@199</title>
      <style>
        @page { size: A4; margin: 0; padding: 0; }

body {
  font-family: 'Segoe UI', sans-serif;
  margin: 0;
  padding: 10mm;
  background: #fff;
}

.main-container {
  border: 1px solid #000;
  width: 190mm;
  height: 277mm;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}

/* HEADER */
.top-header {
  border-bottom: 1px solid #000;
  text-align: center;
  padding: 10px;
}

.company-info h1 {
  margin: 0;
  font-size: 22px;
  font-weight: bold;
}

.company-info p {
  font-size: 10px;
  margin: 2px 0;
}

/* BILL DETAILS */
.bill-details {
  display: grid;
  grid-template-columns: 1.6fr 1fr;
  border-bottom: 1px solid #000;
}

.to-section {
  padding: 10px;
  border-right: 1px solid #000;
  font-size: 11px;
}

.no-section table {
  width: 100%;
  border-collapse: collapse;
}

.no-section td {
  padding: 6.5px;
    font-size: 11px;
     font-weight: bold;
}

/* TABLE */
.items-container {
  flex: 1;
  border-bottom: 1px solid #000;
}

.bill-table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
  height: 100%;
}

.bill-table th,
.bill-table td {
  border: 1px solid #000;   /* 🔥 SAME BORDER EVERYWHERE */
  padding: 6.5px;
  font-size: 11px;
}

.bill-table th {
  text-align: center;
  font-weight: bold;
}

.text-center { text-align: center; }
.text-right { text-align: right; }

/* TOTAL ROW */
.total-row td {
  font-weight: bold;
}

/* SUMMARY */
.summary-section {
  display: grid;
  grid-template-columns: 1.5fr 1fr;
  border-bottom: 1px solid #000;
}

.summary-left {
  padding: 10px;
  font-size: 11px;
}

.summary-right table {
  width: 96%;
  border-collapse: collapse;
  margin-left:10px;
}

.summary-right td {
  border: 1px solid #000;
  padding: 6px;
}

/* GST TABLE */
.gst-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 5px;
}

.gst-table th,
.gst-table td {
  border: 1px solid #000;
  padding: 5px;
  text-align: center;
}

/* SIGNATURE */
.signature-section {
  display: flex;
  justify-content: space-between;
  padding: 15px;
}

.sig-box {
  border-top: 1px solid #000;
  width: 200px;
  text-align: center;
  font-size: 10px;
  padding-top: 5px;
}
      </style>
    </head>
    <body>
      <div class="main-container">
        <div class="top-header">
         <div class="company-info">
            <h1>FTDS INDIA PRIVATE LIMITED</h1>
            <p>  No.91, Ground Floor,  Kothari Nagar 2nd Main Road<br/>
               Ramapuram, Chennai - 600089 <br/>
                PH: 9385939985 <br/>
                GST: 33AAGCF5828A1Z0
                </p>
          </div>
        </div>

        <div class="bill-details">
          <div class="to-section">
            <b>To:</b><br/>
            ${customerName?.toUpperCase()} <br/>
            ${customerAddress?.toUpperCase()} <br/>
 ${customerGst ? `
    GST: ${customerGst}` : ''}<br/>
    ${customerNumber ? `
    PHN: ${customerNumber}` : ''}<br/>
          </div>
          <div class="no-section">
            <table>
              <tr><td>Bill No</td><td>: ${invoiceNumber || 'N/A'}</td></tr>
              <tr><td>Date</td><td>: ${issueDate || new Date().toLocaleDateString('en-GB')}</td></tr>
            </table>
          </div>
        </div>

        <div class="items-container">
          <table class="bill-table">
            <thead>
              <tr>
                <th width="40">S.NO</th>
                <th>DESCRIPTION</th>
                <th width="60">HSN</th>
                <th width="40">QTY</th>
                <th width="80">RATE</th>
                <th width="70">CGST@9%</th>
                <th width="70">SGST@9%</th>
                <th width="90">AMOUNT</th>
              </tr>
            </thead>
            <tbody>
              ${items.map((item, index) => {
        const qty = parseFloat(item?.qty || 0);
        const rate = parseFloat(item?.price || 0);
        const itemGross = qty * rate;
        const itemTaxable = itemGross / 1.18;
        const itemTax = (itemGross - itemTaxable) / 2;
        return `
                <tr>
                  <td class="text-center">${index + 1}</td>
                  <td>
  <b>
    ${item?.name || 'Product'}.
    <br/>
     ${item?.warranty_duration && `<span style="font-weight: normal; font-size: 9px;">Warranty: ${item.warranty_duration}</span>`}
  </b>
</td>
                  <td class="text-center">${item?.hsn || ''}</td>
                  <td class="text-center">${qty}</td>
                  <td class="text-right">${itemTaxable.toFixed(2)}</td>
                  <td class="text-right">${itemTax.toFixed(2)}</td>
                  <td class="text-right">${itemTax.toFixed(2)}</td>
                  <td class="text-right">${rate.toFixed(2)}</td>
                </tr>`
    }).join("")}
              
              ${Array(emptyRowsNeeded).fill(0).map(() => `<tr><td>&nbsp;</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>`).join("")}

              <tr class="total-row">
                <td colspan="3" class="text-center">Tot.Qty: ${totalQty}</td>
                <td colspan="2" class="text-center">Gross Amount</td>
                <td class="text-right">${cgst_sgst.toFixed(2)}</td>
                <td class="text-right">${cgst_sgst.toFixed(2)}</td>
                <td class="text-right">${netAmount.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="summary-section">
          <div class="summary-left">
            <b>Amount In Words:</b><br/>
            ${numberToWords(Math.round(netAmount))}<br/>

              <b>Tearms & Conditions:</b><br/>
         1. Payments Should be made via Bank Transfer/Cheque with credit period of 60 days
from the date of shipment.<br/>
2. Ownership of the equipment transfers to the buyer.<br/>
3. Risk of loss or damage to the equipment passes to the buyer upon delivery.<br/>
4. Warranty must be claimed from the authorized service centre only.<br/>
5.Goods once sold, will not be taken back.
          </div>
          <div class="summary-right">
            <table>
              <tr><td>Discount</td><td class="text-right">${totalDiscount.toFixed(2)}</td></tr>
              <tr><td>GST Amount</td><td class="text-right">${totalGst.toFixed(2)}</td></tr>
              <tr><td>Round Off</td><td class="text-right">0.00</td></tr>
              <tr style="font-weight: bold; font-size: 13px; background: #eee;">
                <td>Net Amount</td><td class="text-right">₹ ${netAmount.toFixed(2)}</td>
              </tr>
            </table>
            <table class="gst-table">
              <tr><th>GST %</th><th>GST Amt</th><th>Goods Value</th></tr>
              <tr><td>18%</td><td>${totalGst.toFixed(2)}</td><td>${taxableValue.toFixed(2)}</td></tr>
            </table>
          </div>
        </div>

        <div class="signature-section">
           <div style="text-align: right;">
            <div style="font-weight: bold; font-size: 12px; margin-bottom: 55px;"></div>
            <div class="sig-box" style="margin-left: auto; ">Customer Signature</div>
          </div>

          <div style="text-align: right;">
            <div style="font-weight: bold; font-size: 12px; margin-bottom: 45px;">For FTDS INDIA PRIVATE LIMITED</div>
            <div class="sig-box" style="margin-left: auto; ">Authorised Signatory</div>
          </div>
        </div>
      </div>
    </body>
    </html>`;

    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    document.body.appendChild(iframe);
    const doc = iframe.contentWindow.document;
    doc.open();
    doc.write(html);
    doc.close();
    setTimeout(() => {
        iframe.contentWindow.print();
        document.body.removeChild(iframe);
    }, 500);
};


/* ─── Sigmah Style Preview Modal (Clean Version) ─── */
function PreviewModal({ open, onClose, data, resetForm, poData }) {
    console.log(data)
    if (!open) return null;

    const {
        customerName, customerNumber, customerGst,
        invoiceNo, issueDate, items, customerAddress
    } = data;

    const handlePrint = () => {
        window.print();
    };

    // --- UPDATED LOGIC START ---
    const totalQty = items?.reduce((acc, curr) => acc + Number(curr.qty), 0);

    // 1. Total Discount calculation
    const totalDiscount = items?.reduce((acc, item) => acc + (Number(item.discount) || 0), 0);

    // 2. Net Amount (Gross total minus Total Discount)
    const netAmount = items?.reduce((acc, item) => {
        const itemTotal = (item.qty * item.price) - (Number(item.discount) || 0);
        return acc + itemTotal;
    }, 0);

    // 3. GST Calculations based on the discounted Net Amount
    const taxableValue = netAmount / 1.18;
    const totalGst = netAmount - taxableValue;
    const cgst_sgst = totalGst / 2;
    // --- UPDATED LOGIC END ---
    const netAmountWithOutGst = items.reduce((acc, item) => {
        const gross = item.qty * item.price;
        const taxable = gross / 1.18;
        return acc + taxable;
    }, 0);


    return (
        <div className="modal-overlay" style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
            <style>
                {`
                @media print {
                    @page { size: A4; margin: 5mm; }
                    body { margin: 0; padding: 0; background: #fff; }
                    .no-print { display: none !important; }
                    #printable-area { width: 100%; margin: 0; padding: 0; }
                    /* Fixed: Height auto panni, overflow hidden kudutha rendu page varathu */
                   .main-container { 
  border: 2px solid #000 !important; 
  height: 287mm !important;   /* exact A4 height (margin adjust pannitu) */
  overflow: hidden !important;
  page-break-inside: avoid !important;
}
                }
                /* Fixed: Table width issues */
                .bill-table { width: 100%; border-collapse: collapse; table-layout: fixed; }
                .bill-table th, .bill-table td { 
                    border-right: 1.5px solid #000; 
                    padding: 6px; 
                    font-size: 11px; 
                    word-wrap: break-word;
                }
                .bill-table th { border-bottom: 1.5px solid #000; background: #e2e8f0; font-weight: bold; }
                .item-row { height: 35px; }
                .total-row td { border-top: 2px solid #000 !important; border-bottom: 2px solid #000 !important; font-weight: bold; }
                `}
            </style>

            {/* Fixed: Modal width changed to fit content without cutting */}
            <div className="modal-box" style={{ background: '#fff', width: 'fit-content', maxWidth: '95vw', height: '95vh', overflowY: 'auto', borderRadius: '4px' }}>
                <div className="no-print" style={{ padding: '10px 20px', borderBottom: '1px solid #ddd', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <b>Invoice Preview</b>
                    <button onClick={() => { resetForm(), onClose() }} style={{ fontSize: '24px', border: 'none', background: 'none', cursor: 'pointer' }}>&times;</button>
                </div>

                <div id="printable-area" style={{ padding: '20px' }}>
                    <div className="main-container" style={{ border: '2px solid #000', display: 'flex', flexDirection: 'column', boxSizing: 'border-box', width: '210mm', minHeight: '277mm', margin: '0 auto' }}>

                        {/* 1. Header with LOGO */}
                        <div style={{ display: 'flex', borderBottom: '2px solid #000' }}>
                            {/* <div style={{ flex: '0 0 160px', padding: '10px', borderRight: '2px solid #000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <div style={{ background: '#0056b3', color: '#fff', padding: '10px', fontWeight: 'bold', textAlign: 'center', borderRadius: '4px', width: '100%' }}>
                                    SIGMAH <br /> ENTERPRISES
                                    <div style={{ color: '#90ee90', fontSize: '10px' }}>IT Fixer</div>
                                </div>
                            </div> */}
                            <div style={{ flex: 1, textAlign: 'center', padding: '10px' }}>
                                <h2 style={{ margin: '0', fontSize: '24px', fontWeight: '900' }}>FTDS INDIA PRIVATE LIMITED</h2>
                                <div style={{ fontSize: '11px' }}>No.91, Ground Floor, Kothari Nagar 2nd Main Road,Ramapuram, Chennai - 600089</div>
                                <div style={{ fontSize: '11px' }}>GST No: 33AAGCF5828A1Z0 | PH: 9385939985</div>
                            </div>
                        </div>

                        {/* 2. To & Bill Details */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', borderBottom: '2px solid #000' }}>
                            <div style={{ padding: '8px', borderRight: '2px solid #000' }}>
                                {customerName && <div style={{ fontSize: '12px' }}><b>To:</b> {customerName}</div>}
                                {customerAddress && <div style={{ fontSize: '12px' }}><b>Address:</b> {customerAddress}</div>}
                                {customerNumber && <div style={{ fontSize: '12px' }}><b>PH:</b> {customerNumber}</div>}
                                {customerGst && <div style={{ fontSize: '10px' }}><b>GST:</b>{customerGst}</div>}
                            </div>
                            <div style={{ padding: '8px', fontSize: '12px' }}>
                                <div style={{ display: 'flex' }}><span>Bill No :</span> <span>{poData?.order_creation?.invoice_number}</span></div>
                                <div style={{ display: 'flex' }}><span>Date :</span> <span>{issueDate}</span></div>
                            </div>
                        </div>

                        {/* 3. Items Table */}
                        <div style={{ flex: 1 }}>
                            <table className="bill-table">
                                <thead>
                                    <tr>
                                        <th style={{ width: '40px' }}>S.NO</th>
                                        <th style={{ width: '200px' }}>DESCRIPTION</th>
                                        <th style={{ width: '80px' }}>HSN</th>
                                        <th style={{ width: '50px' }}>QTY</th>
                                        <th style={{ width: '80px' }}>RATE</th>
                                        <th style={{ width: '80px' }}>CGST @9%</th>
                                        <th style={{ width: '80px' }}>SGST @9%</th>
                                        <th style={{ width: '100px', borderRight: 'none' }}>AMOUNT</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {items.map((item, idx) => (
                                        <tr key={idx} className="item-row">
                                            <td style={{ textAlign: 'center' }}>{idx + 1}</td>
                                            <td style={{ textAlign: 'left' }}>{item.name}</td>
                                            <td style={{ textAlign: 'center' }}>{item.hsn}</td>
                                            <td style={{ textAlign: 'center' }}>{item.qty}</td>
                                            <td style={{ textAlign: 'right', borderRight: 'none' }}>{((item.qty * item.price) / 1.18).toFixed(2)}</td>
                                            <td style={{ textAlign: 'right' }}>{((item.qty * item.price * 0.18) / 2 / 1.18).toFixed(2)}</td>
                                            <td style={{ textAlign: 'right' }}>{((item.qty * item.price * 0.18) / 2 / 1.18).toFixed(2)}</td>
                                            <td style={{ textAlign: 'right' }}>{Number(item.price).toFixed(2)}</td>
                                        </tr>
                                    ))}
                                    {/* Empty rows to maintain table height */}
                                    {[...Array(Math.max(0, 15 - items.length))].map((_, i) => (
                                        <tr key={i} className="item-row">
                                            <td></td><td></td><td></td><td></td><td></td><td></td><td></td><td style={{ borderRight: 'none' }}></td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot>
                                    <tr className="total-row">
                                        <td colSpan="3" style={{ textAlign: 'right' }}>Tot.Qty</td>
                                        <td style={{ textAlign: 'center' }}>{totalQty}</td>
                                        <td style={{ textAlign: 'right' }}>Gross Amount</td>
                                        <td style={{ textAlign: 'right' }}>{cgst_sgst.toFixed(2)}</td>
                                        <td style={{ textAlign: 'right' }}>{cgst_sgst.toFixed(2)}</td>
                                        <td style={{ textAlign: 'right', borderRight: 'none' }}>{netAmount?.toFixed(2)}</td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>

                        {/* 4. Footer Calculations */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr' }}>
                            <div style={{ padding: '10px', borderRight: '2px solid #000' }}>
                                <div style={{ fontSize: '11px', marginBottom: '8px' }}><b>Amount In Words:</b> [Rupees Amount Logic]</div>
                                <div style={{ fontSize: '9px', lineHeight: '1.3' }}>
                                    <b>Terms & Conditions:</b><br />
                                    1. Payments Should be made via Bank Transfer/Cheque with credit period of 60 days
                                    from the date of shipment.<br />
                                    2. Ownership of the equipment transfers to the buyer.<br />
                                    3. Risk of loss or damage to the equipment passes to the buyer upon delivery.<br />
                                    4. Warranty must be claimed from the authorized service centre only.<br />
                                    5.Goods once sold, will not be taken back.
                                </div>
                            </div>
                            <div>
                                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px' }}>
                                    <tbody>
                                        <tr style={{ borderBottom: '1px solid #000' }}><td style={{ padding: '4px' }}>Discount</td><td style={{ textAlign: 'right', borderLeft: '1.5px solid #000', padding: '4px' }}>
                                            {totalDiscount > 0 ? `- ${totalDiscount.toFixed(2)}` : '0.00'}</td></tr>
                                        <tr style={{ borderBottom: '1px solid #000' }}><td style={{ padding: '4px' }}>GST Amount</td><td style={{ textAlign: 'right', borderLeft: '1.5px solid #000', padding: '4px' }}>{totalGst.toFixed(2)}</td></tr>
                                        <tr style={{ borderBottom: '1px solid #000' }}><td style={{ padding: '4px' }}>Round Off</td><td style={{ textAlign: 'right', borderLeft: '1.5px solid #000', padding: '4px' }}>0.00</td></tr>
                                        <tr style={{ fontWeight: 'bold', background: '#eee', borderBottom: '1.5px solid #000' }}><td style={{ padding: '4px' }}>Net Amount</td><td style={{ textAlign: 'right', borderLeft: '1.5px solid #000', padding: '4px' }}>₹{netAmount.toFixed(2)}</td></tr>
                                    </tbody>
                                </table>
                                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '9px', textAlign: 'center' }}>
                                    <tbody>
                                        <tr style={{ borderBottom: '1px solid #000' }}><td style={{ borderRight: '1px solid #000' }}>GST %</td><td style={{ borderRight: '1px solid #000' }}>GST Amt</td><td>Good Value</td></tr>
                                        <tr><td style={{ borderRight: '1px solid #000' }}>18%</td><td style={{ borderRight: '1px solid #000' }}>{totalGst.toFixed(2)}</td><td>{netAmount.toFixed(2)}</td></tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* 5. Signatures */}
                        <div style={{ padding: '40px 10px 10px 10px', borderTop: '2px solid #000' }}>
                            <div style={{ textAlign: 'right', fontSize: '11px', fontWeight: 'bold', marginBottom: '60px' }}>For FTDS INDIA PRIVATE LIMITED</div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <div style={{ width: '220px', borderTop: '1.5px solid #000', textAlign: 'center', fontSize: '10px', fontWeight: 'bold', paddingTop: '5px' }}>Customer Signature and Seal</div>
                                <div style={{ width: '220px', borderTop: '1.5px solid #000', textAlign: 'center', fontSize: '10px', fontWeight: 'bold', paddingTop: '5px' }}>Authorised Signatory</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="no-print" style={{ padding: '20px', textAlign: 'right' }}>
                    <button
                        //  onClick={handlePrint} 
                        onClick={() =>
                            // window.print()
                            printInvoice(data, poData?.order_creation?.invoice_number)
                        }
                        style={{ background: '#2563eb', color: '#fff', border: 'none', padding: '10px 30px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                        Print Invoice
                    </button>
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
        ? (parseFloat(cashGiven) - total)?.toFixed(2) : null;

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
                                <div className="pos-amount">₹{total?.toFixed(2)}</div>
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
                                    <div className="pos-partial-warn">⚠️ Partial payment — ₹{(total - parseFloat(cashGiven))?.toFixed(2)} will remain outstanding</div>
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
                                <div className="pos-amount">₹{total?.toFixed(2)}</div>
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
        service_id: '',
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
        isLoadingSerials: false,
        warranty_duration: '',
    }]);
    const [customerName, setCustomerName] = useState('');
    const [customerEmail, setCustomerEmail] = useState('');
    const [customerNumber, setCustomerNumber] = useState('');
    const [customerGst, setCustomerGst] = useState('');
    const [orderType, setOrderType] = useState('');
    const [notes, setNotes] = useState('');
    const [tags, setTags] = useState(['Q4_RECURRING', 'VIP_PRIORITY']);
    const [invoiceNo, setInvoiceNo] = useState('');
    const [issueDate, setIssueDate] = useState(new Date().toISOString().split('T')[0]);
    const [paymentType, setPaymentType] = useState(PAYMENT_TYPES[0]);
    const [paymentStatus, setPaymentStatus] = useState(PAYMENT_STATUSES[0]);
    const [amountPaid, setAmountPaid] = useState('');
    const [showPreview, setShowPreview] = useState(false);
    const [showPOS, setShowPOS] = useState(false);
    const [showManual, setShowManual] = useState(false);
    const [manualIsFallback, setManualIsFallback] = useState(false);
    const [barcodeQuery, setBarcodeQuery] = useState('');
const [customerAddress, setCustomerAddress] = useState("");

const fetchCustomerAddress = async (userId) => {
    try {
        const res = await axiosInstance.get(`${Api?.address}${userId}`);

        console.log("ADDRESS API RESPONSE :", res?.data);

        const addressList = res?.data?.data || [];

        // empty illaatha address find pannum
        const addr = addressList.find((item) => {
            return (
                item?.full_address ||
                item?.district ||
                item?.state ||
                item?.pincode ||
                item?.google_address
            );
        });

        console.log("SELECTED ADDRESS OBJECT :", addr);

        if (addr) {
            const parts = [
                addr?.full_address,
                addr?.district,
                addr?.state,
                addr?.pincode,
            ]
                .filter((part) => part && part.toString().trim() !== "")
                .map((part) => part.toString().trim());

            let displayAddress = parts.join(", ");

            // fallback
            if (!displayAddress && addr?.google_address) {
                displayAddress = addr.google_address;
            }

            console.log("FINAL ADDRESS :", displayAddress);

            setCustomerAddress(displayAddress);
        } else {
            console.log("No valid address found");
            setCustomerAddress("");
        }
    } catch (err) {
        console.error("Address fetch failed:", err);
        setCustomerAddress("");
    }
};
    const subtotal = items?.reduce((s, i) => s + i?.qty * i?.price, 0);
    // const taxAmount = items?.reduce((s, i) => s + i?.qty * i?.price * i.tax / 100, 0);
    const taxAmount = items?.reduce((s, i) => {
        const itemTotal = (i?.qty * i?.price) - (parseFloat(i?.discount) || 0);
        return s + (itemTotal * (i.tax || 0) / 100);
    }, 0);
    // const total = subtotal + taxAmount;
    const totalDiscount = items?.reduce((s, i) => s + (parseFloat(i?.discount) || 0), 0);
    const total = subtotal - totalDiscount + taxAmount;
    const paidNum = parseFloat(amountPaid) || 0;
    // const remaining = Math.max(0, total - paidNum);
    const [customers, setCustomers] = useState([]);
    const [allCategories, setAllCategories] = useState([]);
    const [allProducts, setAllProducts] = useState([]);
    const { user } = useAuth();

    const hubId = user?.hubs?.[0]?.id || user?.hub_id;
    const [poData, setPoData] = useState();
    const [loading, setLoading] = useState(false);
    const [payments, setPayments] = useState([
        { amount: "", payment_method: "CASH", transaction_id: "" }
    ]);

    // Total amount paid calculate panna intha logic use pannu
    const totalPaid = payments.reduce((sum, p) => sum + (parseFloat(p.amount) || 0), 0);
    const remaining = Math.max(0, total - totalPaid);

    const [allServices, setAllServices] = useState([]);

    const fetchServices = async () => {
        try {
            const res = await axiosInstance.get(Api.services, {
                params: {
                    page: 1,
                    size: 1000,
                    include_categories: true,
                    include_media: true,
                    include_pricing: true,
                    include_zones: true,
                    include_attributes: true
                }
            });

            setAllServices(res?.data?.services || []);

        } catch (err) {
            toast.error(extractErrorMessage(err));
        }
    };

    useEffect(() => {
        fetchCustomers("1000");
        fetchCategories();
        fetchAllProducts();
        fetchServices();
    }, []);

    // const addItem = () => { setItems(prev => [ ...prev, { ...defaultItem, id: nextId++ } ]); };


    const addItem = () =>
        setItems([...items, {
            id: nextId++,
            type: 'PRODUCT',
            category_id: '',
            product_id: '',
            service_id: '',
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
            isLoadingSerials: false,
            warranty_duration: '',
        }]);
    const applyProduct = (id, product) => setItems(items.map(i =>
        i.id === id ? { ...i, name: product.name, hsn: product.hsn, price: product.price, tax: product.tax } : i
    ));

    // const applyProduct = (id, product) => setItems(items.map(i =>
    //     i.id === id ? { ...i, name: product.name, hsn: product.hsn, price: product.price, tax: product.tax } : i
    // ));
    // const applyProduct = (id, product) => setItems(items?.map(i =>
    //     i.id === id
    //         ? {
    //             ...i,
    //             name: product.name,
    //             hsn: product.hsn,
    //             price: product.price,
    //             tax: product.tax,
    //             qty: 1
    //         }
    //         : i
    // ));
    const removeItem = (id) => setItems(items.filter(i => i.id !== id));
    const updateItem = (id, field, val) => setItems(prev => prev.map(i => i.id === id ? { ...i, [field]: val } : i));

    const resetForm = () => {
        setItems([{
            id: 1,
            type: 'PRODUCT',
            category_id: '',
            product_id: '',
            service_id: '',
            name: '',
            qty: 1,
            price: 0,
            // tax: 8.5,
            attributes: {},
            serial_numbers: [],
            discount: "", device_id: "", brand: "", hsn: "", description: "", issue_description_text: "",
            availableSerials: [],
            productsList: [],
            isLoadingProducts: false,
            isLoadingSerials: false,
            warranty_duration: '',
        }]);
        setCustomerName('');
        setCustomerEmail('');
        setCustomerNumber('');
        setCustomerGst('');
        setOrderType('');
        setNotes('');
        setInvoiceNo('');
        setPaymentType(PAYMENT_TYPES[0]);
        setAmountPaid('');
        setPaymentStatus(PAYMENT_STATUSES[0]);
    };

    const invoiceData = { customerName, customerEmail, customerNumber, customerGst, invoiceNo, issueDate, items, subtotal, taxAmount, total, notes, paymentType, paymentStatus, amountPaid: paidNum, customerAddress };

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
            const res = await axiosInstance.get(`${Api.products}?size=10000&include_attribute=true&include_pricing=true`);
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
                service_id: product.service_id || '',
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
                isLoadingSerials: false,
                warranty_duration: '',
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
        if (!orderType) {
            toast.error("Please select an Sale Type (B2C or B2B)!");
            return;
        }
        if (!items ||
            items.length === 0 ||
            items.some(i =>
                i.type === "PRODUCT"
                    ? !i.product_id
                    : !i.service_id
            )) {
            toast.error("At least one valid item is required!");
            return;
        }
        setLoading(true);

        try {
            const payload = {
                customer_name: customerName,
                customer_number: customerNumber.replace(/\D/g, ''),
                customer_email: customerEmail || "",
                customer_gst: customerGst || "",
                address: customerAddress,
                google_address: "",
                // latitude: 0,
                // longitude: 0,
                slot_id: null,
                is_instant_slot: false,
                is_otp_required: false,
                is_paid: remaining <= 0,
                payment_method: paymentType ? paymentType.id.toUpperCase() : "CASH",
                transaction_id: "",
                no_assignment: true,
                no_razorpay: true,
                order_platform: "SHOP",
                order_type: orderType,
                partial_payment_amount: remaining <= 0 ? "" : paidNum.toString(),
                user_id: null,
                hub_id: hubId,
                zone_id: user?.zone_id || null,
                is_order_completed: true,
                // Split Payments Array (Item-kulla irunthu veliya kondu vanthuten)
                payments: payments
                    .filter(p => parseFloat(p.amount) > 0)
                    .map(p => ({
                        amount: String(p.amount),
                        payment_method: p.payment_method,
                        transaction_id: p.transaction_id || ""
                    })),
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
                        // product_id: item.product_id,
                        // service_id: item.service_id || '',
                        product_id:
                            item.type === "PRODUCT"
                                ? item.product_id
                                : null,

                        service_id:
                            item.type === "SERVICE"
                                ? item.service_id
                                : null,
                        amount: String(item.price || "0"),
                        payments: payments
                            .filter(p => parseFloat(p.amount) > 0) // Zero amount irukatha filter panrom
                            .map(p => ({
                                amount: String(p.amount),
                                payment_method: p.payment_method,
                                transaction_id: p.transaction_id || ""
                            })),
                        warranty_duration: item.warranty_duration || "",
                    };
                })
            };

            const response = await axiosInstance.post(Api.publicOrder, payload);
            if (response.data) {
                setLoading(false);
                setPoData(response?.data)
                // resetForm();
                toast.success("Sale Created Successfully!");
                setShowPreview(true);
            }
        } catch (err) {
            const data = err?.response?.data;

            let errorMessage = "Something went wrong";

            if (data?.errors) {
                const getErrorWithKey = (errObj, parentKey = "") => {
                    if (Array.isArray(errObj)) {
                        return getErrorWithKey(errObj[0], parentKey);
                    }

                    if (typeof errObj === "object") {
                        const firstKey = Object.keys(errObj)[0];
                        return getErrorWithKey(errObj[firstKey], firstKey);
                    }

                    if (typeof errObj === "string") {
                        return {
                            key: parentKey,
                            message: errObj
                        };
                    }

                    return null;
                };

                const result = getErrorWithKey(data.errors);

                if (result) {
                    const formattedKey =
                        result.key.charAt(0).toUpperCase() +
                        result.key.slice(1).replace(/_/g, " ");

                    errorMessage = `${formattedKey}: ${result.message}`;
                }
            } else if (typeof data?.message === "object") {
                errorMessage = JSON.stringify(data.message);
            } else {
                errorMessage = data?.message || "Something went wrong";
            }

            toast.error(errorMessage);

            setLoading(false);
            // toast.error(err.response?.data?.message || "Failed to create sale");
            console.error("Sale creation failed:", err);
        }
    };

    const handlePaymentConfirmed = () => {
        setPaymentStatus(PAYMENT_STATUSES.find(s => s.id === (remaining <= 0 ? 'paid' : 'partial')));
        if (paidNum === 0) setAmountPaid(total?.toFixed(2));
    };

//     useEffect(() => {
//     if (selectedCustomerId) {
//         fetchCustomerAddress(selectedCustomerId);
//     }
// }, [selectedCustomerId]);

    return (
        <div className="inv">
            {/* Header */}
            <div className="inv-header">
                <div>
                    <h1 className="section-title">New Invoice</h1>
                    <p className="section-subtitle">Create a professional ledger entry for your client.</p>
                </div>
                <div className="inv-header-actions">
                    {/* <button className="btn btn-outline" onClick={() => printInvoice(invoiceData)}>Print</button>
                    <button className="btn btn-outline" onClick={() => setShowPreview(true)}>Preview</button> */}
                    <button
                        disabled={loading}
                        className="btn btn-primary d-flex align-items-center justify-content-center"
                        onClick={handleSaveAndPreview}
                    >
                        {loading ? (
                            <>
                                <span
                                    className="spinner-border spinner-border-sm me-2"
                                    role="status"
                                ></span>
                                Processing...
                            </>
                        ) : (
                            "Place Order"
                        )}
                    </button>
                </div>
            </div>

            <div className="inv-grid">
                {/* ── Left ── */}
                <div className="inv-left">
                    {/* Customer + meta */}
                    <div className="card card-pad">
                        <div className="inv-meta">
                            <CustomerSearch
                                label="CUSTOMER NUMBER *"
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
                                    if (c.id) fetchCustomerAddress(c.id);
                                }}
                            />
                            <CustomerSearch
                                label="CUSTOMER NAME *"
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
                            {/* <CustomerSearch
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
                            /> */}
                            <div className="inv-field">
                                <label className="inv-label text-danger">Sale TYPE *</label>
                                <select
                                    className="input"
                                    value={orderType}
                                    onChange={(e) => setOrderType(e.target.value)}
                                    style={{ borderColor: !orderType ? 'var(--border)' : 'var(--border)' }}
                                >
                                    <option value="">Select Sale Type</option>
                                    <option value="B2C">B2C (Business to Consumer)</option>
                                    <option value="B2B">B2B (Business to Business)</option>
                                </select>
                            </div>
                        </div>

                        <div className="inv-meta mt-4">

                            <div className="inv-field">
                                <label className="inv-label">CUSTOMER GST</label>
                                <input
                                    className="input"
                                    placeholder="Enter GST number"
                                    value={customerGst}
                                    onChange={(e) => setCustomerGst(e.target.value)}
                                />
                            </div>

                            {/* 
                            <div className="inv-field">
                                <label className="inv-label">INVOICE NUMBER</label>
                                <input className="input" placeholder="Enter invoice number" value={invoiceNo} onChange={e => setInvoiceNo(e.target.value)} />
                            </div> 
                            */}

                            <div className="inv-field">
                                <label className="inv-label">ISSUE DATE</label>
                                <input className="input" type="date" value={issueDate} onChange={e => setIssueDate(e.target.value)} />
                            </div>
                        </div>
                        <div className="inv-field full-width" style={{ gridColumn: 'span 3', marginTop: '10px' }}>
                            <label className="inv-label">CUSTOMER ADDRESS</label>
                             <textarea
        className="input"
        placeholder="Customer full address"
        value={customerAddress || ""}
        onChange={(e) => setCustomerAddress(e.target.value)}
        rows={2}
        style={{
            width: "100%",
            resize: "none"
        }}
    />
                        </div>
                        {/* <div className="inv-meta mt-4">
                            <div className="inv-field">
                                <label className="inv-label">ISSUE DATE</label>
                                <input className="input" type="date" value={issueDate} onChange={e => setIssueDate(e.target.value)} />
                            </div>
                            <div className="inv-field"></div>
                            <div className="inv-field"></div>
                        </div> */}
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

                                        <div className="col-span-2"> <label className="inv-label text-xs uppercase block mb-1"> TYPE </label> <select className="input w-full" value={item.type} onChange={(e) => { const value = e.target.value; setItems(prev => prev.map(i => i.id === item.id ? { ...i, type: value, product_id: '', service_id: '', name: '', price: 0, serial_numbers: [], attributes: {} } : i)); }} > <option value="PRODUCT"> PRODUCT </option> <option value="SERVICE"> SERVICE </option> </select> </div>

                                        <div className="col-span-4">
                                            <label className="inv-label text-xs uppercase block mb-1">
                                                {item.type === "PRODUCT" ? "PRODUCT *" : "SERVICE *"}
                                            </label>

                                            <Select
                                                className="react-select-container"
                                                classNamePrefix="react-select"
                                                placeholder={item.type === "PRODUCT" ? "Search Product..." : "Search Service..."}
                                                isSearchable={true}
                                                isClearable={true}
                                                // Value format: { value: '123', label: 'Product Name' }
                                                value={
                                                    item.type === "PRODUCT"
                                                        ? allProducts.find(p => String(p.id) === String(item.product_id))
                                                            ? { value: item.product_id, label: allProducts.find(p => String(p.id) === String(item.product_id))?.name }
                                                            : null
                                                        : allServices.find(s => String(s.id) === String(item.service_id))
                                                            ? { value: item.service_id, label: allServices.find(s => String(s.id) === String(item.service_id))?.name }
                                                            : null
                                                }
                                                // Options format map panrom
                                                options={
                                                    item.type === "PRODUCT"
                                                        ? allProducts?.map(p => ({ value: String(p.id), label: p.name }))
                                                        : allServices?.map(s => ({ value: String(s.id), label: s.name }))
                                                }
                                                onChange={(selectedOption) => {
                                                    const selectedId = selectedOption ? selectedOption.value : '';

                                                    if (item.type === "PRODUCT") {
                                                        const prod = allProducts.find(p => String(p.id) === String(selectedId));
                                                        let amount = 0;
                                                        if (prod) {
                                                            const priceObj = prod.product_pricing?.[0] || prod.pricing?.[0];
                                                            amount = Number(priceObj?.price || prod.price || prod.selling_price || 0);
                                                        }

                                                        setItems(prev => prev.map(i => i.id === item.id ? {
                                                            ...i,
                                                            product_id: selectedId,
                                                            service_id: '',
                                                            name: prod?.name || '',
                                                            price: amount,
                                                            tax: prod?.tax || 0,
                                                            brand: prod?.brand_name || prod?.brand || '',
                                                            hsn: prod?.hsn || '',
                                                            serial_numbers: [],
                                                            attributes: {}
                                                        } : i));

                                                        if (selectedId) fetchSerialsForProduct(item.id, selectedId);
                                                    }
                                                    else {
                                                        const service = allServices.find(s => String(s.id) === String(selectedId));
                                                        const pricing = service?.pricing_models?.[0];
                                                        const amount = Number(pricing?.price || 0);

                                                        setItems(prev => prev.map(i => i.id === item.id ? {
                                                            ...i,
                                                            service_id: selectedId,
                                                            product_id: '',
                                                            name: service?.name || '',
                                                            price: amount,
                                                            tax: service?.gst_percentage || 0,
                                                            hsn: service?.hsn || '',
                                                            serial_numbers: [],
                                                            attributes: {}
                                                        } : i));
                                                    }
                                                }}
                                                // Styling (Tailwind kooda match aaga)
                                                styles={{
                                                    control: (base) => ({
                                                        ...base,
                                                        minHeight: '38px',
                                                        fontSize: '14px',
                                                        borderRadius: '0.375rem',
                                                        borderColor: '#e2e8f0', // Tailwind slate-200
                                                    }),
                                                }}
                                            />
                                        </div>
                                        {/* <div className="col-span-4"> <label className="inv-label text-xs uppercase block mb-1"> {item.type === "PRODUCT" ? "PRODUCT *" : "SERVICE *"} </label> <select className="input w-full" value={item.type === "PRODUCT" ? item.product_id : item.service_id} onChange={(e) => { const selectedId = e.target.value;  if (item.type === "PRODUCT") { const prod = allProducts.find(p => String(p.id) === String(selectedId)); let amount = 0; if (prod) { const priceObj = prod.product_pricing?.[0] || prod.pricing?.[0]; if (priceObj?.price) amount = Number(priceObj.price); else if (prod.price) amount = Number(prod.price); else if (prod.selling_price) amount = Number(prod.selling_price); } setItems(prev => prev.map(i => i.id === item.id ? { ...i, product_id: selectedId, service_id: '', name: prod?.name || '', price: amount, tax: prod?.tax || 0, brand: prod?.brand_name || prod?.brand || '', hsn: prod?.hsn || '', serial_numbers: [], attributes: {} } : i)); if (selectedId) { fetchSerialsForProduct(item.id, selectedId); } }  else { const service = allServices.find(s => String(s.id) === String(selectedId)); const pricing = service?.pricing_models?.[0]; const amount = Number(pricing?.price || 0); setItems(prev => prev.map(i => i.id === item.id ? { ...i, service_id: selectedId, product_id: '', name: service?.name || '', price: amount, tax: service?.gst_percentage || 0, hsn: service?.hsn || '', serial_numbers: [], attributes: {} } : i)); } }} > <option value=""> {item.type === "PRODUCT" ? "Choose Product" : "Choose Service"} </option> {item.type === "PRODUCT" ? allProducts?.map((p) => (<option key={p.id} value={p.id} > {p.name} </option>)) : allServices?.map((s) => (<option key={s.id} value={s.id} > {s.name} </option>))} </select> </div> */}

                                        {/* <div className="col-span-4">
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
                                        </div> */}

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
                                        <div className="col-span-3">
                                            <label className="inv-label text-xs uppercase block mb-1">Warranty Duration</label>
                                            <input className="input w-full" type="text" min="0" placeholder="Warranty Duration" value={item.warranty_duration} onChange={e => updateItem(item.id, 'warranty_duration', e.target.value)} />
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
                                        {item.type === "PRODUCT" && item.product_id && (
                                            <div className="col-span-12 sn-box mt-2">
                                                <div className="sn-header" style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                                                    <label className="inv-label text-xs uppercase" style={{ margin: 0 }}>SERIAL NUMBERS *</label>
                                                    <span className={`badge ${item.serial_numbers.length === item.qty ? 'badge-green' : 'badge-orange'}`} style={{ fontSize: '10px' }}>
                                                        {item.serial_numbers.length} / {item.qty} SELECTED
                                                    </span>
                                                    {(!item.availableSerials || item.availableSerials.length === 0) && !item.isLoadingSerials && (
                                                        <span className="text-xs" style={{ color: 'var(--danger)', marginLeft: 'auto' }}>No stock found in this hub</span>
                                                    )}
                                                    {item.isLoadingSerials && <span className="text-xs text-light" style={{ marginLeft: 'auto' }}>Loading stock...</span>}
                                                </div>

                                                <div className="sn-multi-select-wrap">
                                                    <Select
                                                        isMulti
                                                        placeholder={`Select ${item.qty} serial number${item.qty > 1 ? 's' : ''}...`}
                                                        isLoading={item.isLoadingSerials}
                                                        options={(item.availableSerials || []).map(sn => ({ value: sn, label: sn }))}
                                                        value={(item.serial_numbers || []).map(sn => ({ value: sn, label: sn }))}
                                                        onChange={(selected) => {
                                                            const newValues = selected ? selected.map(o => o.value) : [];
                                                            if (newValues.length > item.qty) {
                                                                toast.error(`You have already selected ${item.qty} serial number(s). Increase quantity to add more.`);
                                                                return;
                                                            }
                                                            updateItem(item.id, 'serial_numbers', newValues);
                                                        }}
                                                        isOptionDisabled={() => (item.serial_numbers || []).length >= item.qty}
                                                        styles={{
                                                            control: (base) => ({
                                                                ...base,
                                                                borderColor: 'var(--border)',
                                                                borderRadius: 'var(--radius-sm)',
                                                                padding: '1px',
                                                                fontSize: '13.5px',
                                                                '&:hover': { borderColor: 'var(--text-xlight)' }
                                                            }),
                                                            multiValue: (base) => ({
                                                                ...base,
                                                                backgroundColor: 'var(--primary-pale)',
                                                                borderRadius: '4px',
                                                            }),
                                                            multiValueLabel: (base) => ({
                                                                ...base,
                                                                color: 'var(--primary-mid)',
                                                                fontWeight: '600'
                                                            }),
                                                            multiValueRemove: (base) => ({
                                                                ...base,
                                                                color: 'var(--primary-mid)',
                                                                '&:hover': {
                                                                    backgroundColor: 'var(--primary-mid)',
                                                                    color: 'white',
                                                                }
                                                            }),
                                                            placeholder: (base) => ({
                                                                ...base,
                                                                color: 'var(--text-xlight)'
                                                            })
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>


                    {/* Payment Type + Status */}
                    {/* <div className="card card-pad" style={{ marginTop: 14 }}>
                        <div className="inv-pay-row">
                            <div className="inv-pay-col">
                                <div className="inv-label" style={{ marginBottom: 10 }}>PAYMENT METHOD</div>
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
                         
                        </div>
                    </div> */}

                    {/* Payment Section */}
                    <div className="card card-pad mt-4" style={{ backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', padding: '20px' }}>
                        {/* Header Section */}
                        <div className="flex justify-between items-center mb-4" style={{ borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="2" /><line x1="2" y1="10" x2="22" y2="10" /></svg>
                                <h3 className="fw-600" style={{ margin: 0, fontSize: '1.1rem', color: '#2c3e50' }}>Payments</h3>
                            </div>

                        </div>

                        {/* Payment Rows */}
                        {payments.map((pay, idx) => (
                            <div key={idx} className="payment-row mb-3 p-3" style={{ background: '#fcfcfc', border: '1px solid #edf2f7', borderRadius: '10px' }}>
                                <div className="grid grid-cols-12 gap-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '12px' }}>

                                    {/* Method Selector with Icon logic */}
                                    <div className="col-span-5" style={{ gridColumn: 'span 5', marginTop: "5px", marginBottom: '5px' }}>
                                        <label className="inv-label text-xs" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#718096', fontSize: '11px', textTransform: 'uppercase' }}>Method</label>
                                        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                                            <span style={{ position: 'absolute', left: '10px', pointerEvents: 'none' }}>
                                                {pay.payment_method === 'CASH' && <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#27ae60" strokeWidth="2"><rect x="2" y="6" width="20" height="12" rx="2" /><circle cx="12" cy="12" r="2" /></svg>}
                                                {pay.payment_method === 'UPI' && <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8e44ad" strokeWidth="2"><path d="M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM17 17l3 3M20 17l-3 3" /></svg>}
                                                {pay.payment_method === 'CARD' && <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2980b9" strokeWidth="2"><rect x="1" y="4" width="22" height="16" rx="2" /><line x1="1" y1="10" x2="23" y2="10" /></svg>}
                                            </span>
                                            <select
                                                className="input w-full"
                                                style={{ paddingLeft: '32px', height: '38px', borderRadius: '6px', border: '1px solid #cbd5e0', width: '100%' }}
                                                value={pay.payment_method}
                                                onChange={(e) => {
                                                    const newPays = [...payments];
                                                    newPays[idx].payment_method = e.target.value;
                                                    setPayments(newPays);
                                                }}
                                            >
                                                <option value="CASH">💵 Cash</option>
                                                <option value="UPI">📱 UPI / Scanner</option>
                                                <option value="CARD">💳 Card</option>
                                                <option value="CREDIT_CARD">💳 Credit Card</option>
                                                <option value="CREDIT_SALE">📝 Credit Sale</option>
                                            </select>
                                        </div>
                                    </div>

                                    {/* Amount Input */}
                                    <div className="col-span-5" style={{ gridColumn: 'span 5' }}>
                                        <label className="inv-label text-xs" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#718096', fontSize: '11px', textTransform: 'uppercase' }}>Amount</label>
                                        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                                            <span style={{ position: 'absolute', left: '10px', color: '#a0aec0', fontWeight: '600' }}>₹</span>
                                            <input
                                                type="number"
                                                className="input w-full"
                                                style={{ paddingLeft: '25px', height: '38px', borderRadius: '6px', border: '1px solid #cbd5e0', width: '100%', fontWeight: '600' }}
                                                placeholder="0.00"
                                                value={pay.amount}
                                                onChange={(e) => {
                                                    const newPays = [...payments];
                                                    newPays[idx].amount = e.target.value;
                                                    setPayments(newPays);
                                                }}
                                            />
                                        </div>
                                    </div>

                                    {/* Delete Button */}
                                    <div className="col-span-2 flex items-end" style={{ gridColumn: 'span 2', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
                                        {payments.length > 1 && (
                                            <button
                                                className="text-danger"
                                                style={{ background: '#fff5f5', border: '1px solid #feb2b2', color: '#e53e3e', borderRadius: '6px', padding: '7px 10px', cursor: 'pointer' }}
                                                onClick={() => setPayments(payments.filter((_, i) => i !== idx))}
                                            >
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>
                                            </button>
                                        )}
                                    </div>

                                    {/* Transaction ID */}
                                    {pay.payment_method !== 'CASH' && pay.payment_method !== 'CREDIT_SALE' && (
                                        <div className="col-span-12 mt-1" style={{ gridColumn: 'span 12' }}>
                                            <input
                                                className="input w-full"
                                                style={{ height: '34px', fontSize: '13px', borderRadius: '6px', border: '1px solid #cbd5e0', width: '100%', padding: '0 10px', background: '#fff' }}
                                                placeholder="Enter Transaction ID (Optional)"
                                                value={pay.transaction_id}
                                                onChange={(e) => {
                                                    const newPays = [...payments];
                                                    newPays[idx].transaction_id = e.target.value;
                                                    setPayments(newPays);
                                                }}
                                            />
                                        </div>
                                    )}
                                </div>

                            </div>
                        ))}
                        {/* Parent container-la flex kudutha thaan marginLeft auto work aagum */}
                        <div style={{ display: 'flex', width: '100%' }}>
                            <button
                                className="btn btn-sm"
                                style={{
                                    backgroundColor: '#f0f7ff',
                                    color: '#007bff',
                                    border: '1px solid #007bff',
                                    borderRadius: '6px',
                                    padding: '5px 12px',
                                    cursor: 'pointer',
                                    fontWeight: '600',
                                    display: "flex",
                                    alignItems: "center",
                                    marginLeft: "auto", // Right side push pannum
                                    margin: "5px"
                                }}
                                onClick={() => setPayments([...payments, { amount: "", payment_method: "CASH", transaction_id: "" }])}
                            >
                                + Split Payment
                            </button>
                        </div>
                        {/* Summary Footer */}
                        <div className="mt-4 pt-3" style={{ borderTop: '2px dashed #edf2f7' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                                <span style={{ color: '#718096', fontSize: '0.9rem' }}>Total Paid:</span>
                                <span style={{ fontWeight: '700', color: '#2d3748' }}>₹{totalPaid.toFixed(2)}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: '#e53e3e', fontSize: '0.9rem', fontWeight: '500' }}>Balance Remaining:</span>
                                <span style={{ fontWeight: '700', color: '#e53e3e' }}>₹{remaining.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>

                </div>

                {/* ── Right Summary ── */}
                <div className="inv-right">
                    <div className="card card-pad">
                        <div className="inv-sum-title">
                            📋 Invoice Summary
                            {/* {paymentStatus && <span className={`inv-ps-badge ${paymentStatus.cls}`}>{paymentStatus.label}</span>} */}
                        </div>
                        <div className="inv-sum-rows">
                            <div className="inv-sum-row"><span>Subtotal</span><span>₹{subtotal?.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span></div>
                            {/* <div className="inv-sum-row"><span>Tax (8.5%)</span><span>₹{taxAmount?.toFixed(2)}</span></div> */}
                        </div>
                        {totalDiscount > 0 && (
                            <div className="summary-row" style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', color: 'red' }}>
                                <span>Discount</span>
                                <span>- ₹{totalDiscount.toFixed(2)}</span>
                            </div>
                        )}
                        <div className="inv-sum-total">
                            <span>TOTAL AMOUNT</span>
                            <span>₹{total.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                        </div>

                        {/* Paid / Remaining mini summary */}
                        <div className="inv-paid-summary">
                            <div className="inv-paid-row">
                                <span className="txt-xs txt-light">Amount Paid</span>
                                <span className="fw-600 txt-success">₹{totalPaid?.toFixed(2)}</span>
                            </div>
                            <div className="inv-paid-row">
                                <span className="txt-xs txt-light">Remaining</span>
                                <span className={`fw-600 ${remaining > 0 ? 'txt-danger' : 'txt-success'}`}>
                                    {remaining > 0 ? `₹${remaining?.toFixed(2)}` : 'Settled ✓'}
                                </span>
                            </div>
                        </div>

                        {/* {paymentType && (
                            <div className="inv-pay-selected">{paymentType.icon} <span className="fw-600">{paymentType.label}</span><span className="txt-xs txt-light" style={{ marginLeft: 6 }}>selected</span></div>
                        )} */}

                        {/* <div className="inv-compliance">
                            <span className="dot dot-green"></span>
                            <div>
                                <div className="fw-600" style={{ fontSize: '12px' }}>COMPLIANCE VERIFIED</div>
                                <div className="txt-xs txt-light" style={{ marginTop: '2px' }}>Standard Financial Ledger protocols v4.2</div>
                            </div>
                        </div> */}

                        {/* Checkout buttons */}
                        <div className="inv-checkout-btns">
                            {/* <button className="inv-pos-btn" onClick={handleCheckout}>
                                {paymentType?.usePOS === false ? '💵 Record Cash Payment' : '⚡ Confirm via POS Terminal'}
                            </button> */}
                            {/* <button className="inv-manual-btn" onClick={() => { setManualIsFallback(true); setShowManual(true); }}>
                                🖐 Manual Confirmation
                            </button> */}
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
            <PreviewModal
                open={showPreview}
                onClose={() => {
                    setShowPreview(false);
                    // resetForm();
                    toast.info("Form cleared for new order");
                }}
                data={invoiceData}
                poData={poData}
                resetForm={resetForm}
            />
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
