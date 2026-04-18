// import { useState } from 'react';
// import './CatalogPage.css';

// const products = [
//     { id: 1, name: 'Initial Consultation (Premium)', code: 'SRV-0042', category: 'CONSULTATIONS', catClass: 'badge-purple', price: 245.00, stock: 'ALWAYS AVAILABLE', stockClass: 'stock-available', img: '🩺' },
//     { id: 2, name: 'Sterile Gauze Pack (50pk)', code: 'RET-8812', category: 'RETAIL', catClass: 'badge-gray', price: 18.50, stock: '8 UNITS REMAINING', stockClass: 'stock-low', img: '🩹' },
//     { id: 3, name: 'Standard Echo Scan', code: 'PRC-9003', category: 'PROCEDURES', catClass: 'badge-blue', price: 1120.00, stock: 'ACTIVE SERVICE', stockClass: 'stock-available', img: '🔊' },
//     { id: 4, name: 'Advanced Prenatal Vitamins', code: 'RET-4421', category: 'RETAIL', catClass: 'badge-gray', price: 45.99, stock: '240 IN STOCK', stockClass: 'stock-in', img: '💊' },
// ];

// // const tabs = ['All Products', 'Services', 'Pharmacy', 'Consumables'];
// const tabs = ['All Products'];


// const categories = [
//     { name: 'Procedures', count: 112, pct: 75 },
//     { name: 'Retail Products', count: 842, pct: 58 },
//     { name: 'Consultations', count: 42, pct: 20 },
// ];

// export default function CatalogPage() {
//     const [tab, setTab] = useState('All Products');

//     return (
//         <div className="cat">
//             {/* Header */}
//             <div className="cat-header">
//                 <div>
//                     <div className="cat-tagline">INVENTORY MANAGEMENT</div>
//                     <h1 className="section-title" style={{ fontSize: '26px' }}>Product Catalog</h1>
//                     <p className="section-subtitle">Manage medical services, retail products, and consultation billing rates from a centralized architectural ledger.</p>
//                 </div>
//                 {/* <div className="cat-header-actions">
//                     <button className="btn btn-outline">↓ Export</button>
//                     <button className="btn btn-primary">＋ Add New Product</button>
//                 </div> */}
//             </div>

//             {/* Stat Cards */}
//             {/* <div className="cat-stats">
//                 <div className="stat-card">
//                     <div className="cat-stat-icon">🗂</div>
//                     <div className="stat-label">TOTAL ITEMS</div>
//                     <div className="stat-value">1,284</div>
//                 </div>
//                 <div className="stat-card">
//                     <div className="cat-stat-icon">🩺</div>
//                     <div className="stat-label">SERVICES</div>
//                     <div className="stat-value">42</div>
//                 </div>
//                 <div className="stat-card cat-stat-warn">
//                     <div className="cat-stat-icon">⚠️</div>
//                     <div className="stat-label">LOW STOCK</div>
//                     <div className="stat-value">12</div>
//                 </div>
//                 <div className="stat-card">
//                     <div className="cat-stat-icon">📊</div>
//                     <div className="stat-label">AVG. MARGIN</div>
//                     <div className="stat-value">64.2%</div>
//                 </div>
//             </div> */}

//             {/* Main card */}
//             <div className="card" style={{ marginBottom: 16 }}>
//                 {/* Tabs */}
//                 <div className="cat-tabs">
//                     {tabs.map(t => (
//                         <button key={t} className={`cat-tab ₹{tab === t ? 'cat-tab-active' : ''}`} onClick={() => setTab(t)}>{t}</button>
//                     ))}
//                     <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px' }}>
//                         <button className="btn-ghost btn btn-sm">⚙ Filter</button>
//                         <button className="btn-ghost btn btn-sm">⋮</button>
//                     </div>
//                 </div>

