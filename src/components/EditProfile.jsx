import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser, updateUser } from '../services/userService';
import ClientTopBar from './shared/ClientTopBar';
import ClientNavBar from './shared/ClientNavBar';
import Footer from './shared/Footer';

const EditProfile = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [formData, setFormData] = useState({
        id: '',
        userName: '',
        visibleName: '',
        about: '',
        avatarUrl: ''
    });
    const [previewImage, setPreviewImage] = useState('');
    const fileInputRef = useRef(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const userData = await getCurrentUser();
                if (!userData) {
                    navigate('/signin');
                    return;
                }
                setUser(userData);
                setFormData({
                    id: userData.id,
                    userName: userData.userName,
                    visibleName: userData.visibleName || '',
                    about: userData.about || '',
                    avatarUrl: userData.avatarUrl || ''
                });
                setPreviewImage(userData.avatarUrl || '');
            } catch (error) {
                navigate('/signin');
            } finally {
                setIsLoading(false);
            }
        };
        checkAuth();
    }, [navigate]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formDataToSend = new FormData();
            formDataToSend.append('id', formData.id);
            formDataToSend.append('visibleName', formData.visibleName);
            formDataToSend.append('about', formData.about);
            
            if (fileInputRef.current.files[0]) {
                formDataToSend.append('avatar', fileInputRef.current.files[0]);
            }

            await updateUser(formDataToSend);
            navigate(`/profile/${user.id}`);
        } catch (error) {
            console.error('Error updating profile:', error);
        }
    };

    if (isLoading) return <div>Loading...</div>;

    return (
        <>
            <ClientTopBar />
            <ClientNavBar />
            
            <div className="container py-5">
                <div className="row justify-content-center">
                    <div className="col-md-8">
                        <div className="card">
                            <div className="card-body">
                                <h3 className="text-center mb-4">Edit Profile</h3>
                                
                                <div className="text-center mb-4">
                                    <div 
                                        className="position-relative d-inline-block"
                                        style={{ cursor: 'pointer' }}
                                        onClick={() => fileInputRef.current.click()}
                                    >
                                        <img
                                            src={previewImage || '/default-avatar.png'}
                                            alt="Profile"
                                            className="rounded-circle"
                                            style={{
                                                width: '150px',
                                                height: '150px',
                                                objectFit: 'cover'
                                            }}
                                        />
                                        <div 
                                            className="position-absolute w-100 text-center"
                                            style={{
                                                bottom: '0',
                                                backgroundColor: 'rgba(0,0,0,0.5)',
                                                color: 'white',
                                                padding: '5px'
                                            }}
                                        >
                                            Change Photo
                                        </div>
                                    </div>
                                </div>
                                <h4 className='mt-2'></h4>

                                <form onSubmit={handleSubmit}>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleImageChange}
                                        accept="image/*"
                                        style={{ display: 'none' }}
                                    />
                                

                                    <div className="form-group">
                                        <label>Display Name</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="visibleName"
                                            value={formData.visibleName}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>About</label>
                                        <textarea
                                            className="form-control"
                                            name="about"
                                            value={formData.about}
                                            onChange={handleChange}
                                            rows="4"
                                        />
                                    </div>

                                    <div className="text-center">
                                        <button type="submit" className="btn btn-primary">
                                            Save Changes
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </>
    );
};

export default EditProfile;