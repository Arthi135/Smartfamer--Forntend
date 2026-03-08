import { useAuth } from '../context/AuthContext';

export default function Profile() {
    const { farmer } = useAuth();

    return (
        <div className="page-container">
            <div className="page-header">
                <div className="page-title">👤 My Profile</div>
            </div>
            <div className="profile-info">
                <p><strong>Name:</strong> {farmer?.name || 'N/A'}</p>
                <p><strong>Email:</strong> {farmer?.email || 'N/A'}</p>
                <p><strong>Phone:</strong> {farmer?.phone || 'N/A'}</p>
                {/* add more fields as needed */}
            </div>
        </div>
    );
}