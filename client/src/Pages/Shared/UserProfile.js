import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import PasswordStrengthMeter from '../UserAuthenticationPages/PasswordStrengthMeter';

const UserProfile = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const [name, setName] = useState(user.name);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPasswordStrength, setShowPasswordStrength] = useState(false);

    // Function to handle profile updates
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Check if current password is provided
        if (!currentPassword) {
            toast.error('Please enter your current password to make changes.');
            return;
        }

        // Determine if either the name or password has been changed
        const hasNameChanged = name !== user.name;
        const hasNewPassword = newPassword.length > 0;

        // If no changes are made, show a message
        if (!hasNameChanged && !hasNewPassword) {
            toast.error('No changes detected.');
            return;
        }

        setIsSubmitting(true);

        try {
            const formData = new FormData();
            formData.append('currentPassword', currentPassword); // Add current password

            // Add name to the form data only if it has changed
            if (hasNameChanged) {
                formData.append('name', name);
            }

            // Add new password to the form data only if it's provided
            if (hasNewPassword) {
                formData.append('newPassword', newPassword);
            }

            // Send a request to update the user
            const response = await axios.put('https://expense-tracker-server-production-e51c.up.railway.app/update-profile', formData, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.status === 200) {
                // Show success toast
                toast.success('Profile updated successfully!');

                // Update local storage if the name was changed
                if (hasNameChanged) {
                    localStorage.setItem('user', JSON.stringify({ ...user, name }));
                    setName(''); // Clear name input
                }

                // Clear password fields
                setCurrentPassword('');
                setNewPassword('');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            toast.error('There was an error updating your profile.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="hero max-h-screen">
            <div className="hero-content flex-col lg:flex-row-reverse">
                <div className="text-center lg:text-left">
                    <h1 className="text-5xl font-bold whitespace-nowrap">Update Profile</h1>
                </div>
                <div className="card w-full max-w-sm shrink-0 shadow-2xl">
                    <form className="card-body" onSubmit={handleSubmit}>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Username</span>
                            </label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="input input-bordered"
                                placeholder={user.name}
                                required
                            />
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Email</span>
                            </label>
                            <input
                                type="email"
                                defaultValue={user.email}
                                className="input input-bordered"
                                readOnly
                            />
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Current Password</span>
                            </label>
                            <input
                                type="password"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                className="input input-bordered"
                                required
                            />
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">New Password</span>
                            </label>
                            <input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                onFocus={() => setShowPasswordStrength(true)}
                                onBlur={() => setShowPasswordStrength(false)}
                                className="input input-bordered"
                            />
                        </div>

                        {showPasswordStrength && <PasswordStrengthMeter password={newPassword} />}

                        <div className="form-control mt-6">
                            <button className="btn btn-primary" type="submit" disabled={isSubmitting}>
                                {isSubmitting ? 'Updating...' : 'UPDATE'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