//                 {/* Table */}
//                 <div className="table-wrap">
//                     <table>
//                         <thead>
//                             <tr>
//                                 <th>PRODUCT NAME</th>
//                                 <th>CATEGORY</th>
//                                 <th style={{ textAlign: 'right' }}>PRICE</th>
//                                 <th>STOCK STATUS</th>
//                                 <th>ACTIONS</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {products.map(p => (
//                                 <tr key={p.id}>
//                                     <td>
//                                         <div className="cat-product-name">
//                                             <div className="cat-product-img">{p.img}</div>
//                                             <div>
//                                                 <div className="fw-600" style={{ fontSize: '13.5px' }}>{p.name}</div>
//                                                 <div className="txt-xs txt-light">CODE: {p.code}</div>
//                                             </div>
//                                         </div>
//                                     </td>
//                                     <td><span className={`badge ₹{p.catClass}`}>{p.category}</span></td>
//                                     <td style={{ textAlign: 'right', fontWeight: 600 }}>₹{p.price.toFixed(2)}</td>
//                                     <td>
//                                         <span className={`cat-stock ₹{p.stockClass}`}>
//                                             <span className={`dot ₹{p.stockClass === 'stock-low' ? 'dot-orange' : 'dot-green'}`}></span>
//                                             {p.stock}
//                                         </span>
//                                     </td>
//                                     <td><button className="btn-ghost btn btn-sm">✏</button></td>
//                                 </tr>
//                             ))}
//                         </tbody>
//                     </table>
//                 </div>

//                 {/* Pagination */}
//                 <div className="cat-pagination">
//                     <span className="txt-xs txt-light">Showing 4 of 1,284 entries</span>
//                     <div className="cat-pages">
//                         <button className="page-btn">‹</button>
//                         <button className="page-btn page-btn-active">1</button>
//                         <button className="page-btn">2</button>
//                         <button className="page-btn">3</button>
//                         <button className="page-btn">›</button>
//                     </div>
//                 </div>
//             </div>

//             {/* Bottom row */}
//             {/* <div className="cat-bottom">
//                 <div className="cat-bulk-card">
//                     <h3 className="cat-bulk-title">Bulk Pricing Updates</h3>
//                     <p className="cat-bulk-text">Need to adjust your consultation fees across the entire clinic? Use our smart ledger tools to apply percentage-based increases.</p>
//                     <button className="btn" style={{ background: '#fff', color: ' var(--primary)', fontWeight: 700 }}>Launch Pricing Wizard</button>
//                 </div>
//                 <div className="card card-pad cat-categories">
//                     <div className="fw-600" style={{ fontSize: '15px', marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//                         <span>Categories</span>
//                         <span>🏷</span>
//                     </div>
//                     {categories.map(c => (
//                         <div key={c.name} className="cat-category-row">
//                             <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
//                                 <span style={{ fontSize: '13.5px', color: 'var(--text-med)' }}>{c.name}</span>
//                                 <span className="fw-600" style={{ fontSize: '13px' }}>{c.count}</span>
//                             </div>
//                             <div className="progress-bar">
//                                 <div className="progress-fill" style={{ width: `₹{c.pct}%` }}></div>
//                             </div>
//                         </div>
//                     ))}
//                 </div>
//             </div> */}
//         </div>
//     );
// }


import { useEffect, useState } from 'react';
import './CatalogPage.css';
import Api from "../api-endpoints/ApiUrls";
import axiosInstance from '../configs/axios-middleware';

