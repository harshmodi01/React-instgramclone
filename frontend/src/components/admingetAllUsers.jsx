// // import axios from "axios";
// // import { useEffect, useState } from "react";

// // const AdmingetAllUsers = () => {
// //     const [users, setUsers] = useState([]);
// //     const [successMessage, setSuccessMessage] = useState("");
// //     const [errorMessage, setErrorMessage] = useState("");

// //     const getAllUsers = async () => {
// //         try {
// //             const res = await axios.get('http://localhost:3000/api/v1/user/admin/admingetAllUsers', { withCredentials: true });
// //             if (res.data.success) {
// //                 setUsers(res.data.users);
// //             } else {
// //                 setUsers([]);
// //                 setErrorMessage(res.data.message);
// //             }
// //         } catch (error) {
// //             console.log("Error fetching users:", error);
// //         }
// //     };

// //     const handleDelete = async (id) => {
// //         try {
// //             const res = await axios.delete(`http://localhost:3000/api/v1/user/admin/deleteUser/${id}`, { withCredentials: true });
// //             if (res.data.success) {
// //                 setUsers(users.filter(user => user._id !== id));
// //                 setSuccessMessage("User deleted successfully!");
// //                 setTimeout(() => setSuccessMessage(""), 3000);
// //             } else {
// //                 console.log("Failed to delete user:", res.data.message);
// //             }
// //         } catch (error) {
// //             console.log("Error deleting user:", error);
// //         }
// //     };

// //     useEffect(() => {
// //         getAllUsers();
// //     }, []);

// //     return (
// //         <div style={styles.container}>
// //             <h2 style={styles.mainHeader}>Users</h2> {/* Main header */}
            
// //             {successMessage && <div style={styles.successMessage}>{successMessage}</div>}
// //             {errorMessage && <div style={styles.errorMessage}>{errorMessage}</div>}
            
// //             {/* Header and Rows container */}
// //             <div style={styles.tableContainer}>
// //                 {/* Header Row */}
// //                 <div style={styles.headerRow}>
// //                     <span style={styles.headerCell}>Username</span>
// //                     <span style={styles.headerCell}>Email</span>
// //                     <span style={styles.headerCell}>Bio</span>
// //                     <span style={styles.headerCell}>Gender</span>
// //                     <span style={styles.headerCell}>Posts</span>
// //                     <span style={styles.headerCell}>Bookmarks</span>
// //                     <span style={styles.headerCell}>Followers</span>
// //                     <span style={styles.headerCell}>Following</span>
// //                     <span style={styles.headerCell}>Actions</span>
// //                 </div>
                
