import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { usersAPI } from '../../services/api';
import { User, Mail, Phone, MapPin, Lock, Save, Camera } from 'lucide-react';
import LoadingSpinner from '../../components/common/LoadingSpinner';

export default function ClientProfile() {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [message, setMessage] = useState({ type: '', text: '' });

  const [profileData, setProfileData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    address: ''
  });

  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
  });

  useEffect(() => {
    if (user) {
      setProfileData({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || ''
      });
    }
  }, [user]);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await usersAPI.updateProfile(profileData);
      if (response.data?.user) {
        updateUser(response.data.user);
      }
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to update profile' });
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    if (passwordData.new_password !== passwordData.confirm_password) {
      setMessage({ type: 'error', text: 'New passwords do not match' });
      return;
    }

    if (passwordData.new_password.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters' });
      return;
    }

    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      await usersAPI.changePassword({
        current_password: passwordData.current_password,
        new_password: passwordData.new_password
      });
      setMessage({ type: 'success', text: 'Password changed successfully!' });
      setPasswordData({ current_password: '', new_password: '', confirm_password: '' });
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to change password' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-serif font-bold text-foreground">Account Settings</h1>
        <p className="text-muted-foreground">Manage your profile and security settings</p>
      </div>

      {/* Profile Header */}
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center gap-6">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt="Profile"
                  className="w-24 h-24 rounded-full object-cover"
                />
              ) : (
                <span className="text-3xl font-bold text-primary">
                  {user?.first_name?.charAt(0)}{user?.last_name?.charAt(0)}
                </span>
              )}
            </div>
            <button className="absolute bottom-0 right-0 p-2 bg-primary text-primary-foreground rounded-full shadow-lg hover:bg-primary/90 transition-colors">
              <Camera className="w-4 h-4" />
            </button>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-foreground">
              {user?.first_name} {user?.last_name}
            </h2>
            <p className="text-muted-foreground">{user?.email}</p>
            <span className="inline-block mt-2 px-3 py-1 bg-primary/10 text-primary text-sm rounded-full">
              {user?.role || 'Client'}
            </span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-border">
        <button
          onClick={() => setActiveTab('profile')}
          className={`px-4 py-3 font-medium transition-colors border-b-2 -mb-px ${
            activeTab === 'profile'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          Profile Information
        </button>
        <button
          onClick={() => setActiveTab('security')}
          className={`px-4 py-3 font-medium transition-colors border-b-2 -mb-px ${
            activeTab === 'security'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          Security
        </button>
      </div>

      {/* Message */}
      {message.text && (
        <div
          className={`p-4 rounded-lg ${
            message.type === 'success'
              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
              : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <form onSubmit={handleProfileSubmit} className="bg-card border border-border rounded-xl p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                First Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  name="first_name"
                  value={profileData.first_name}
                  onChange={handleProfileChange}
                  className="w-full pl-10 pr-4 py-3 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Last Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  name="last_name"
                  value={profileData.last_name}
                  onChange={handleProfileChange}
                  className="w-full pl-10 pr-4 py-3 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="email"
                name="email"
                value={profileData.email}
                onChange={handleProfileChange}
                className="w-full pl-10 pr-4 py-3 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Phone Number
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="tel"
                name="phone"
                value={profileData.phone}
                onChange={handleProfileChange}
                className="w-full pl-10 pr-4 py-3 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Delivery Address
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
              <textarea
                name="address"
                value={profileData.address}
                onChange={handleProfileChange}
                rows={3}
                className="w-full pl-10 pr-4 py-3 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {saving ? (
                <LoadingSpinner size="sm" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              Save Changes
            </button>
          </div>
        </form>
      )}

      {/* Security Tab */}
      {activeTab === 'security' && (
        <form onSubmit={handlePasswordSubmit} className="bg-card border border-border rounded-xl p-6 space-y-6">
          <div>
            <h3 className="text-lg font-medium text-foreground mb-4">Change Password</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Current Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="password"
                    name="current_password"
                    value={passwordData.current_password}
                    onChange={handlePasswordChange}
                    className="w-full pl-10 pr-4 py-3 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="password"
                    name="new_password"
                    value={passwordData.new_password}
                    onChange={handlePasswordChange}
                    className="w-full pl-10 pr-4 py-3 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Confirm New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="password"
                    name="confirm_password"
                    value={passwordData.confirm_password}
                    onChange={handlePasswordChange}
                    className="w-full pl-10 pr-4 py-3 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {saving ? (
                <LoadingSpinner size="sm" />
              ) : (
                <Lock className="w-4 h-4" />
              )}
              Update Password
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