export default function CatalogPage() {

    const [products, setProducts] = useState([]);
    const [search, setSearch] = useState('');

    // pagination
    const [page, setPage] = useState(1);
    const [limit] = useState(40);
    const [totalPages, setTotalPages] = useState(1);

    /* ---------------- API ---------------- */
    const fetchProducts = async () => {
        try {
            const params = new URLSearchParams();

            params.append("page", page);
            params.append("limit", limit);
            params.append("include_category", "true");
            params.append("include_brand", "true");
            params.append("include_pricing", "true");

            if (search) params.append("search", search);

            const res = await axiosInstance.get(
                `${Api.products}?${params.toString()}`
            );

            setProducts(res?.data?.products || []);

            const pagination = res?.data?.pagination;
            if (pagination) setTotalPages(pagination.totalPages || 1);

        } catch (err) {
            console.error("Product fetch error", err);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, [page, search]);

    /* ---------------- UI ---------------- */
    return (
        <div className="cat">

            {/* HEADER */}
            <div className="cat-header">
                <div>
                    <div className="cat-tagline">INVENTORY MANAGEMENT</div>
                    <h1 className="section-title" style={{ fontSize: '26px' }}>
                        Product Catalog
                    </h1>
                    <p className="section-subtitle">
                        Manage products and services in one place.
                    </p>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                    <input
                        className="input"
                        placeholder="🔍 Search products..."
                        value={search}
                        onChange={(e) => {
                            setPage(1);
                            setSearch(e.target.value);
                        }}
                    />
                    {/* <button className="btn btn-primary">＋ Add Product</button> */}
                </div>
            </div>

            {/* TABLE */}
            <div className="card">
                <div className="table-wrap">
                    <table>
                        <thead>
                            <tr>
                                <th>PRODUCT NAME</th>
                                <th>CATEGORY</th>
                                <th>Brand</th>
                                <th style={{ textAlign: 'right' }}>PRICE</th>
                                {/* <th>STOCK</th> */}
                                {/* <th>ACTIONS</th> */}
                            </tr>
                        </thead>

                        <tbody>
                            {products.map(p => (
                                <tr key={p.id}>

                                    {/* PRODUCT */}
                                    <td>
                                        <div className="cat-product-name">
                                            <div className="cat-product-img">📦</div>
                                            <div>
                                                <div className="fw-600" style={{ fontSize: '13.5px' }}>
                                                    {p.name}
                                                </div>
                                                <div className="txt-xs txt-light">
                                                    BARCODE: {p?.barcode}
                                                </div>
                                            </div>
                                        </div>
                                    </td>

                                    {/* CATEGORY */}
                                    <td>
                                        <span className="badge badge-gray">
                                            {p?.categories?.[0]?.name || 'PRODUCT'}
                                        </span>
                                    </td>
                                    <td>
                                        <span className="badge badge-gray">
                                            {p?.brand_details?.name || 'PRODUCT'}
                                        </span>
                                    </td>

                                    {/* PRICE */}
                                    <td style={{ textAlign: 'right', fontWeight: 600 }}>
                                        ₹{Number(
                                            p?.pricing?.find(i => !i?.hub && !i?.start_time && !i?.end_time)?.price || 0
                                        ).toFixed(2)}
                                    </td>

                                    {/* STOCK */}
                                    {/* <td>
                    <span className="cat-stock stock-available">
                      <span className="dot dot-green"></span>
                      {p.stock || 'Available'}
                    </span>
                  </td> */}

                                    {/* ACTION */}
                                    {/* <td>
                                        <button className="btn-ghost btn btn-sm">✏</button>
                                    </td> */}
                                </tr>
                            ))}

                            {products.length === 0 && (
                                <tr>
                                    <td colSpan={5} style={{ textAlign: 'center' }}>
                                        No products found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* PAGINATION */}
                <div className="cat-pagination">
                    <span className="txt-xs txt-light">
                        Page {page} of {totalPages}
                    </span>

                    <div className="cat-pages">
                        <button
                            className="page-btn"
                            disabled={page === 1}
                            onClick={() => setPage(p => p - 1)}
                        >‹</button>

                        {[...Array(totalPages)].map((_, i) => (
                            <button
                                key={i}
                                className={`page-btn ${page === i + 1 ? 'page-btn-active' : ''}`}
                                onClick={() => setPage(i + 1)}
                            >
                                {i + 1}
                            </button>
                        ))}

                        <button
                            className="page-btn"
                            disabled={page === totalPages}
                            onClick={() => setPage(p => p + 1)}
                        >›</button>
                    </div>
                </div>

            </div>
        </div>
    );
}