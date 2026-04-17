import './CustomersPage.css';

const customers = [
    { id: 'CUST-001', name: 'Marcus Thorne', email: 'marcus@corp.com', phone: '+1 555 2849', invoices: 12, total: '₹14,820.00', status: 'Active' },
    { id: 'CUST-002', name: 'Elena Vance', email: 'elena@vance.io', phone: '+1 555 9281', invoices: 6, total: '₹5,400.00', status: 'Active' },
    { id: 'CUST-003', name: 'Apex Labs', email: 'billing@apexlabs.com', phone: '+1 555 3321', invoices: 24, total: '₹82,100.00', status: 'Active' },
    { id: 'CUST-004', name: 'Quantum Logistics', email: 'ap@quantum.co', phone: '+1 555 7764', invoices: 9, total: '₹18,240.00', status: 'Overdue' },
    { id: 'CUST-005', name: 'Beth Smith', email: 'beth@gmail.com', phone: '+1 555 1192', invoices: 3, total: '₹870.00', status: 'Active' },
];

const initials = (name) => name.split(' ').map(w => w[0]).join('').toUpperCase();

export default function CustomersPage() {
    return (
        <div className="cust">
            <div className="cust-header">
                <div>
                    <h1 className="section-title">Customers</h1>
                    <p className="section-subtitle">Manage client profiles and billing history.</p>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                    <input className="input" placeholder="🔍 Search customers..." style={{ width: '220px' }} />
                    <button className="btn btn-primary">＋ Add Customer</button>
                </div>
            </div>

            <div className="card">
                <div className="table-wrap">
                    <table>
                        <thead>
                            <tr>
                                <th>CUSTOMER</th>
                                <th>CONTACT</th>
                                <th>INVOICES</th>
                                <th style={{ textAlign: 'right' }}>TOTAL BILLED</th>
                                <th>STATUS</th>
                                <th>ACTIONS</th>
                            </tr>
                        </thead>
                        <tbody>
                            {customers.map(c => (
                                <tr key={c.id}>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                            <div className="avatar" style={{ background: '#dbeafe', color: '#1e40af' }}>{initials(c.name)}</div>
                                            <div>
                                                <div className="fw-600" style={{ fontSize: '13.5px' }}>{c.name}</div>
                                                <div className="txt-xs txt-light">{c.id}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div style={{ fontSize: '13px', color: 'var(--text-med)' }}>{c.email}</div>
                                        <div className="txt-xs txt-light">{c.phone}</div>
                                    </td>
                                    <td className="fw-600">{c.invoices}</td>
                                    <td style={{ textAlign: 'right', fontWeight: 600 }}>{c.total}</td>
                                    <td>
                                        <span className={`badge ₹{c.status === 'Active' ? 'badge-green' : 'badge-red'}`}>
                                            {c.status}
                                        </span>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', gap: 6 }}>
                                            <button className="btn btn-outline btn-sm">📄 Invoice</button>
                                            <button className="btn btn-ghost btn-sm">✏</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
