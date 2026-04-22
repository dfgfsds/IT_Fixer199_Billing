// import './CustomersPage.css';

// const customers = [
//     { id: 'CUST-001', name: 'Marcus Thorne', email: 'marcus@corp.com', phone: '+1 555 2849', invoices: 12, total: '₹14,820.00', status: 'Active' },
//     { id: 'CUST-002', name: 'Elena Vance', email: 'elena@vance.io', phone: '+1 555 9281', invoices: 6, total: '₹5,400.00', status: 'Active' },
//     { id: 'CUST-003', name: 'Apex Labs', email: 'billing@apexlabs.com', phone: '+1 555 3321', invoices: 24, total: '₹82,100.00', status: 'Active' },
//     { id: 'CUST-004', name: 'Quantum Logistics', email: 'ap@quantum.co', phone: '+1 555 7764', invoices: 9, total: '₹18,240.00', status: 'Overdue' },
//     { id: 'CUST-005', name: 'Beth Smith', email: 'beth@gmail.com', phone: '+1 555 1192', invoices: 3, total: '₹870.00', status: 'Active' },
// ];

// const initials = (name) => name.split(' ').map(w => w[0]).join('').toUpperCase();

// export default function CustomersPage() {
//     return (
//         <div className="cust">
//             <div className="cust-header">
//                 <div>
//                     <h1 className="section-title">Customers</h1>
//                     <p className="section-subtitle">Manage client profiles and billing history.</p>
//                 </div>
//                 <div style={{ display: 'flex', gap: 8 }}>
//                     <input className="input" placeholder="🔍 Search customers..." style={{ width: '220px' }} />
//                     <button className="btn btn-primary">＋ Add Customer</button>
//                 </div>
//             </div>

//             <div className="card">
//                 <div className="table-wrap">
//                     <table>
//                         <thead>
//                             <tr>
//                                 <th>CUSTOMER</th>
//                                 <th>CONTACT</th>
//                                 <th>INVOICES</th>
//                                 <th style={{ textAlign: 'right' }}>TOTAL BILLED</th>
//                                 <th>STATUS</th>
//                                 <th>ACTIONS</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {customers.map(c => (
//                                 <tr key={c.id}>
//                                     <td>
//                                         <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
//                                             <div className="avatar" style={{ background: '#dbeafe', color: '#1e40af' }}>{initials(c.name)}</div>
//                                             <div>
//                                                 <div className="fw-600" style={{ fontSize: '13.5px' }}>{c.name}</div>
//                                                 <div className="txt-xs txt-light">{c.id}</div>
//                                             </div>
//                                         </div>
//                                     </td>
//                                     <td>
//                                         <div style={{ fontSize: '13px', color: 'var(--text-med)' }}>{c.email}</div>
//                                         <div className="txt-xs txt-light">{c.phone}</div>
//                                     </td>
//                                     <td className="fw-600">{c.invoices}</td>
//                                     <td style={{ textAlign: 'right', fontWeight: 600 }}>{c.total}</td>
//                                     <td>
//                                         <span className={`badge ₹{c.status === 'Active' ? 'badge-green' : 'badge-red'}`}>
//                                             {c.status}
//                                         </span>
//                                     </td>
//                                     <td>
//                                         <div style={{ display: 'flex', gap: 6 }}>
//                                             <button className="btn btn-outline btn-sm">📄 Invoice</button>
//                                             <button className="btn btn-ghost btn-sm">✏</button>
//                                         </div>
//                                     </td>
//                                 </tr>
//                             ))}
//                         </tbody>
//                     </table>
//                 </div>
//             </div>
//         </div>
//     );
// }

import { useEffect, useState } from 'react';
import './CustomersPage.css';
import Api from "../api-endpoints/ApiUrls";
import axiosInstance from '../configs/axios-middleware';

const initials = (name) =>
  name?.split(' ').map(w => w[0]).join('').toUpperCase();

