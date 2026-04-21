import { useNavigate, useLocation } from 'react-router-dom';
import './Topbar.css';

const pageTitles = {
    '/dashboard': 'The Digital Ledger',
    '/invoicing': 'The Digital Ledger',
    '/catalog': 'Catalog',
    '/payments': 'The Digital Ledger',
    '/customers': 'The Digital Ledger',
};

export default function Topbar() {
    const navigate = useNavigate();
    const location = useLocation();
    const title = pageTitles[location.pathname] || 'The Digital Ledger';

    return (
        <header className="topbar">
            <div className="tb-title">{title}</div>
            {/* <div className="tb-search">
                <span className="tb-search-icon">🔍</span>
                <input type="text" placeholder="Search customer or bill number..." />
            </div> */}
            {/* <nav className="tb-nav">
                <span className="tb-nav-link">Quick Actions</span>
                <span className="tb-nav-link">Reports</span>
            </nav> */}
            <div className="tb-actions">
                {/* <button className="tb-icon-btn" title="Notifications">🔔</button>
                <button className="tb-icon-btn" title="Help">❓</button>
                <button className="btn btn-outline btn-sm">Support</button> */}
                <button className="btn btn-primary btn-sm" onClick={() => navigate('/invoicing')}>New Invoice</button>
            </div>
        </header>
    );
}
