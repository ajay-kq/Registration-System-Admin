import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Database } from 'lucide-react';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        // Allow any input for demonstration purposes
        navigate('/dashboard');
    };

    return (
        <div style={styles.container}>
            <div style={styles.logoArea}>
                <Database size={28} color="var(--accent-primary)" />
                <h1 style={styles.brandTitle}>RC Aquatics <span style={styles.brandSubtitle}>Admin Central</span></h1>
            </div>

            <div className="surface-panel" style={styles.loginCard}>
                <h2 style={styles.signInText}>Sign-In</h2>

                <form onSubmit={handleLogin} style={styles.form}>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Email (Any email works for demo)</label>
                        <input
                            type="text"
                            className="admin-input"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Password (Any password works)</label>
                        <input
                            type="password"
                            className="admin-input"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className="admin-btn" style={styles.submitBtn}>
                        Sign-In Securely
                    </button>
                </form>

                <p style={styles.termsText}>
                    By continuing, you log into the RC Aquatics Secure Admin Environment. Access is restricted to trusted staff and tracked thoroughly.
                </p>
            </div>

            <div style={styles.footerLinks}>
                <a href="#">Conditions of Use</a>
                <a href="#">Privacy Notice</a>
                <a href="#">Help</a>
            </div>
            <p style={styles.copyright}>© 2026, RC Aquatics, Inc. or its affiliates</p>
        </div>
    );
}

const styles: { [key: string]: React.CSSProperties } = {
    container: {
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        paddingTop: '60px',
        backgroundColor: '#ffffff', // Clean white background for login page
    },
    logoArea: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        marginBottom: '24px',
    },
    brandTitle: {
        fontSize: '1.6rem',
        fontWeight: 600,
        color: '#000',
    },
    brandSubtitle: {
        fontWeight: 400,
        color: 'var(--text-secondary)',
    },
    loginCard: {
        width: '100%',
        maxWidth: '350px',
        padding: '24px 26px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        marginBottom: '24px',
    },
    signInText: {
        fontSize: '1.75rem',
        fontWeight: 400,
        marginBottom: '8px',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
    },
    inputGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
    },
    label: {
        fontSize: '0.85rem',
        fontWeight: 600,
        color: '#111',
    },
    submitBtn: {
        width: '100%',
        marginTop: '8px',
        padding: '10px',
        boxShadow: '0 2px 5px rgba(15, 17, 17, 0.15)',
    },
    termsText: {
        fontSize: '0.75rem',
        color: '#111',
        marginTop: '12px',
        lineHeight: 1.4,
    },
    footerLinks: {
        display: 'flex',
        gap: '16px',
        fontSize: '0.75rem',
        borderTop: '1px solid #e7e7e7',
        paddingTop: '30px',
        width: '100%',
        maxWidth: '350px',
        justifyContent: 'center',
    },
    copyright: {
        fontSize: '0.75rem',
        color: '#555',
        marginTop: '8px',
    }
};