/* ---------------- MAIN ---------------- */
export default function CustomersPage() {

  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState('');

  // ✅ PAGINATION
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  /* ---------------- API ---------------- */
  const fetchCustomers = async () => {
    try {
      const params = new URLSearchParams();

      params.append("page", page);
      params.append("size", limit);
      params.append("role", "CUSTOMER");

      if (search) params.append("search", search);

      const res = await axiosInstance.get(
        `${Api.allUsers}?${params.toString()}`
      );

      setCustomers(res?.data?.users || []);

      const pagination = res?.data?.pagination;
      if (pagination) {
        setTotalPages(pagination.total_pages || 1);
      }

    } catch (err) {
      console.error("Customer fetch error", err);
    }
  };

  /* ---------------- EFFECT ---------------- */
  useEffect(() => {
    fetchCustomers();
  }, [page, search]);

  /* ---------------- HELPERS ---------------- */
  const getPageNumbers = () => {
    const pages = [];
    const range = 1;

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
      return pages;
    }

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= page - range && i <= page + range)
      ) {
        pages.push(i);
      } else if (pages[pages.length - 1] !== '...') {
        pages.push('...');
      }
    }
    return pages;
  };

  /* ---------------- UI ---------------- */
  return (
    <div className="cust">

      {/* HEADER */}
      <div className="cust-header">
        <div>
          <h1 className="section-title">Customers</h1>
          <p className="section-subtitle">
            Manage client profiles and billing history.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          <input
            className="input"
            placeholder="🔍 Search customers..."
            style={{ width: '220px' }}
            value={search}
            onChange={(e) => {
              setPage(1);
              setSearch(e.target.value);
            }}
          />
          {/* <button className="btn btn-primary">＋ Add Customer</button> */}
        </div>
      </div>

      {/* TABLE */}
      <div className="card">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th style={{ width: '50px' }}>S.NO</th>
                <th>CUSTOMER</th>
                <th>CONTACT</th>
                {/* <th>INVOICES</th>
                <th style={{ textAlign: 'right' }}>TOTAL BILLED</th> */}
                <th>STATUS</th>
                <th>ACTIONS</th>
              </tr>
            </thead>

            <tbody>
              {customers.map((c, index) => (
                <tr key={c.id}>
                  <td>{(page - 1) * limit + index + 1}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div className="avatar" style={{ background: '#dbeafe', color: '#1e40af' }}>
                        {initials(c.name)}
                      </div>
                      <div>
                        <div className="fw-600" style={{ fontSize: '13.5px' }}>
                          {c.name}
                        </div>
                        {/* <div className="txt-xs txt-light">{c.id}</div> */}
                      </div>
                    </div>
                  </td>

                  <td>
                    <div style={{ fontSize: '13px', color: 'var(--text-med)' }}>
                      {c.email}
                    </div>
                    <div className="txt-xs txt-light">
                      {c.mobile_number}
                    </div>
                  </td>

                  {/* <td className="fw-600">
                    {c.total_orders || 0}
                  </td>

                  <td style={{ textAlign: 'right', fontWeight: 600 }}>
                    ₹{Number(c.total_spent || 0).toFixed(2)}
                  </td> */}

                  <td>
                    <span className={`badge ${c.is_active ? 'badge-green' : 'badge-red'}`}>
                      {c.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>

                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      {/* <button className="btn btn-outline btn-sm">📄 Invoice</button> */}
                      <button className="btn btn-ghost btn-sm">✏</button>
                    </div>
                  </td>
                </tr>
              ))}

              {customers.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: 20 }}>
                    No customers found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="cat-pagination">
          <span className="pagination-info">Page {page} of {totalPages}</span>

          <div className="cat-pages">
            <button
              className="page-btn"
              disabled={page === 1}
              onClick={() => setPage(p => p - 1)}
            >
              ‹
            </button>

            {getPageNumbers().map((p, i) => (
              <button
                key={i}
                className={`page-btn ${page === p ? "page-btn-active" : ""} ${p === '...' ? "page-btn-dots" : ""}`}
                onClick={() => p !== '...' && setPage(p)}
                disabled={p === '...'}
              >
                {p}
              </button>
            ))}

            <button
              className="page-btn"
              disabled={page === totalPages}
              onClick={() => setPage(p => p + 1)}
            >
              ›
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
