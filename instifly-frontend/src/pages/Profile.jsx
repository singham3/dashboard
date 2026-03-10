import React, { useState } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { useSelector, useDispatch } from 'react-redux';
import { setUser } from '../redux/userSlice';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Phone, Shield, FileText, Lock, Eye, EyeOff, CheckCircle, AlertCircle, Camera } from 'lucide-react';
import api from '../api/axiosClient';

const BASE_URL = import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || 'http://127.0.0.1:8000';

export default React.memo(function Profile() {
  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();
  const { logout } = useAuth();

  // --- Profile edit state ---
  const [profileForm, setProfileForm] = useState({
    full_name: user?.full_name || '',
    phone: user?.phone || '',
    bio: user?.bio || '',
  });
  const [profileImage, setProfileImage] = useState(null);
  const [profileImagePreview, setProfileImagePreview] = useState(null);
  const [profileStatus, setProfileStatus] = useState({ type: '', message: '' });
  const [profileLoading, setProfileLoading] = useState(false);

  // --- Password state ---
  const [form, setForm] = useState({ old_password: '', new_password: '', confirm_password: '' });
  const [showPasswords, setShowPasswords] = useState({ old: false, new: false, confirm: false });
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);

  // --- Profile handlers ---
  const handleProfileChange = (e) => {
    setProfileForm({ ...profileForm, [e.target.name]: e.target.value });
    if (profileStatus.message) setProfileStatus({ type: '', message: '' });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      setProfileImagePreview(URL.createObjectURL(file));
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileStatus({ type: '', message: '' });
    setProfileLoading(true);
    try {
      const formData = new FormData();
      formData.append('full_name', profileForm.full_name);
      formData.append('phone', profileForm.phone);
      formData.append('bio', profileForm.bio);
      if (profileImage) formData.append('profile_picture', profileImage);

      const res = await api.put('/account/update-profile/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setProfileStatus({ type: 'success', message: res.data.message || 'Profile updated.' });
      if (res.data.user) dispatch(setUser(res.data.user));
      setProfileImage(null);
      setProfileImagePreview(null);
    } catch (err) {
      const msg = err.data?.detail || err.message || 'Something went wrong.';
      setProfileStatus({ type: 'error', message: msg });
    } finally {
      setProfileLoading(false);
    }
  };

  // --- Password handlers ---
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (status.message) setStatus({ type: '', message: '' });
  };

  const toggleVisibility = (field) => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: '', message: '' });

    if (!form.old_password || !form.new_password || !form.confirm_password) {
      setStatus({ type: 'error', message: 'All fields are required.' });
      return;
    }

    if (form.new_password !== form.confirm_password) {
      setStatus({ type: 'error', message: 'New password and confirm password do not match.' });
      return;
    }

    setLoading(true);
    try {
      await api.post('/account/change-password/', form);
      setStatus({ type: 'success', message: 'Password changed! Logging out...' });
      setForm({ old_password: '', new_password: '', confirm_password: '' });
      setTimeout(() => logout(), 1500);
    } catch (err) {
      const data = err.data || err.response?.data || {};
      const msg =
        data.old_password?.[0] ||
        data.new_password?.[0] ||
        data.confirm_password?.[0] ||
        data.detail ||
        err.message ||
        'Something went wrong.';
      setStatus({ type: 'error', message: msg });
    } finally {
      setLoading(false);
    }
  };

  const infoFields = [
    { label: 'Full Name', value: user?.full_name, icon: User },
    { label: 'Username', value: user?.username, icon: User },
    { label: 'Email', value: user?.email, icon: Mail },
    { label: 'Phone', value: user?.phone, icon: Phone },
    { label: 'Role', value: user?.role?.replace('_', ' '), icon: Shield },
    { label: 'Bio', value: user?.bio, icon: FileText },
  ];

  const passwordFields = [
    { name: 'old_password', label: 'Old Password', visKey: 'old' },
    { name: 'new_password', label: 'New Password', visKey: 'new' },
    { name: 'confirm_password', label: 'Confirm Password', visKey: 'confirm' },
  ];

  const profileEditFields = [
    { name: 'full_name', label: 'Full Name', type: 'text' },
    { name: 'phone', label: 'Phone', type: 'text' },
    { name: 'bio', label: 'Bio', type: 'textarea' },
  ];

  // Shared status banner
  const StatusBanner = ({ st }) => st.message ? (
    <div className={`flex items-center gap-2 p-2.5 rounded-lg text-xs font-medium ${
      st.type === 'success'
        ? 'bg-green-50 text-green-700 border border-green-200'
        : 'bg-red-50 text-red-600 border border-red-200'
    }`}>
      {st.type === 'success' ? <CheckCircle size={14} /> : <AlertCircle size={14} />}
      {st.message}
    </div>
  ) : null;

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-5">

        {/* --- User Info Card (compact) --- */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-brand to-orange-400 px-6 py-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-white text-xl font-bold border-2 border-white/40 shrink-0 overflow-hidden">
                {user?.profile_picture ? (
                  <img src={user.profile_picture.startsWith('http') ? user.profile_picture : `${BASE_URL}${user.profile_picture}`} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  user?.full_name?.[0]?.toUpperCase() || user?.username?.[0]?.toUpperCase() || 'U'
                )}
              </div>
              <div className="text-white min-w-0">
                <h1 className="text-lg font-bold truncate">{user?.full_name || user?.username || 'User'}</h1>
                <p className="text-white/80 text-xs capitalize">{user?.role?.replace('_', ' ') || 'User'}</p>
              </div>
            </div>
          </div>
          <div className="px-6 py-4 grid sm:grid-cols-3 gap-4">
            {infoFields.map((field) => (
              <div key={field.label} className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-md bg-orange-50 flex items-center justify-center shrink-0">
                  <field.icon size={14} className="text-brand" />
                </div>
                <div className="min-w-0">
                  <div className="text-[10px] text-gray-400 font-medium uppercase tracking-wide leading-none">{field.label}</div>
                  <div className="text-sm text-gray-900 font-medium truncate capitalize">{field.value || '—'}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* --- Two cards side by side --- */}
        <div className="grid lg:grid-cols-2 gap-5">

          {/* --- Edit Profile Card --- */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-5 py-3.5 border-b border-gray-100 flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-md bg-orange-50 flex items-center justify-center">
                <User size={14} className="text-brand" />
              </div>
              <h2 className="text-sm font-semibold text-gray-900">Edit Profile</h2>
            </div>

            <form onSubmit={handleProfileSubmit} className="p-5 space-y-3.5">
              {/* Profile picture upload */}
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border-2 border-gray-200">
                    {profileImagePreview ? (
                      <img src={profileImagePreview} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-gray-400 text-lg font-bold">
                        {user?.full_name?.[0]?.toUpperCase() || user?.username?.[0]?.toUpperCase() || 'U'}
                      </span>
                    )}
                  </div>
                  <label className="absolute -bottom-0.5 -right-0.5 w-5 h-5 bg-brand rounded-full flex items-center justify-center cursor-pointer shadow">
                    <Camera size={10} className="text-white" />
                    <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                  </label>
                </div>
                <div className="text-xs text-gray-500">Change profile photo</div>
              </div>

              {profileEditFields.map((pf) => (
                <div key={pf.name}>
                  <label htmlFor={`profile_${pf.name}`} className="block text-xs font-medium text-gray-600 mb-1">
                    {pf.label}
                  </label>
                  {pf.type === 'textarea' ? (
                    <textarea
                      id={`profile_${pf.name}`}
                      name={pf.name}
                      value={profileForm[pf.name]}
                      onChange={handleProfileChange}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-900 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition resize-none"
                      placeholder={`Enter ${pf.label.toLowerCase()}`}
                    />
                  ) : (
                    <input
                      id={`profile_${pf.name}`}
                      name={pf.name}
                      type={pf.type}
                      value={profileForm[pf.name]}
                      onChange={handleProfileChange}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-900 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition"
                      placeholder={`Enter ${pf.label.toLowerCase()}`}
                    />
                  )}
                </div>
              ))}

              <StatusBanner st={profileStatus} />

              <button
                type="submit"
                disabled={profileLoading}
                className="w-full py-2.5 rounded-lg bg-brand text-white text-sm font-semibold hover:bg-orange-600 transition disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
              >
                {profileLoading ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          </div>

          {/* --- Change Password Card --- */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-5 py-3.5 border-b border-gray-100 flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-md bg-orange-50 flex items-center justify-center">
                <Lock size={14} className="text-brand" />
              </div>
              <h2 className="text-sm font-semibold text-gray-900">Change Password</h2>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-3.5">
              {passwordFields.map((pf) => (
                <div key={pf.name}>
                  <label htmlFor={pf.name} className="block text-xs font-medium text-gray-600 mb-1">
                    {pf.label}
                  </label>
                  <div className="relative">
                    <input
                      id={pf.name}
                      name={pf.name}
                      type={showPasswords[pf.visKey] ? 'text' : 'password'}
                      value={form[pf.name]}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-900 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition pr-9"
                      placeholder={`Enter ${pf.label.toLowerCase()}`}
                    />
                    <button
                      type="button"
                      onClick={() => toggleVisibility(pf.visKey)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 bg-transparent border-none cursor-pointer"
                      tabIndex={-1}
                    >
                      {showPasswords[pf.visKey] ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>
              ))}

              <StatusBanner st={status} />

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-lg bg-brand text-white text-sm font-semibold hover:bg-orange-600 transition disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
              >
                {loading ? 'Changing...' : 'Change Password'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
});
