import React, { useEffect, useState } from 'react';
import './OrderPreviewModal.css';
import axiosInstance from '../configs/axios-middleware';
import Api from "../api-endpoints/ApiUrls";

/**
 * Shared Professional Invoice Preview Modal
 * Upgraded to fetch full details by ID for accurate billing records.
 */

const printInvoice = (data) => {
    const { customerName, customerEmail, customerNumber, invoiceNo, issueDate, items, subtotal, total, notes, paymentStatus, amountPaid, balanceAmount, orderStatus } = data;

    const html = `
    <html><head><title>Invoice ${invoiceNo}</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap" rel="stylesheet">
    <style>
      body { font-family: 'Inter', sans-serif; color: #1f2937; padding: 40px; margin: 0; line-height: 1.5; }
      .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 40px; }
      .company-details { font-size: 12px; color: #4b5563; line-height: 1.6; margin-top: 12px; }
      .title { font-size: 32px; font-weight: 800; color: #111827; margin: 0; text-align: right; }
      .meta { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-bottom: 40px; }
      .ml { color: #6b7280; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 6px; }
      .mv { font-size: 14px; font-weight: 600; color: #111827; }
      table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
      th { text-align: left; background: #f9fafb; padding: 12px; font-size: 11px; font-weight: 700; color: #4b5563; text-transform: uppercase; border-bottom: 2px solid #e5e7eb; }
      td { padding: 14px 12px; border-bottom: 1px solid #f3f4f6; font-size: 14px; vertical-align: top; }
      .totals { margin-left: auto; width: 280px; }
      .row { display: flex; justify-content: space-between; padding: 8px 0; font-size: 14px; }
      .tot { font-size: 20px; font-weight: 800; color: #2563eb; border-top: 2px solid #f3f4f6; margin-top: 10px; padding-top: 10px; }
      .rem { color: #dc2626; font-weight: 700; }
      .footer { margin-top: 60px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center; font-size: 12px; color: #9ca3af; }
    </style>
    </head><body>
    <div class="header">
      <div>
        <div style="display: flex; align-items: center; gap: 10px;">
            <img src="/logo.png" alt="ITFixer Logo" onerror="this.style.display='none'" style="height: 32px; width: auto; object-fit: contain;" />
            <span style="font-size: 24px; font-weight: 800; color: #111827; letter-spacing: -0.5px;">ITFixer</span>
        </div>
        <div class="company-details">
            No.91, Ground Floor, Kothari Nagar 2nd Main Road,<br/>
            Ramapuram, Chennai - 600089<br/>
            Phone: 9385939985<br/>
            Email: info@itfixer199.com
        </div>
      </div>
      <h1 class="title">INVOICE</h1>
    </div>
    <div class="meta">
      <div>
        <div class="ml">Bill To</div>
        <div class="mv" style="font-size:18px; margin-bottom:2px">${customerName || '—'}</div>
        <div class="mv">${customerNumber || ''}</div>
        <div class="mv">${customerEmail || ''}</div>
      </div>
      <div style="text-align:right">
        <div class="ml">Invoice Details</div>
        <div class="mv">#${invoiceNo || 'DRAFT'}</div>
        <div class="mv">Date: ${issueDate}</div>
        <div class="ml" style="margin-top:15px">Order Status</div>
        <div class="mv">${orderStatus || 'N/A'}</div>
      </div>
    </div>
    <table>
      <thead><tr><th>Items & Services</th><th style="text-align:center">Qty</th><th style="text-align:right">Price</th><th style="text-align:right">Subtotal</th></tr></thead>
      <tbody>
        ${(items || []).map(i => `
          <tr>
            <td>
                <div style="font-weight:600">${i.name || i.description || 'Product Item'}</div>
                ${i.serial_numbers?.length ? `<div style="font-size:10px; color:#6b7280; margin-top:3px">S/N: ${i.serial_numbers.join(', ')}</div>` : ''}
            </td>
            <td style="text-align:center">${i.qty || i.quantity || 1}</td>
            <td style="text-align:right">₹${Number(i.price || i.amount || 0).toFixed(2)}</td>
            <td style="text-align:right; font-weight:600">₹${(Number(i.qty || i.quantity || 1) * Number(i.price || i.amount || 0)).toFixed(2)}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
    <div class="totals">
      <div class="row"><span>Subtotal</span><span>₹${Number(subtotal || 0).toFixed(2)}</span></div>
      <div class="row tot"><span>Total Amount</span><span>₹${Number(total || 0).toFixed(2)}</span></div>
      <div class="row" style="margin-top: 8px;"><span>Amount Paid</span><span style="font-weight:600; color:#059669">₹${Number(amountPaid || 0).toFixed(2)}</span></div>
      ${balanceAmount > 0 ? `<div class="row rem"><span>Balance Due</span><span>₹${Number(balanceAmount).toFixed(2)}</span></div>` : ''}
    </div>
     <div class="footer">
        Thank you for choosing ITFixer!<br/>
        © ${new Date().getFullYear()} ITFixer. All Rights Reserved.
    </div>
    </body></html>`;

    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = '0';
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow.document;
    doc.open();
    doc.write(html);
    doc.close();

    iframe.contentWindow.focus();
    setTimeout(() => {
        iframe.contentWindow.print();
        setTimeout(() => {
            document.body.removeChild(iframe);
        }, 1000);
    }, 500);
};

// const OrderPreviewModal = ({ open, onClose, orderId }) => {
//     const [data, setData] = useState(null);
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState(null);

//     useEffect(() => {
//         if (open && orderId) {
//             fetchOrderDetails();
//         } else {
//             setData(null);
//             setError(null);
//         }
//     }, [open, orderId]);

//     const fetchOrderDetails = async () => {
//         setLoading(true);
//         setError(null);
//         try {
//             const res = await axiosInstance.get(`${Api.singleOrder}${orderId}`);
//             const o = res.data?.order; // Access the nested order object

//             if (!o) throw new Error("Order not found");

//             // Mapping items based on the actual nesting: items -> item_details -> name
//             const mappedItems = (o.items || []).map(i => ({
//                 name: i.item_details?.name || i.name || 'Product',
//                 qty: i.quantity || 1,
//                 price: Number(i.selling_price || i.price || 0),
//                 serial_numbers: i.serial_number ? [i.serial_number] : []
//             }));

//             const total = Number(o.total_price || 0);
//             const paid = Number(o.total_paid || 0);
//             const balance = Number(o.amount_to_be_paid || 0);

//             setData({
//                 customerName: o.customer_name,
//                 customerEmail: o.customer_email,
//                 customerNumber: o.customer_number,
//                 invoiceNo: o.invoice_number || o.id?.slice(0, 8).toUpperCase(),
//                 issueDate: new Date(o.created_at).toLocaleDateString('en-GB'),
//                 items: mappedItems,
//                 subtotal: total,
//                 total,
//                 notes: o.notes || "Official Transaction Receipt",
//                 paymentType: { icon: '💳', label: o.order_platform || 'SHOP' },
//                 paymentStatus: { label: o.payment_status, id: o.payment_status?.toLowerCase() },
//                 amountPaid: paid,
//                 balanceAmount: balance,
//                 orderStatus: o.order_status || ""
//             });
//         } catch (err) {
//             console.error("Fetch Order Details Error", err);
//             setError("Failed to load order details. Please try again.");
//         } finally {
//             setLoading(false);
//         }
//     };

//     if (!open) return null;

//     const renderLoader = () => (
//         <div className="preview-loader-wrap">
//             <div className="preview-pulse-header" />
//             <div className="preview-pulse-meta" />
//             <div className="preview-pulse-table" />
//             <div className="preview-pulse-footer" />
//         </div>
//     );

//     return (
//         <div className="modal-overlay" onClick={onClose}>
//             <div className="modal-box" onClick={e => e.stopPropagation()}>
//                 <div className="modal-header">
//                     <div>
//                         <div className="fw-600" style={{ fontSize: 16 }}>Order Preview</div>
//                         <div className="txt-xs txt-light">#{orderId}</div>
//                     </div>
//                     <button className="modal-close" onClick={onClose}>✕</button>
//                 </div>

//                 <div className="modal-body">
//                     {loading && renderLoader()}

//                     {error && (
//                         <div className="preview-error-state">
//                             <span style={{ fontSize: '32px' }}>⚠️</span>
//                             <div className="fw-600 mt-2">{error}</div>
//                             <button className="btn btn-outline btn-sm mt-4" onClick={fetchOrderDetails}>Retry Fetch</button>
//                         </div>
//                     )}

//                     {!loading && data && (
//                         <>
//                             <div className="preview-brand">
//                                 <div className="preview-logo" style={{ background: 'transparent' }}>
//                                     <img src="/logo.png" alt="ITFixer" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
//                                 </div>
//                                 <div>
//                                     <div className="fw-600" style={{ fontSize: 15 }}>ITFixer</div>
//                                     <div className="txt-xs txt-light">Professional Billing System</div>
//                                 </div>
//                                 <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
//                                     <div className="inv-label" style={{ marginBottom: '4px', fontSize: '9px' }}>PAYMENT STATUS</div>
//                                     <span className={`inv-ps-badge ps-${data.paymentStatus.id}`}>
//                                         {data.paymentStatus.label}
//                                     </span>
//                                 </div>
//                             </div>

//                             <div className="preview-meta">
//                                 <div>
//                                     <div className="inv-label">CUSTOMER</div>
//                                     <div className="fw-600">{data.customerName || '—'}</div>
//                                     <div className="txt-xs txt-light">{data.customerNumber}</div>
//                                 </div>
//                                 <div style={{ textAlign: 'right' }}>
//                                     <div className="inv-label">INVOICE NO.</div>
//                                     <div className="fw-600">#{data.invoiceNo}</div>
//                                 </div>
//                                 <div>
//                                     <div className="inv-label">ISSUE DATE</div>
//                                     <div className="fw-600">{data.issueDate}</div>
//                                 </div>
//                                 <div style={{ textAlign: 'right' }}>
//                                     <div className="inv-label">ORDER STATUS</div>
//                                     <div className="fw-600">{data.orderStatus}</div>
//                                 </div>
//                             </div>

//                             <table className="preview-table">
//                                 <thead>
//                                     <tr>
//                                         <th>Item Description</th>
//                                         <th style={{ textAlign: 'center' }}>Qty</th>
//                                         <th style={{ textAlign: 'right' }}>Price</th>
//                                         <th style={{ textAlign: 'right' }}>Total</th>
//                                     </tr>
//                                 </thead>
//                                 <tbody>
//                                     {data.items.map((i, idx) => (
//                                         <tr key={idx}>
//                                             <td>
//                                                 <div className="fw-600">{i.name}</div>
//                                                 {i.serial_numbers?.length > 0 && (
//                                                     <div style={{ fontSize: '10px', color: 'var(--text-light)', marginTop: '2px' }}>
//                                                         S/N: {i.serial_numbers.join(', ')}
//                                                     </div>
//                                                 )}
//                                             </td>
//                                             <td style={{ textAlign: 'center' }}>{i.qty}</td>
//                                             <td style={{ textAlign: 'right' }}>₹{i.price.toFixed(2)}</td>
//                                             <td className="fw-600" style={{ textAlign: 'right' }}>₹{(i.qty * i.price).toFixed(2)}</td>
//                                         </tr>
//                                     ))}
//                                 </tbody>
//                             </table>

//                             <div className="preview-totals">
//                                 <div className="preview-total-row">
//                                     <span>Subtotal</span>
//                                     <span>₹{data.subtotal.toFixed(2)}</span>
//                                 </div>
//                                 <div className="preview-total-row preview-grand-total">
//                                     <span>GRAND TOTAL</span>
//                                     <span>₹{data.total.toFixed(2)}</span>
//                                 </div>
//                                 <div className="preview-total-row">
//                                     <span>Amount Paid</span>
//                                     <span className="txt-success fw-600">₹{data.amountPaid.toFixed(2)}</span>
//                                 </div>
//                                 {data.total > data.amountPaid && (
//                                     <div className="preview-total-row">
//                                         <span>Balance Remaining</span>
//                                         <span className="txt-danger fw-600">₹{data.balanceAmount.toFixed(2)}</span>
//                                     </div>
//                                 )}
//                             </div>

//                             {/* {data.notes && <div className="preview-notes"><b>Note:</b> {data.notes}</div>} */}
//                         </>
//                     )}
//                 </div>

//                 <div className="modal-footer">
//                     <button className="btn btn-outline" onClick={onClose}>Close</button>
//                     {!loading && data && (
//                         <button className="btn btn-primary" onClick={() => printInvoice(data)}>Print Invoice</button>
//                     )}
//                 </div>
//             </div>
//         </div>
//     );
// };


const OrderPreviewModal = ({ open, onClose, orderId }) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (open && orderId) fetchOrderDetails();
    }, [open, orderId]);

    const fetchOrderDetails = async () => {
        setLoading(true);
        try {
            const res = await axiosInstance.get(`${Api.singleOrder}${orderId}`);
            const o = res.data?.order;

            const mappedItems = (o.items || []).map(i => ({
                name: i.item_details?.name || i.name || 'Product',
                qty: Number(i.quantity || 1),
                price: Number(i.selling_price || i.price || 0),
                discount: Number(i.discount || 0),
                hsn: i.hsn || 'hsn_001'
            }));

            setData({
                customerName: o.customer_name,
                customerNumber: o.customer_number,
                customerAddress: o.customer_address || "Address not provided",
                invoiceNo: o.invoice_number || o.id?.slice(0, 8).toUpperCase(),
                issueDate: new Date(o.created_at).toLocaleDateString('en-GB'),
                items: mappedItems,
            });
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (!open) return null;
    if (loading || !data) return <div className="modal-overlay">Loading...</div>;

    const { customerName, customerNumber, customerAddress, invoiceNo, issueDate, items } = data;
    console.log(data)
    const totalQty = items.reduce((a, b) => a + Number(b.qty), 0);
    const totalDiscount = items.reduce((a, b) => a + (Number(b.discount) || 0), 0);

    const netAmount = items.reduce((acc, item) => {
        return acc + ((item.qty * item.price) - (Number(item.discount) || 0));
    }, 0);

    const taxableValue = netAmount / 1.18;
    const totalGst = netAmount - taxableValue;
    const cgst_sgst = totalGst / 2;

    const netAmountWithOutGst = items.reduce((acc, item) => {
        const gross = item.qty * item.price;
        const taxable = gross / 1.18;
        return acc + taxable;
    }, 0);


    return (
        <div className="modal-overlay invoice-modal">

            <style>{`
                @media print {
                    @page { size: A4; margin: 5mm; }
                    body { margin: 0; }

                    .no-print { display: none !important; }

                    .main-container {
                        height: 287mm !important;
                        overflow: hidden !important;
                        page-break-inside: avoid !important;
                    }
                }

                .bill-table {
                    width: 100%;
                    border-collapse: collapse;
                    table-layout: fixed;
                }

                .bill-table th, .bill-table td {
                    border-right: 1.5px solid #000;
                    padding: 6px;
                    font-size: 11px;
                }

                .bill-table th {
                    border-bottom: 1.5px solid #000;
                    background: #e2e8f0;
                }

                .item-row { height: 35px; }

                .total-row td {
                    border-top: 2px solid #000 !important;
                    border-bottom: 2px solid #000 !important;
                    font-weight: bold;
                }
            `}</style>

            <div className="modal-box invoice-box">

                {/* HEADER */}
                <div className="no-print modal-header">
                    <b>Invoice Preview</b>
                    <button onClick={onClose}>&times;</button>
                </div>

                <div id="printable-area" className="modal-body">

                    <div className="main-container">

                        {/* HEADER */}
                        <div style={{ display: 'flex', borderBottom: '2px solid #000' }}>
                            <div style={{ flex: '0 0 160px', padding: '10px', borderRight: '2px solid #000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <div style={{ background: '#0056b3', color: '#fff', padding: '10px', fontWeight: 'bold', textAlign: 'center', borderRadius: '4px', width: '100%' }}>
                                    SIGMAH <br /> ENTERPRISES
                                    <div style={{ color: '#90ee90', fontSize: '10px' }}>IT Fixer</div>
                                </div>
                            </div>
                            <div style={{ flex: 1, textAlign: 'center', padding: '10px' }}>
                                <h2 style={{ margin: '0', fontSize: '24px', fontWeight: '900' }}>SIGMAH ENTERPRISES</h2>
                                <div style={{ fontSize: '11px' }}>New No.29 / Old No.31 & 32, Jafferkhanpet, Chennai - 600083</div>
                                <div style={{ fontSize: '11px' }}>GST No: 33NVOPK6133G1Z8 | Email: itfixer7@gmail.com</div>
                            </div>
                        </div>

                        {/* CUSTOMER */}
                        {/* <div className="inv-customer">
                            <div>
                                <b>To:</b> {customerName}<br />
                                PH: {customerNumber}<br />
                                {customerAddress}
                            </div>
                            <div>
                                Bill No: {invoiceNo}<br />
                                Date: {issueDate}
                            </div>
                        </div> */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', borderBottom: '2px solid #000' }}>
                            <div style={{ padding: '8px', borderRight: '2px solid #000' }}>
                                <div style={{ fontSize: '12px' }}><b>To:</b> {customerName}</div>
                                <div style={{ fontSize: '12px' }}><b>PH:</b> {customerNumber}</div>
                                {/* <div style={{ fontSize: '10px' }}>{customerAddress}</div> */}
                            </div>
                            <div style={{ padding: '8px', fontSize: '12px' }}>
                                <div style={{ display: 'flex' }}><span>Bill No :</span> <span>{invoiceNo}</span></div>
                                <div style={{ display: 'flex' }}><span>Date :</span> <span>{issueDate}</span></div>
                            </div>
                        </div>

                        {/* TABLE */}
                        <div className="table-wrapper">
                            <table className="bill-table">
                                <thead>
                                    <tr>
                                        <th>S.NO</th>
                                        <th>DESCRIPTION</th>
                                        <th>HSN</th>
                                        <th>QTY</th>
                                        <th>RATE</th>
                                        <th>CGST</th>
                                        <th>SGST</th>
                                        <th>AMOUNT</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {items.map((item, i) => (
                                        <tr key={i} className="item-row">
                                            <td>{i + 1}</td>
                                            <td>{item.name}</td>
                                            <td>{item.hsn}</td>
                                            <td>{item.qty}</td>
                                            <td>{item.price.toFixed(2)}</td>
                                            <td>{((item.qty * item.price * 0.18) / 2 / 1.18).toFixed(2)}</td>
                                            <td>{((item.qty * item.price * 0.18) / 2 / 1.18).toFixed(2)}</td>
                                            <td>{((item.qty * item.price) / 1.18).toFixed(2)}</td>
                                        </tr>
                                    ))}

                                    {[...Array(Math.max(0, 15 - items.length))].map((_, i) => (
                                        <tr key={i} className="item-row">
                                            <td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td>
                                        </tr>
                                    ))}
                                </tbody>

                                <tfoot>
                                    <tr className="total-row">
                                        <td colSpan="3">Tot.Qty</td>
                                        <td>{totalQty}</td>
                                        <td>Gross</td>
                                        <td>{cgst_sgst.toFixed(2)}</td>
                                        <td>{cgst_sgst.toFixed(2)}</td>
                                        <td>{netAmountWithOutGst.toFixed(2)}</td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>

                        {/* FOOTER */}
                        {/* 4. Footer Calculations */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr' }}>

                            {/* LEFT SIDE */}
                            <div style={{ padding: '10px', borderRight: '2px solid #000' }}>
                                <div style={{ fontSize: '11px', marginBottom: '8px' }}>
                                    <b>Amount In Words:</b> [Rupees Amount Logic]
                                </div>

                                <div style={{ fontSize: '9px', lineHeight: '1.3' }}>
                                    <b>Terms & Conditions:</b><br />
                                    1. Payments via Bank Transfer/Cheque.<br />
                                    2. Goods once sold not returnable.
                                </div>
                            </div>

                            {/* RIGHT SIDE */}
                            <div>
                                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px' }}>
                                    <tbody>
                                        <tr style={{ borderBottom: '1px solid #000' }}>
                                            <td style={{ padding: '4px' }}>Discount</td>
                                            <td style={{ textAlign: 'right', borderLeft: '1.5px solid #000', padding: '4px' }}>
                                                {totalDiscount > 0 ? `- ${totalDiscount.toFixed(2)}` : '0.00'}
                                            </td>
                                        </tr>

                                        <tr style={{ borderBottom: '1px solid #000' }}>
                                            <td style={{ padding: '4px' }}>GST Amount</td>
                                            <td style={{ textAlign: 'right', borderLeft: '1.5px solid #000', padding: '4px' }}>
                                                {totalGst.toFixed(2)}
                                            </td>
                                        </tr>

                                        <tr style={{ borderBottom: '1px solid #000' }}>
                                            <td style={{ padding: '4px' }}>Round Off</td>
                                            <td style={{ textAlign: 'right', borderLeft: '1.5px solid #000', padding: '4px' }}>
                                                0.00
                                            </td>
                                        </tr>

                                        <tr style={{ fontWeight: 'bold', background: '#eee', borderBottom: '1.5px solid #000' }}>
                                            <td style={{ padding: '4px' }}>Net Amount</td>
                                            <td style={{ textAlign: 'right', borderLeft: '1.5px solid #000', padding: '4px' }}>
                                                ₹{netAmount.toFixed(2)}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>

                                {/* GST BREAKDOWN */}
                                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '9px', textAlign: 'center' }}>
                                    <tbody>
                                        <tr style={{ borderBottom: '1px solid #000' }}>
                                            <td style={{ borderRight: '1px solid #000' }}>GST %</td>
                                            <td style={{ borderRight: '1px solid #000' }}>GST Amt</td>
                                            <td>Good Value</td>
                                        </tr>
                                        <tr>
                                            <td style={{ borderRight: '1px solid #000' }}>18%</td>
                                            <td style={{ borderRight: '1px solid #000' }}>{totalGst.toFixed(2)}</td>
                                            <td>{netAmount.toFixed(2)}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* 5. Signatures */}
                        <div style={{ padding: '40px 10px 10px 10px', borderTop: '2px solid #000' }}>

                            <div style={{ textAlign: 'right', fontSize: '11px', fontWeight: 'bold', marginBottom: '60px' }}>
                                For SIGMAH ENTERPRISES
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <div style={{
                                    width: '220px',
                                    borderTop: '1.5px solid #000',
                                    textAlign: 'center',
                                    fontSize: '10px',
                                    fontWeight: 'bold',
                                    paddingTop: '5px'
                                }}>
                                    Customer Signature and Seal
                                </div>

                                <div style={{
                                    width: '220px',
                                    borderTop: '1.5px solid #000',
                                    textAlign: 'center',
                                    fontSize: '10px',
                                    fontWeight: 'bold',
                                    paddingTop: '5px'
                                }}>
                                    Authorised Signatory
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

                {/* <div className="no-print modal-footer">
                    <button onClick={() => window.print()}>Print</button>
                </div> */}
                <div className="no-print" style={{ padding: '20px', textAlign: 'right' }}>
                    <button onClick={() => window.print()} style={{ background: '#2563eb', color: '#fff', border: 'none', padding: '10px 30px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                        Print Invoice
                    </button>
                </div>
            </div>
        </div>
    );
};


export default OrderPreviewModal;
