import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Sidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        navigate('/admin/adminlogin');
    };

    return (
        <div style={styles.sidebar}>
            <h2 style={styles.header}>Admin Panel</h2>
            <ul style={styles.navList}>
            <li
                    style={{
                        ...styles.navItem,
                        backgroundColor: location.pathname === '/admin/admingetAllUsers' ? '#1abc9c' : '#34495e',
                    }}
                    onClick={() => navigate('/admin/admingetAllUsers')}
                >
                    Users
                </li>
                <li
                    style={{
                        ...styles.navItem,
                        backgroundColor: location.pathname === '/admin/adminAllPost' ? '#1abc9c' : '#34495e',
                    }}
                    onClick={() => navigate('/admin/adminAllPost')}
                >
                    Posts
                </li>
               
                <li style={styles.navItem} onClick={() => navigate('/admin/adminlogin')}
                >Logout</li>
            </ul>
        </div>
    );
};


const styles = {
    sidebar: {
        width: '200px',
        height: '100vh',
        backgroundColor: '#2c3e50',
        color: 'white',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        paddingTop: '20px',
        position: 'fixed',
    },
    header: {
        fontSize: '20px',
        fontWeight: 'bold',
        marginBottom: '20px',
    },
    navList: {
        listStyleType: 'none',
        padding: 0,
        width: '100%',
    },
    navItem: {
        padding: '15px',
        textAlign: 'center',
        cursor: 'pointer',
        fontSize: '16px',
        width: '100%',
        color: 'white',
        backgroundColor: '#34495e',
        marginBottom: '5px',
    },
    navItemHover: {
        backgroundColor: '#1abc9c',
    },
};

export default Sidebar;
