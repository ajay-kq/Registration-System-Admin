import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from './utils/api';
import {
    Users,
    ShoppingCart,
    CreditCard,
    Truck,
    MessageSquare,
    Settings,
    Shield,
    Search,
    ChevronDown
} from 'lucide-react';

export default function Dashboard() {
    const navigate = useNavigate();
    const [members, setMembers] = useState<any[]>([]);
    const [stats, setStats] = useState({ total: 0, pending: 0, verified: 0 });
    const [adminUser, setAdminUser] = useState<any>(null);
    const [showSettings, setShowSettings] = useState(false);

    // Settings state
    const [profileEmail, setProfileEmail] = useState('');
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [settingsMsg, setSettingsMsg] = useState({ type: '', text: '' });

    useEffect(() => {
        // Hydrate admin session
        const storedUser = localStorage.getItem('adminUser');
        if (storedUser) {
            const parsed = JSON.parse(storedUser);
            setAdminUser(parsed);
            setProfileEmail(parsed.email);
        }

        // Fetch Live Member Data
        const fetchMembers = async () => {
            try {
                // Since there is no /members route yet based on the task, we will fetch from /auth/users if it exists, or create the route.
                // Assuming we have `/members` or similar. Let's hit `/members`.
                const res = await api.get('/members');
                if (res.data.success) {
                    setMembers(res.data.data);

                    // Calculate stats based on actual live data values
                    const pending = res.data.data.filter((m: any) => !m.status || m.status === 'inactive' || m.status === 'Pending').length;
                    const verified = res.data.data.filter((m: any) => m.status === 'active' || m.status === 'Verified').length;

                    setStats({
                        total: res.data.data.length,
                        pending,
                        verified
                    });
                }
            } catch (err) {
                console.error("Failed to fetch members:", err);
                alert("Session expired or unauthorized. Please login again.");
                navigate('/login');
            }
        };

        fetchMembers();
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        navigate('/login');
    };

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setSettingsMsg({ type: 'info', text: 'Updating profile...' });
        try {
            const res = await api.put('/auth/profile', { email: profileEmail });
            if (res.data.success) {
                setSettingsMsg({ type: 'success', text: 'Profile updated successfully!' });
                setAdminUser(res.data.user);
                localStorage.setItem('adminUser', JSON.stringify(res.data.user));
            }
        } catch (err: any) {
            setSettingsMsg({ type: 'error', text: err.response?.data?.message || 'Failed to update profile' });
        }
    };

    const handleUpdatePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setSettingsMsg({ type: 'info', text: 'Updating password...' });
        try {
            const res = await api.put('/auth/password', { old_password: oldPassword, new_password: newPassword });
            if (res.data.success) {
                setSettingsMsg({ type: 'success', text: 'Password updated successfully!' });
                setOldPassword('');
                setNewPassword('');
            }
        } catch (err: any) {
            setSettingsMsg({ type: 'error', text: err.response?.data?.message || 'Failed to update password' });
        }
    };

    const handleResetDB = async () => {
        if (!window.confirm("WARNING: This will wipe all Admin collections (Orders, Staff, Logs) for testing purposes. Member registrations are safe. Proceed?")) return;

        try {
            // Tries relative path (Vercel) or fallback to local port 5000
            const apiUrl = window.location.hostname === 'localhost' ? 'http://localhost:5000/api/v1/testing/reset-db' : '/api/v1/testing/reset-db';
            const res = await fetch(apiUrl, { method: 'POST' });
            const data = await res.json();
            if (data.success) {
                alert("Database successfully reset!");
            } else {
                alert("Error resetting DB: " + data.message);
            }
        } catch (err) {
            alert("Failed to reach testing endpoint.");
        }
    };

    return (
        <div style={styles.layout}>
            {/* Top Header Navigation (AWS Style) */}
            <header style={styles.topbar}>
                <div style={styles.topbarLeft}>
                    <div style={styles.logoArea}>
                        <Shield color="var(--accent-primary)" size={18} />
                        <span style={styles.logoText}>RC Aquatics</span>
                    </div>
                    <nav style={styles.headerNav}>
                        <span style={styles.headerNavItemActive}>Services <ChevronDown size={14} /></span>
                        <span style={styles.headerNavItem}>Members</span>
                        <span style={styles.headerNavItem}>Orders</span>
                    </nav>
                </div>

                <div style={styles.topbarCenter}>
                    <div style={styles.searchBar}>
                        <Search size={16} color="#aaa" />
                        <input type="text" placeholder="Search orders, members, logs..." style={styles.searchInput} />
                    </div>
                </div>

                <div style={styles.topbarRight}>
                    <div style={styles.accountMenu} onClick={handleLogout}>
                        <span>{adminUser ? adminUser.email : 'Loading...'}</span>
                        <ChevronDown size={14} />
                    </div>
                    <Settings size={18} color="#ddd" style={{ cursor: 'pointer' }} onClick={() => setShowSettings(true)} />
                </div>
            </header>

            <div style={styles.mainContainer}>
                {/* Left Sidebar Menu */}
                <aside style={styles.sidebar}>
                    <div style={styles.sidebarSection}>
                        <h4 style={styles.sidebarHeader}>Core Systems</h4>
                        <SidebarItem icon={<Users size={16} />} label="Member Directory" active />
                        <SidebarItem icon={<ShoppingCart size={16} />} label="Order Management" />
                        <SidebarItem icon={<CreditCard size={16} />} label="Financials" />
                        <SidebarItem icon={<Truck size={16} />} label="Fulfillment Center" />
                    </div>

                    <div style={styles.sidebarSection}>
                        <h4 style={styles.sidebarHeader}>Operations</h4>
                        <SidebarItem icon={<MessageSquare size={16} />} label="Messaging Engine" />
                        <SidebarItem icon={<Shield size={16} />} label="Security & Audit" />
                    </div>

                    <div style={{ padding: '24px 16px', marginTop: 'auto' }}>
                        <button
                            onClick={handleResetDB}
                            style={{ ...styles.adminBtn, backgroundColor: '#dc3545', color: 'white', border: 'none', width: '100%' }}
                        >
                            Reset Testing DB
                        </button>
                        <p style={{ fontSize: '0.7rem', color: '#888', textAlign: 'center', marginTop: '8px' }}>Temp testing tool</p>
                    </div>
                </aside>

                {/* Content Area */}
                <main style={styles.content}>
                    <div style={styles.pageHeader}>
                        <h1 style={styles.pageTitle}>Member Directory Overview</h1>
                        <button className="admin-btn">Generate Report</button>
                    </div>

                    {/* Quick Metrics */}
                    <div style={styles.metricsGrid}>
                        <MetricCard title="Total Registered Members" value={stats.total.toString()} trend="Live sync" />
                        <MetricCard title="Pending Verifications" value={stats.pending.toString()} subtext="Awaiting review" />
                        <MetricCard title="Verified Members" value={stats.verified.toString()} subtext="Active users" />
                        <MetricCard title="System Alerts" value="0" subtext="All systems operational" />
                    </div>

                    {/* Data Table Area */}
                    <div className="surface-panel" style={styles.tableContainer}>
                        <div style={styles.tableToolbar}>
                            <h3 style={styles.tableTitle}>Recent Registrations</h3>
                            <div style={styles.tableActions}>
                                <input type="text" placeholder="Filter by phone or email..." className="admin-input" style={{ width: '250px', padding: '6px 10px' }} />
                                <button className="admin-btn" style={{ padding: '6px 12px' }}>Export CSV</button>
                            </div>
                        </div>

                        <table style={styles.table}>
                            <thead>
                                <tr>
                                    <th style={styles.th}>Member ID</th>
                                    <th style={styles.th}>Name</th>
                                    <th style={styles.th}>Email Address</th>
                                    <th style={styles.th}>Status</th>
                                    <th style={styles.th}>Registered At</th>
                                    <th style={styles.th}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {members.length === 0 ? (
                                    <tr><td colSpan={6} style={{ padding: '20px', textAlign: 'center' }}>No members found.</td></tr>
                                ) : (
                                    members.map((member) => (
                                        <TableRow
                                            key={member._id}
                                            id={member._id.substring(member._id.length - 6).toUpperCase()}
                                            name={member.name || (member.first_name ? `${member.first_name} ${member.last_name || ''}` : member.username) || 'Unknown'}
                                            email={member.email || member.phone || member.phone_number || 'No Contact'}
                                            status={member.status || member.accountStatus || 'Pending'}
                                            date={new Date(member.createdAt).toLocaleDateString()}
                                        />
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </main>
            </div>

            {/* Settings Modal */}
            {showSettings && (
                <div style={styles.modalOverlay}>
                    <div style={styles.modalContent}>
                        <div style={styles.modalHeader}>
                            <h2>Account Settings</h2>
                            <button onClick={() => { setShowSettings(false); setSettingsMsg({ type: '', text: '' }); }} style={styles.closeBtn}>&times;</button>
                        </div>

                        {settingsMsg.text && (
                            <div style={{ ...styles.msgAlert, backgroundColor: settingsMsg.type === 'error' ? '#f8d7da' : settingsMsg.type === 'success' ? '#d4edda' : '#e2e3e5', color: settingsMsg.type === 'error' ? '#721c24' : settingsMsg.type === 'success' ? '#155724' : '#383d41' }}>
                                {settingsMsg.text}
                            </div>
                        )}

                        <div style={styles.modalBody}>
                            <form onSubmit={handleUpdateProfile} style={styles.settingsForm}>
                                <h3>Update Profile</h3>
                                <div className="form-group" style={{ marginBottom: '15px' }}>
                                    <label style={{ display: 'block', marginBottom: '5px' }}>Email Address</label>
                                    <input type="email" value={profileEmail} onChange={(e) => setProfileEmail(e.target.value)} className="admin-input" required style={{ width: '100%', padding: '8px' }} />
                                </div>
                                <button type="submit" className="admin-btn" style={{ width: '100%' }}>Save Profile</button>
                            </form>

                            <hr style={{ margin: '20px 0', border: 'none', borderTop: '1px solid #ddd' }} />

                            <form onSubmit={handleUpdatePassword} style={styles.settingsForm}>
                                <h3>Change Password</h3>
                                <div className="form-group" style={{ marginBottom: '15px' }}>
                                    <label style={{ display: 'block', marginBottom: '5px' }}>Current Password</label>
                                    <input type="password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} className="admin-input" required style={{ width: '100%', padding: '8px' }} />
                                </div>
                                <div className="form-group" style={{ marginBottom: '15px' }}>
                                    <label style={{ display: 'block', marginBottom: '5px' }}>New Password</label>
                                    <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="admin-input" required style={{ width: '100%', padding: '8px' }} />
                                </div>
                                <button type="submit" className="admin-btn" style={{ width: '100%', backgroundColor: '#007185', color: 'white' }}>Update Password</button>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// Subcomponents
function SidebarItem({ icon, label, active = false }: { icon: React.ReactNode, label: string, active?: boolean }) {
    return (
        <div style={{ ...styles.sidebarItem, ...(active ? styles.sidebarItemActive : {}) }}>
            {icon}
            <span>{label}</span>
        </div>
    );
}

function MetricCard({ title, value, trend, subtext }: { title: string, value: string, trend?: string, subtext?: string }) {
    return (
        <div className="surface-panel" style={styles.metricCard}>
            <div style={styles.metricTitle}>{title}</div>
            <div style={styles.metricValue}>{value}</div>
            {trend && <div style={styles.metricTrend}>{trend}</div>}
            {subtext && <div style={styles.metricSubtext}>{subtext}</div>}
        </div>
    );
}

function TableRow({ id, name, email, status, date }: { id: string, name: string, email: string, status: string, date: string }) {
    let statusColor = '#007185'; // Verified (blue)
    if (status === 'Pending') statusColor = '#ff9900'; // Amazon Orange
    if (status === 'Suspended') statusColor = '#d13212'; // Amazon Red

    return (
        <tr style={styles.tr}>
            <td style={styles.td}><a href="#">{id}</a></td>
            <td style={styles.td}>{name}</td>
            <td style={styles.td}>{email}</td>
            <td style={styles.td}><span style={{ color: statusColor, fontWeight: 500 }}>{status}</span></td>
            <td style={styles.td}>{date}</td>
            <td style={styles.td}><a href="#">View</a> | <a href="#">Edit</a></td>
        </tr>
    );
}

// Styles
const styles: { [key: string]: React.CSSProperties } = {
    layout: {
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        width: '100vw',
    },
    topbar: {
        height: '40px', // Very slim, dense header
        backgroundColor: 'var(--bg-sidebar)',
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 16px',
        fontSize: '0.85rem',
    },
    topbarLeft: { display: 'flex', alignItems: 'center', gap: '24px' },
    logoArea: { display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700 },
    logoText: { fontSize: '0.95rem' },
    headerNav: { display: 'flex', alignItems: 'center', gap: '16px' },
    headerNavItem: { cursor: 'pointer', color: '#ccc' },
    headerNavItemActive: { cursor: 'pointer', color: '#fff', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' },

    topbarCenter: { flex: 1, display: 'flex', justifyContent: 'center' },
    searchBar: {
        display: 'flex',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: '4px',
        padding: '4px 8px',
        width: '100%',
        maxWidth: '400px',
        gap: '8px',
    },
    searchInput: { border: 'none', outline: 'none', width: '100%', fontSize: '0.8rem', color: '#000' },

    topbarRight: { display: 'flex', alignItems: 'center', gap: '16px' },
    accountMenu: { display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' },

    mainContainer: {
        display: 'flex',
        flex: 1,
        overflow: 'hidden',
    },
    sidebar: {
        width: '240px',
        backgroundColor: '#fff',
        borderRight: '1px solid var(--border-color)',
        display: 'flex',
        flexDirection: 'column',
    },
    sidebarSection: {
        padding: '16px 0',
        borderBottom: '1px solid #f0f2f2',
    },
    sidebarHeader: {
        fontSize: '0.8rem',
        textTransform: 'uppercase',
        fontWeight: 700,
        color: 'var(--text-secondary)',
        padding: '0 16px 8px 16px',
        letterSpacing: '0.5px',
    },
    sidebarItem: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '8px 16px',
        color: 'var(--text-primary)',
        cursor: 'pointer',
        fontSize: '0.9rem',
    },
    sidebarItemActive: {
        backgroundColor: '#f1fdfc', // Very subtle blue tint
        color: 'var(--accent-link)',
        fontWeight: 600,
        borderLeft: '3px solid var(--accent-link)',
    },

    content: {
        flex: 1,
        padding: '24px',
        overflowY: 'auto',
    },
    pageHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
    },
    pageTitle: {
        fontSize: '1.5rem',
        fontWeight: 500,
    },
    metricsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '16px',
        marginBottom: '24px',
    },
    metricCard: {
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
    },
    metricTitle: { fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 },
    metricValue: { fontSize: '1.75rem', fontWeight: 400 },
    metricTrend: { fontSize: '0.8rem', color: '#007600' }, // Amazon green
    metricSubtext: { fontSize: '0.8rem', color: 'var(--text-secondary)' },

    tableContainer: {
        width: '100%',
    },
    tableToolbar: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '12px 16px',
        borderBottom: '1px solid var(--border-color)',
        backgroundColor: '#f6f6f6', // Slight off-white toolbar
        borderTopLeftRadius: '8px',
        borderTopRightRadius: '8px',
    },
    tableTitle: { fontSize: '1rem', fontWeight: 600 },
    tableActions: { display: 'flex', gap: '8px', alignItems: 'center' },

    table: {
        width: '100%',
        borderCollapse: 'collapse',
        fontSize: '0.9rem',
        textAlign: 'left',
    },
    th: {
        padding: '10px 16px',
        borderBottom: '1px solid var(--border-color)',
        fontWeight: 600,
        color: 'var(--text-secondary)',
        backgroundColor: '#fafafa',
    },
    tr: {
        borderBottom: '1px solid var(--border-color)',
    },
    td: {
        padding: '12px 16px',
        verticalAlign: 'middle',
    },
    modalOverlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
    },
    modalContent: {
        backgroundColor: '#fff',
        padding: '24px',
        borderRadius: '8px',
        width: '400px',
        maxWidth: '90%',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
    },
    modalHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '16px',
        borderBottom: '1px solid #eee',
        paddingBottom: '8px'
    },
    closeBtn: {
        background: 'none',
        border: 'none',
        fontSize: '1.5rem',
        cursor: 'pointer',
        color: '#666'
    },
    modalBody: {
        display: 'flex',
        flexDirection: 'column'
    },
    settingsForm: {
        display: 'flex',
        flexDirection: 'column',
    },
    msgAlert: {
        padding: '10px',
        borderRadius: '4px',
        marginBottom: '16px',
        fontSize: '0.9rem',
        textAlign: 'center'
    }
};
