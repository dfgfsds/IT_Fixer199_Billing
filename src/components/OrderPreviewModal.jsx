import React, { useEffect, useState } from 'react';
import './OrderPreviewModal.css';
import axiosInstance from '../configs/axios-middleware';
import Api from "../api-endpoints/ApiUrls";

/**
 * Shared Professional Invoice Preview Modal
 * Upgraded to fetch full details by ID for accurate billing records.
 */

const printInvoice = (orderData) => {
    const { customerName, customerNumber, customerGst, invoiceNo, issueDate, items = [] } = orderData;

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

    const html = `
    <html>
    <head>
      <title>Invoice - SIGMAH ENTERPRISES</title>
      <style>
        @page { size: A4; margin: 0; }
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 10mm; background: #fff; color: #000; }
        .main-container { border: 2px solid #000; width: 190mm; height: 277mm; margin: 0 auto; display: flex; flex-direction: column; box-sizing: border-box; }
        .top-header { display: flex; border-bottom: 2px solid #000; height: 110px; }
        .logo-section { flex: 0 0 180px; padding: 10px; border-right: 2px solid #000; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; }
        .logo-text { font-weight: bold; font-size: 18px; color: #666; line-height: 1.1; }
        .it-fixer { color: #28a745; font-size: 12px; font-weight: bold; margin-top: 5px; }
        .company-info { flex: 1; text-align: center; padding: 10px; }
        .company-info h1 { margin: 0; font-size: 24px; font-weight: 900; letter-spacing: 1px; }
        .company-info p { margin: 2px 0; font-size: 10px; line-height: 1.4; }
        .bill-details { display: grid; grid-template-columns: 1.5fr 1fr; border-bottom: 2px solid #000; min-height: 100px; }
        .to-section { padding: 10px; border-right: 2px solid #000; font-size: 11px; }
        .no-section table { width: 100%; border-collapse: collapse; font-size: 11px; }
        .no-section td { padding: 5px 8px; }
        .items-container { flex-grow: 1; border-bottom: 2px solid #000; }
        .bill-table { width: 100%; border-collapse: collapse; table-layout: fixed; height: 100%;}
        .bill-table th { border-right: 1px solid #000; padding: 8px; font-size: 11px; border-bottom: 2px solid #000; background: #fff; font-weight: bold; text-align: center; }
        .bill-table td { border-right: 1px solid #000; padding: 6px; font-size: 11px; vertical-align: top; }
        .bill-table th:last-child, .bill-table td:last-child { border-right: none; }
        .text-right { text-align: right; }
        .text-center { text-align: center; }
        .total-row { border-top: 2px solid #000; font-weight: bold; }
        .summary-section { display: grid; grid-template-columns: 1.5fr 1fr; border-bottom: 2px solid #000; }
        .summary-left { padding: 10px; border-right: 2px solid #000; font-size: 11px; }
        .summary-right table { width: 100%; border-collapse: collapse; font-size: 11px; }
        .summary-right td { padding: 5px 10px; border-bottom: 1px solid #000; border-left: 1px solid #000; }
        .gst-table { width: 100%; border-collapse: collapse; font-size: 10px; text-align: center; }
        .gst-table td, .gst-table th { border: 1px solid #000; padding: 4px; }
        .signature-section { margin-top: auto; padding: 15px; display: flex; justify-content: space-between; align-items: flex-end; }
        .sig-box { width: 200px; text-align: center; border-top: 1.5px solid #000; padding-top: 5px; font-size: 10px; font-weight: bold; }
      </style>
    </head>
    <body>
      <div class="main-container">
        <div class="top-header">
          <div class="logo-section">
            <div class="logo-text">SIGMAH <br/> ENTERPRISES</div>
            <div class="it-fixer">IT Fixer</div>
          </div>
          <div class="company-info">
            <h1>SIGMAH ENTERPRISES</h1>
            <p>New No.29 / Old No.31 & 32, Jafferkhanpet, Opp to Kasi Theatre,<br/>
               Ashok Nagar, Chennai - 600083, <br/>
               GST No:- 33NVOPK6133G1Z8, PH: 9994156516</p>
          </div>
        </div>

        <div class="bill-details">
          <div class="to-section">
            <b>To:</b><br/>
            ${customerName?.toUpperCase()}<br/>
            PHN: ${customerNumber} | GST: ${customerGst || 'N/A'}
          </div>
          <div class="no-section">
            <table>
              <tr><td><b>Bill No</b></td><td>: ${invoiceNo || 'N/A'}</td></tr>
              <tr><td><b>Date</b></td><td>: ${issueDate || new Date().toLocaleDateString('en-GB')}</td></tr>
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
                  <td><b>${item?.name || 'Product'}</b></td>
                  <td class="text-center">${item?.hsn || ''}</td>
                  <td class="text-center">${qty}</td>
                  <td class="text-right">${rate.toFixed(2)}</td>
                  <td class="text-right">${itemTax.toFixed(2)}</td>
                  <td class="text-right">${itemTax.toFixed(2)}</td>
                  <td class="text-right">${itemTaxable.toFixed(2)}</td>
                </tr>`
    }).join("")}
              
              ${Array(emptyRowsNeeded).fill(0).map(() => `<tr><td>&nbsp;</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>`).join("")}

              <tr class="total-row">
                <td colspan="3" class="text-center">Tot.Qty: ${totalQty}</td>
                <td colspan="2" class="text-center">Gross Amount</td>
                <td class="text-right">${cgst_sgst.toFixed(2)}</td>
                <td class="text-right">${cgst_sgst.toFixed(2)}</td>
                <td class="text-right">${taxableValue.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="summary-section">
          <div class="summary-left">
            <b>Amount In Words:</b><br/>
            [${numberToWords(Math.round(netAmount))}]
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
          <div class="sig-box">Customer Signature</div>
          <div style="text-align: right;">
            <div style="font-weight: bold; font-size: 12px; margin-bottom: 45px;">For SIGMAH ENTERPRISES</div>
            <div class="sig-box" style="margin-left: auto;">Authorised Signatory</div>
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
                    <button
                        onClick={() =>
                            // window.print()
                            printInvoice(data)
                        }
                        style={{ background: '#2563eb', color: '#fff', border: 'none', padding: '10px 30px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                        Print Invoice
                    </button>
                </div>
            </div>
        </div>
    );
};


export default OrderPreviewModal;
