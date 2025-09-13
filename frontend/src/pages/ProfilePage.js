import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useForm } from 'react-hook-form';
import { FiUser, FiMail, FiLock, FiEdit2, FiSave, FiX } from 'react-icons/fi';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const ProfilePage = () => {
  const { user, updateProfile, changePassword, loading } = useAuth();
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    formState: { errors: profileErrors, isSubmitting: isProfileSubmitting },
    reset: resetProfile,
  } = useForm({
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
    },
  });

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    formState: { errors: passwordErrors, isSubmitting: isPasswordSubmitting },
    reset: resetPassword,
    watch,
  } = useForm();

  const newPassword = watch('newPassword');

  const onProfileSubmit = async (data) => {
    const result = await updateProfile(data);
    if (result.success) {
      setIsEditingProfile(false);
    }
  };

  const onPasswordSubmit = async (data) => {
    const result = await changePassword(data.currentPassword, data.newPassword);
    if (result.success) {
      setIsChangingPassword(false);
      resetPassword();
    }
  };

  const cancelProfileEdit = () => {
    setIsEditingProfile(false);
    resetProfile({
      name: user?.name || '',
      email: user?.email || '',
    });
  };

  const cancelPasswordChange = () => {
    setIsChangingPassword(false);
    resetPassword();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading profile..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary-50 py-12">
      <div className="container-custom max-w-4xl">
        <div className="bg-white rounded-lg shadow-soft overflow-hidden">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-primary-600 to-primary-700 px-6 py-8">
            <div className="flex items-center">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mr-6">
                <FiUser className="w-10 h-10 text-primary-600" />
              </div>
              <div className="text-white">
                <h1 className="text-3xl font-heading font-bold">{user?.name}</h1>
                <p className="text-primary-100">{user?.email}</p>
                <p className="text-primary-200 text-sm mt-1">
                  Member since {new Date(user?.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Profile Information */}
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-heading font-semibold text-secondary-900">
                    Profile Information
                  </h2>
                  {!isEditingProfile && (
                    <button
                      onClick={() => setIsEditingProfile(true)}
                      className="btn-outline btn-sm flex items-center"
                    >
                      <FiEdit2 className="w-4 h-4 mr-2" />
                      Edit
                    </button>
                  )}
                </div>

                {isEditingProfile ? (
                  <form onSubmit={handleProfileSubmit(onProfileSubmit)} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-1">
                        Full Name
                      </label>
                      <input
                        {...registerProfile('name', {
                          required: 'Name is required',
                          minLength: {
                            value: 2,
                            message: 'Name must be at least 2 characters',
                          },
                        })}
                        type="text"
                        className={`input ${profileErrors.name ? 'input-error' : ''}`}
                      />
                      {profileErrors.name && (
                        <p className="mt-1 text-sm text-accent-600">
                          {profileErrors.name.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-1">
                        Email Address
                      </label>
                      <input
                        {...registerProfile('email', {
                          required: 'Email is required',
                          pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: 'Invalid email address',
                          },
                        })}
                        type="email"
                        className={`input ${profileErrors.email ? 'input-error' : ''}`}
                      />
                      {profileErrors.email && (
                        <p className="mt-1 text-sm text-accent-600">
                          {profileErrors.email.message}
                        </p>
                      )}
                    </div>

                    <div className="flex space-x-3">
                      <button
                        type="submit"
                        disabled={isProfileSubmitting}
                        className="btn-primary flex items-center disabled:opacity-50"
                      >
                        {isProfileSubmitting ? (
                          <>
                            <LoadingSpinner size="sm" color="white" className="mr-2" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <FiSave className="w-4 h-4 mr-2" />
                            Save Changes
                          </>
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={cancelProfileEdit}
                        className="btn-outline flex items-center"
                      >
                        <FiX className="w-4 h-4 mr-2" />
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-secondary-500 mb-1">
                        Full Name
                      </label>
                      <p className="text-secondary-900">{user?.name}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-secondary-500 mb-1">
                        Email Address
                      </label>
                      <p className="text-secondary-900">{user?.email}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-secondary-500 mb-1">
                        Account Type
                      </label>
                      <span className={`badge ${user?.role === 'admin' ? 'badge-primary' : 'badge-secondary'}`}>
                        {user?.role === 'admin' ? 'Administrator' : 'User'}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Change Password */}
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-heading font-semibold text-secondary-900">
                    Change Password
                  </h2>
                  {!isChangingPassword && (
                    <button
                      onClick={() => setIsChangingPassword(true)}
                      className="btn-outline btn-sm flex items-center"
                    >
                      <FiLock className="w-4 h-4 mr-2" />
                      Change
                    </button>
                  )}
                </div>

                {isChangingPassword ? (
                  <form onSubmit={handlePasswordSubmit(onPasswordSubmit)} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-1">
                        Current Password
                      </label>
                      <input
                        {...registerPassword('currentPassword', {
                          required: 'Current password is required',
                        })}
                        type="password"
                        className={`input ${passwordErrors.currentPassword ? 'input-error' : ''}`}
                      />
                      {passwordErrors.currentPassword && (
                        <p className="mt-1 text-sm text-accent-600">
                          {passwordErrors.currentPassword.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-1">
                        New Password
                      </label>
                      <input
                        {...registerPassword('newPassword', {
                          required: 'New password is required',
                          minLength: {
                            value: 6,
                            message: 'Password must be at least 6 characters',
                          },
                        })}
                        type="password"
                        className={`input ${passwordErrors.newPassword ? 'input-error' : ''}`}
                      />
                      {passwordErrors.newPassword && (
                        <p className="mt-1 text-sm text-accent-600">
                          {passwordErrors.newPassword.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-1">
                        Confirm New Password
                      </label>
                      <input
                        {...registerPassword('confirmPassword', {
                          required: 'Please confirm your new password',
                          validate: (value) =>
                            value === newPassword || 'Passwords do not match',
                        })}
                        type="password"
                        className={`input ${passwordErrors.confirmPassword ? 'input-error' : ''}`}
                      />
                      {passwordErrors.confirmPassword && (
                        <p className="mt-1 text-sm text-accent-600">
                          {passwordErrors.confirmPassword.message}
                        </p>
                      )}
                    </div>

                    <div className="flex space-x-3">
                      <button
                        type="submit"
                        disabled={isPasswordSubmitting}
                        className="btn-primary flex items-center disabled:opacity-50"
                      >
                        {isPasswordSubmitting ? (
                          <>
                            <LoadingSpinner size="sm" color="white" className="mr-2" />
                            Changing...
                          </>
                        ) : (
                          <>
                            <FiLock className="w-4 h-4 mr-2" />
                            Change Password
                          </>
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={cancelPasswordChange}
                        className="btn-outline flex items-center"
                      >
                        <FiX className="w-4 h-4 mr-2" />
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="text-secondary-600">
                    <p>Keep your account secure by using a strong password.</p>
                    <p className="text-sm mt-2">
                      Last changed: {user?.updatedAt ? new Date(user.updatedAt).toLocaleDateString() : 'Never'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
