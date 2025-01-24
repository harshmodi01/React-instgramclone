import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from 'sonner';
import Sidebar from './adminSidebar'; // Import the Sidebar component

const AdminAllPost = () => {
    const [posts, setPosts] = useState([]);

    const getAllPosts = async () => {
        try {
            const res = await axios.get('http://localhost:3000/api/v1/user/admin/adminAllPost', { withCredentials: true });
            if (res.data.success) {
                setPosts(res.data.posts);
            } else {
                toast.error(res.data.message);
            }
        } catch (error) {
            console.log("Error fetching posts:", error);
        }
    };

    const handleDelete = async (id) => {
        try {
            const res = await axios.delete(`http://localhost:3000/api/v1/user/admin/deletePostbyadmin/${id}`, { withCredentials: true });
            if (res.data.success) {
                setPosts(posts.filter(post => post._id !== id));
                toast.success("Post deleted successfully!");
            } else {
                console.log("Failed to delete post:", res.data.message);
            }
        } catch (error) {
            console.log("Error deleting post:", error);
        }
    };

    useEffect(() => {
        getAllPosts();
    }, []);

    return (
        <div style={styles.pageContainer}>
            <Sidebar /> {/* Sidebar included directly on this page */}
            <div style={styles.container}>
                <h2 style={styles.mainHeader}>Posts</h2>
                <div style={styles.tableContainer}>
                    <div style={styles.headerRow}>
                        <span style={styles.headerCell}>Author</span>
                        <span style={styles.headerCell}>Caption</span>
                        <span style={styles.headerCell}>Image</span>
                        <span style={styles.headerCell}>Likes</span>
                        <span style={styles.headerCell}>Actions</span>
                    </div>
                    {posts.length > 0 ? (
                        posts.map((post) => (
                            <div key={post._id} style={styles.row}>
                                <span style={styles.cell}>{post.author?.username || "Unknown"}</span>
                                <span style={styles.cell}>{post.caption}</span>
                                <span style={styles.cell}>
                                    <img src={post.image} alt="Post" style={styles.image} />
                                </span>
                                <span style={styles.cell}>{post.likes.length}</span>
                                <span style={styles.cell}>
                                    <button style={styles.deleteButton} onClick={() => handleDelete(post._id)}>Delete</button>
                                </span>
                            </div>
                        ))
                    ) : (
                        <div style={styles.noDataMessage}>No posts available</div>
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
    tableContainer: {
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
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
        backgroundColor: '#fff',
    },
    headerCell: {
        flex: 1,
        padding: '0 8px',
        textAlign: 'left',
        minWidth: '100px',
        fontWeight: 'bold',
    },
    cell: {
        flex: 1,
        padding: '0 8px',
        textAlign: 'left',
        minWidth: '100px',
        whiteSpace: 'normal',
        wordWrap: 'break-word',
    },
    image: {
        width: '50px',
        height: '50px',
        objectFit: 'cover',
        borderRadius: '8px',
    },
    deleteButton: {
        padding: '6px 12px',
        color: 'white',
        backgroundColor: 'red',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
    },
    noDataMessage: {
        color: '#555',
        fontSize: '18px',
        textAlign: 'center',
        padding: '20px',
        fontStyle: 'italic',
    },
};

export default AdminAllPost;
