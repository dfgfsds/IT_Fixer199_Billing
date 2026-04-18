import { NavLink, useNavigate } from 'react-router-dom';
import './Sidebar.css';
import { useAuth } from '../contexts/AuthContext';

const navItems = [
    // { to: '/dashboard', label: 'Dashboard', icon: '⊞' },
    { to: '/invoicing', label: 'Invoicing', icon: '📄' },
    { to: '/orders', label: 'Orders', icon: '📦' },
    { to: '/customers', label: 'Customers', icon: '👤' },
    // { to: '/payments', label: 'Payments', icon: '💳' },
    { to: '/catalog', label: 'Catalog', icon: '🗂' },
];

export default function Sidebar({ currentPage }) {
    const navigate = useNavigate();
      const { logout, user } = useAuth();

    return (
        <aside className="sidebar">
            <div className="sb-brand">
                <div className="sb-logo">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><rect x="2" y="2" width="20" height="20" rx="5" fill="#fff" fillOpacity="0.18" /><path d="M7 12h10M7 8h6M7 16h8" stroke="#fff" strokeWidth="2" strokeLinecap="round" /></svg>
                </div>
                <div>
                    <div className="sb-brand-name">FTDS Pro</div>
                    <div className="sb-brand-sub">Billing Terminal 01</div>
                </div>
            </div>

            <nav className="sb-nav">
                {navItems.map(item => (
                    <NavLink key={item.to} to={item.to} className={({ isActive }) => `sb-link ₹{isActive ? 'sb-link-active' : ''}`}>
                        <span className="sb-link-icon">{item.icon}</span>
                        {item.label}
                    </NavLink>
                ))}
            </nav>

            <div className="sb-bottom">
                <button className="btn-create-bill" onClick={() => navigate('/invoicing')}>
                    <span>＋</span> Create New Bill
                </button>
                {/* <div className="sb-util-links">
                    <span className="sb-util-link">✓ Tasks</span>
                    <span className="sb-util-link">⚙ Settings</span>
                </div> */}
                <div className="sb-user">
                    <div className="avatar" style={{ background: '#e0e7ff', color: '#3730a3', fontSize: '11px' }}>{user?.name?.slice(0,2)}</div>
                    <div>
                        <div className="sb-user-name">{user?.name}</div>
                        <div className="sb-user-role">{user?.role}</div>
                    </div>
                </div>
                    <div className="p-4 border-t border-gray-800 shrink-0">
        <button
          onClick={logout}
          className="flex items-center w-full px-4 py-3 text-sm text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg transition"
        >
          Logout
        </button>
      </div>
            </div>
        </aside>
    );
}