// //                 {/* User Rows */}
// //                 {users.length > 0 ? (
// //                     users.map((user) => (
// //                         <div key={user._id} style={styles.row}>
// //                             <span style={styles.cell}>{user.username}</span>
// //                             <span style={styles.cell}>{user.email}</span>
// //                             <span style={styles.bioCell}>{user.bio}</span>
// //                             <span style={styles.cell}>{user.gender}</span>
// //                             <span style={styles.cell}>{user.posts.length}</span>
// //                             <span style={styles.cell}>{user.bookmarks.length}</span>
// //                             <span style={styles.cell}>{user.followers.length}</span>
// //                             <span style={styles.cell}>{user.following.length}</span>
// //                             <button style={styles.deleteButton} onClick={() => handleDelete(user._id)}>Delete</button>
// //                         </div>
// //                     ))
// //                 ) : (
// //                     <div style={styles.noDataMessage}>No users available</div>
// //                 )}
// //             </div>
// //         </div>
// //     );
// // };const styles = {
// //     container: {
// //         display: 'flex',
// //         flexDirection: 'column',
// //         width: '90%',
// //         margin: '20px auto',
// //         padding: '20px',
// //     },
// //     mainHeader: {
// //         fontSize: '24px',
// //         fontWeight: 'bold',
// //         marginBottom: '20px',
// //         textAlign: 'center',
// //     },
// //     successMessage: {
// //         color: 'green',
// //         fontWeight: 'bold',
// //         marginBottom: '10px',
// //         textAlign: 'center',
// //     },
// //     errorMessage: {
// //         color: 'red',
// //         fontWeight: 'bold',
// //         marginBottom: '10px',
// //         textAlign: 'center',
// //     },
// //     tableContainer: {
// //         border: '1px solid #ddd',
// //         borderRadius: '8px',
// //         overflowX: 'auto',
// //     },
// //     headerRow: {
// //         display: 'flex',
// //         backgroundColor: '#f0f0f0',
// //         padding: '10px',
// //         fontWeight: 'bold',
// //         borderBottom: '1px solid #ddd',
// //     },
// //     row: {
// //         display: 'flex',
// //         padding: '10px',
// //         borderBottom: '1px solid #ddd',
// //         alignItems: 'center',
// //     },
// //     headerCell: {
// //         flex: 1,
// //         padding: '0 10px',
// //         textAlign: 'left',
// //         minWidth: '100px',
// //         fontWeight: 'bold',
// //     },
// //     cell: {
// //         flex: 1,
// //         padding: '0 10px',
// //         textAlign: 'left',
// //         minWidth: '100px',
// //         whiteSpace: 'normal',
// //         wordWrap: 'break-word',
// //     },
// //     bioCell: {
// //         flex: 2,
// //         padding: '0 10px',
// //         textAlign: 'left',
// //         minWidth: '150px',
// //         wordWrap: 'break-word',
// //         whiteSpace: 'normal',
// //     },
// //     deleteButton: {
// //         padding: '6px 12px',
// //         color: 'white',
// //         backgroundColor: 'red',
// //         border: 'none',
// //         borderRadius: '4px',
// //         cursor: 'pointer',
// //         minWidth: '80px',
// //     },
// //     noDataMessage: {
// //         color: '#555',
// //         fontSize: '18px',
// //         textAlign: 'center',
// //         padding: '20px',
// //         fontStyle: 'italic',
// //     },
// // };


import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from './adminSidebar'; // Import the Sidebar component

const AdmingetAllUsers = () => {
    const [users, setUsers] = useState([]);
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const getAllUsers = async () => {
        try {
            const res = await axios.get('http://localhost:3000/api/v1/user/admin/admingetAllUsers', { withCredentials: true });
            if (res.data.success) {
                setUsers(res.data.users);
            } else {
                setUsers([]);
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log("Error fetching users:", error);
        }
    };

    const handleDelete = async (id) => {
        try {
            const res = await axios.delete(`http://localhost:3000/api/v1/user/admin/deleteUser/${id}`, { withCredentials: true });
            if (res.data.success) {
                setUsers(users.filter(user => user._id !== id));
                toast.success("User deleted successfully!");
                setTimeout(() => setSuccessMessage(""), 3000);
            } else {
                console.log("Failed to delete user:", res.data.message);
            }
        } catch (error) {
            console.log("Error deleting user:", error);
        }
    };

    useEffect(() => {
        getAllUsers();
    }, []);

    return (
        <div style={styles.pageContainer}>
        <Sidebar /> {/* Sidebar included directly on this page */}
        <div style={styles.container}>
            <h2 style={styles.mainHeader}>Users</h2> {/* Main header */}
            
            {successMessage && <div style={styles.successMessage}>{successMessage}</div>}
            {errorMessage && <div style={styles.errorMessage}>{errorMessage}</div>}
            
            {/* Header and Rows container */}
            <div style={styles.tableContainer}>
                {/* Header Row */}
                <div style={styles.headerRow}>
                    <span style={styles.headerCell}>Username</span>
                    <span style={styles.headerCell}>Email</span>
                    <span style={styles.headerCell}>Bio</span>
                    <span style={styles.headerCell}>Gender</span>
                    <span style={styles.headerCell}>Posts</span>
                    <span style={styles.headerCell}>Bookmarks</span>
                    <span style={styles.headerCell}>Favorites</span>
                    <span style={styles.headerCell}>Followers</span>
                    <span style={styles.headerCell}>Following</span>
                    <span style={styles.headerCell}>Actions</span>
                </div>
                
                {/* User Rows */}
                {users.length > 0 ? (
                    users.map((user) => (
                        <div key={user._id} style={styles.row}>
                            <span style={styles.cell}>{user.username}</span>
                            <span style={styles.cell}>{user.email}</span>
                            <span style={styles.bioCell}>{user.bio}</span>
                            <span style={styles.genderCell}>{user.gender}</span>
                            <span style={styles.cell}>{user.posts.length}</span>
                            <span style={styles.cell}>{user.bookmarks.length}</span>
                            <span style={styles.cell}>{user.favorites.length}</span>
                            <span style={styles.cell}>{user.followers.length}</span>
                            <span style={styles.cell}>{user.following.length}</span>
                            <span style={styles.cell}><button style={styles.deleteButton} onClick={() => handleDelete(user._id)}>Delete</button></span>

                        </div>
                    ))
                ) : (
                    <div style={styles.noDataMessage}>No users available</div>
                )}
            </div>
        </div>
        </div>
    );
};

const styles = {
    pageContainer: {
        display: 'flex',
    },
    container: {
        flex: 1,
        marginLeft: '200px', // Shift the main content to the right to accommodate sidebar width
        padding: '20px',
    },
    mainHeader: {
        fontSize: '24px',
        fontWeight: 'bold',
        marginBottom: '20px',
        textAlign: 'center',
    },
    successMessage: {
        color: 'green',
        fontWeight: 'bold',
        marginBottom: '10px',
        textAlign: 'center',
    },
    errorMessage: {
        color: 'red',
        fontWeight: 'bold',
        marginBottom: '10px',
        textAlign: 'center',
    },
    tableContainer: {
        display: 'flex',
        flexDirection: 'column',
        gap: '10px', // Space between rows
    },
    headerRow: {
        display: 'flex',
        backgroundColor: '#f0f0f0',
        padding: '10px',
        fontWeight: 'bold',
        borderBottom: '1px solid #ddd',
        borderRadius: '8px',
    },
    row: {
        display: 'flex',
        padding: '15px',
        border: '1px solid #ddd',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        alignItems: 'center',
        gap: '5px', // Reduced gap between columns
        backgroundColor: '#fff',
    },
    headerCell: {
        flex: 1,
        padding: '0 8px', // Reduced padding
        textAlign: 'left',
        minWidth: '100px', // Adjusted minimum width for consistency
        fontWeight: 'bold',
    },
    cell: {
        flex: 1,
        padding: '0 8px', // Reduced padding
        textAlign: 'left',
        minWidth: '100px', // Consistent width for cells
        whiteSpace: 'normal',  // Allow text to wrap
        wordWrap: 'break-word',
    },
    genderCell: {
        flex: 1,
        padding: '0 8px',
        textAlign: 'left',
        minWidth: '80px', // Adjusted width for Gender column
        whiteSpace: 'normal',  // Allow text to wrap
        wordWrap: 'break-word',
    },
    bioCell: {
        flex: 1,
        padding: '0 8px',
        textAlign: 'left',
        minWidth: '5px', // Extra width for Bio
        wordWrap: 'break-word',
        whiteSpace: 'normal',  // Allow text to wrap
    },
    deleteButton: {
        padding: '6px 12px',
        color: 'white',
        backgroundColor: 'red',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        minWidth: '70px',
        alignSelf: 'center',
    },
    noDataMessage: {
        color: '#555',
        fontSize: '18px',
        textAlign: 'center',
        padding: '20px',
        fontStyle: 'italic',
    },
};

export default AdmingetAllUsers;
