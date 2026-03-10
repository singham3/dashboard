import React, { useState, useCallback } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import {
  useUsers,
  useCreateUser,
  useUpdateUser,
  useDeleteUser,
  useToggleUserActive,
  useAdminChangePassword,
} from '../queries/userQueries';
import {
  Plus,
  Pencil,
  Trash2,
  Eye,
  Lock,
  ChevronLeft,
  ChevronRight,
  X,
  CheckCircle,
  AlertCircle,
  Users as UsersIcon,
  Search,
  ToggleLeft,
  ToggleRight,
} from 'lucide-react';

/* ──────────── helpers ──────────── */
function extractCursor(url) {
  if (!url) return null;
  try {
    const u = new URL(url);
    return u.searchParams.get('cursor');
  } catch {
    return null;
  }
}

const ROLES = [
  { value: 'warehouse_manager', label: 'Warehouse Manager' },
  { value: 'store_manager', label: 'Store Manager' },
  { value: 'admin', label: 'Admin' },
];

const StatusBanner = ({ st, onClose }) =>
  st?.message ? (
    <div
      className={`flex items-center gap-2 p-3 rounded-lg text-sm font-medium ${
        st.type === 'success'
          ? 'bg-green-50 text-green-700 border border-green-200'
          : 'bg-red-50 text-red-600 border border-red-200'
      }`}
    >
      {st.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
      <span className="flex-1">{st.message}</span>
      {onClose && (
        <button onClick={onClose} className="bg-transparent border-none cursor-pointer p-0 text-current opacity-60 hover:opacity-100">
          <X size={14} />
        </button>
      )}
    </div>
  ) : null;

/* ──────────── Modal shell ──────────── */
function Modal({ open, onClose, title, children, width = 'max-w-lg' }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.45)' }}>
      <div className={`bg-white rounded-2xl shadow-2xl w-full ${width} max-h-[90vh] flex flex-col animate-modal-in`}>
        {/* header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="text-base font-semibold text-gray-900">{title}</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 bg-transparent border-none cursor-pointer text-gray-400 hover:text-gray-600 transition"
          >
            <X size={18} />
          </button>
        </div>
        {/* body */}
        <div className="overflow-y-auto px-6 py-5 flex-1">{children}</div>
      </div>
    </div>
  );
}

/* ──────────── Input helpers ──────────── */
const inputCls =
  'w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-900 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition';
const labelCls = 'block text-xs font-medium text-gray-600 mb-1.5';
const btnPrimary =
  'px-5 py-2.5 rounded-lg bg-brand text-white text-sm font-semibold hover:bg-orange-600 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer border-none';
const btnSecondary =
  'px-5 py-2.5 rounded-lg bg-gray-100 text-gray-700 text-sm font-medium hover:bg-gray-200 transition cursor-pointer border-none';

/* ──────────── MAIN COMPONENT ──────────── */
export default React.memo(function Users() {
  /* pagination cursors */
  const [cursorStack, setCursorStack] = useState([null]);
  const currentCursor = cursorStack[cursorStack.length - 1];
  const { data, isLoading, isError } = useUsers(currentCursor);

  /* modals */
  const [modal, setModal] = useState({ type: null, user: null });
  const closeModal = useCallback(() => setModal({ type: null, user: null }), []);

  /* search (client‑side filter) */
  const [search, setSearch] = useState('');

  const users = (data?.results || []).filter((u) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      u.username?.toLowerCase().includes(q) ||
      u.full_name?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q)
    );
  });

  const nextCursor = extractCursor(data?.next);
  const prevCursor = cursorStack.length > 1;

  const goNext = () => {
    if (nextCursor) setCursorStack((s) => [...s, nextCursor]);
  };
  const goPrev = () => {
    if (cursorStack.length > 1) setCursorStack((s) => s.slice(0, -1));
  };

  return (
    <DashboardLayout>
      <style>{`
        @keyframes modalIn { from { opacity:0; transform:scale(.95) translateY(8px); } to { opacity:1; transform:scale(1) translateY(0); } }
        .animate-modal-in { animation: modalIn .2s ease-out; }
      `}</style>

      <div className="max-w-6xl mx-auto space-y-5">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand to-orange-400 flex items-center justify-center shadow-sm">
              <UsersIcon size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 leading-tight">User Management</h1>
              <p className="text-xs text-gray-500">Manage all user accounts</p>
            </div>
          </div>
          <button onClick={() => setModal({ type: 'create', user: null })} className={btnPrimary + ' flex items-center gap-2'}>
            <Plus size={16} /> Add User
          </button>
        </div>

        {/* Search */}
        <div className="relative max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search users..."
            className={inputCls + ' pl-9'}
          />
        </div>

        {/* Table card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {isLoading ? (
            <div className="p-12 text-center text-gray-400 text-sm">Loading users...</div>
          ) : isError ? (
            <div className="p-12 text-center text-red-500 text-sm">Failed to load users.</div>
          ) : users.length === 0 ? (
            <div className="p-12 text-center text-gray-400 text-sm">No users found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/60">
                    {['Name', 'Username', 'Email', 'Role', 'Status', 'Actions'].map((h) => (
                      <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => {
                    const picUrl = u.profile_picture ? (u.profile_picture.startsWith('http') ? u.profile_picture : `${(import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || 'http://127.0.0.1:8000')}${u.profile_picture}`) : null;
                    return (
                    <tr key={u.id} className="border-b border-gray-50 hover:bg-orange-50/30 transition">
                      <td className="px-5 py-3.5 font-medium text-gray-900 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand to-orange-400 flex items-center justify-center text-white text-xs font-bold shrink-0 overflow-hidden">
                            {picUrl ? (
                              <img src={picUrl} alt="" className="w-full h-full object-cover" />
                            ) : (
                              u.full_name?.[0]?.toUpperCase() || u.username?.[0]?.toUpperCase() || 'U'
                            )}
                          </div>
                          <span>{u.full_name || '—'}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-gray-600 whitespace-nowrap">{u.username}</td>
                      <td className="px-5 py-3.5 text-gray-600 whitespace-nowrap">{u.email || '—'}</td>
                      <td className="px-5 py-3.5 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 capitalize">
                          {u.role?.replace('_', ' ') || '—'}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 whitespace-nowrap">
                        <ActiveToggle user={u} />
                      </td>
                      <td className="px-5 py-3.5 whitespace-nowrap">
                        <div className="flex items-center gap-1">
                          <ActionBtn icon={Eye} title="View" onClick={() => setModal({ type: 'view', user: u })} />
                          <ActionBtn icon={Pencil} title="Edit" onClick={() => setModal({ type: 'edit', user: u })} />
                          <ActionBtn icon={Lock} title="Change Password" onClick={() => setModal({ type: 'password', user: u })} />
                          <ActionBtn icon={Trash2} title="Delete" color="text-red-400 hover:text-red-600 hover:bg-red-50" onClick={() => setModal({ type: 'delete', user: u })} />
                        </div>
                      </td>
                    </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {!isLoading && !isError && (data?.next || prevCursor) && (
            <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100 bg-gray-50/40">
              <button onClick={goPrev} disabled={!prevCursor} className={btnSecondary + ' flex items-center gap-1.5 text-xs disabled:opacity-40'}>
                <ChevronLeft size={14} /> Previous
              </button>
              <button onClick={goNext} disabled={!nextCursor} className={btnSecondary + ' flex items-center gap-1.5 text-xs disabled:opacity-40'}>
                Next <ChevronRight size={14} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ─── MODALS ─── */}
      <CreateUserModal open={modal.type === 'create'} onClose={closeModal} />
      <EditUserModal open={modal.type === 'edit'} user={modal.user} onClose={closeModal} />
      <DeleteUserModal open={modal.type === 'delete'} user={modal.user} onClose={closeModal} />
      <ChangePasswordModal open={modal.type === 'password'} user={modal.user} onClose={closeModal} />
      <ViewUserModal open={modal.type === 'view'} user={modal.user} onClose={closeModal} />
    </DashboardLayout>
  );
});

/* ──────────── Small components ──────────── */
function ActionBtn({ icon: Icon, title, onClick, color = 'text-gray-400 hover:text-brand hover:bg-orange-50' }) {
  return (
    <button onClick={onClick} title={title} className={`w-8 h-8 flex items-center justify-center rounded-lg transition bg-transparent border-none cursor-pointer ${color}`}>
      <Icon size={15} />
    </button>
  );
}

function ActiveToggle({ user }) {
  const { mutate, isPending } = useToggleUserActive();
  const active = user.is_active;
  return (
    <button
      onClick={() => mutate(user.id)}
      disabled={isPending}
      title={active ? 'Deactivate' : 'Activate'}
      className="flex items-center gap-1.5 bg-transparent border-none cursor-pointer p-0 disabled:opacity-50"
    >
      {active ? (
        <ToggleRight size={22} className="text-green-500" />
      ) : (
        <ToggleLeft size={22} className="text-gray-300" />
      )}
      <span className={`text-xs font-medium ${active ? 'text-green-600' : 'text-gray-400'}`}>
        {active ? 'Active' : 'Inactive'}
      </span>
    </button>
  );
}

/* ──────────── Create User Modal ──────────── */
function CreateUserModal({ open, onClose }) {
  const { mutate, isPending } = useCreateUser();
  const [form, setForm] = useState({ username: '', email: '', password: '', full_name: '', phone: '', bio: '', role: 'warehouse_manager' });
  const [profileImage, setProfileImage] = useState(null);
  const [profileImagePreview, setProfileImagePreview] = useState(null);
  const [status, setStatus] = useState(null);

  const reset = () => { setForm({ username: '', email: '', password: '', full_name: '', phone: '', bio: '', role: 'warehouse_manager' }); setProfileImage(null); setProfileImagePreview(null); setStatus(null); };
  const handleClose = () => { reset(); onClose(); };

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      setProfileImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus(null);
    if (!form.username || !form.email || !form.password) {
      setStatus({ type: 'error', message: 'Username, email, and password are required.' });
      return;
    }
    const formData = new FormData();
    Object.entries(form).forEach(([key, val]) => { if (val) formData.append(key, val); });
    if (profileImage) formData.append('profile_picture', profileImage);

    mutate(formData, {
      onSuccess: () => { setStatus({ type: 'success', message: 'User created!' }); setTimeout(handleClose, 800); },
      onError: (err) => {
        const d = err.data || err.response?.data || {};
        const msg = Object.values(d).flat().join(' ') || err.message || 'Failed to create user.';
        setStatus({ type: 'error', message: msg });
      },
    });
  };

  return (
    <Modal open={open} onClose={handleClose} title="Create New User">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Profile picture upload */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border-2 border-gray-200">
              {profileImagePreview ? (
                <img src={profileImagePreview} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <span className="text-gray-400 text-lg font-bold">U</span>
              )}
            </div>
            <label className="absolute -bottom-0.5 -right-0.5 w-6 h-6 bg-brand rounded-full flex items-center justify-center cursor-pointer shadow">
              <Plus size={12} className="text-white" />
              <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
            </label>
          </div>
          <div className="text-xs text-gray-500">Add profile photo</div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Username *" name="username" value={form.username} onChange={handleChange} />
          <Field label="Email *" name="email" type="email" value={form.email} onChange={handleChange} />
          <Field label="Password *" name="password" type="password" value={form.password} onChange={handleChange} />
          <Field label="Full Name" name="full_name" value={form.full_name} onChange={handleChange} />
          <Field label="Phone" name="phone" value={form.phone} onChange={handleChange} />
          <div>
            <label className={labelCls}>Role</label>
            <select name="role" value={form.role} onChange={handleChange} className={inputCls}>
              {ROLES.map((r) => (
                <option key={r.value} value={r.value}>{r.label}</option>
              ))}
            </select>
          </div>
          <div className="sm:col-span-2">
            <label className={labelCls}>Bio</label>
            <textarea name="bio" value={form.bio} onChange={handleChange} rows={2} className={inputCls + ' resize-none'} placeholder="Enter bio" />
          </div>
        </div>
        <StatusBanner st={status} onClose={() => setStatus(null)} />
        <div className="flex justify-end gap-3 pt-2">
          <button type="button" onClick={handleClose} className={btnSecondary}>Cancel</button>
          <button type="submit" disabled={isPending} className={btnPrimary}>{isPending ? 'Creating...' : 'Create User'}</button>
        </div>
      </form>
    </Modal>
  );
}

/* ──────────── Edit User Modal ──────────── */
function EditUserModal({ open, user, onClose }) {
  const { mutate, isPending } = useUpdateUser();
  const [form, setForm] = useState({});
  const [profileImage, setProfileImage] = useState(null);
  const [profileImagePreview, setProfileImagePreview] = useState(null);
  const [status, setStatus] = useState(null);
  const BASE_URL = import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || 'http://127.0.0.1:8000';

  React.useEffect(() => {
    if (user) {
      setForm({ username: user.username || '', email: user.email || '', full_name: user.full_name || '', phone: user.phone || '', bio: user.bio || '', role: user.role || 'warehouse_manager' });
      setProfileImage(null);
      setProfileImagePreview(null);
    }
  }, [user]);

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  const handleClose = () => { setStatus(null); setProfileImage(null); setProfileImagePreview(null); onClose(); };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      setProfileImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus(null);
    const formData = new FormData();
    Object.entries(form).forEach(([key, val]) => formData.append(key, val));
    if (profileImage) formData.append('profile_picture', profileImage);

    mutate(
      { id: user.id, data: formData },
      {
        onSuccess: () => { setStatus({ type: 'success', message: 'User updated!' }); setTimeout(handleClose, 800); },
        onError: (err) => {
          const d = err.data || err.response?.data || {};
          const msg = Object.values(d).flat().join(' ') || err.message || 'Failed to update.';
          setStatus({ type: 'error', message: msg });
        },
      },
    );
  };

  const currentPic = profileImagePreview || (user?.profile_picture ? (user.profile_picture.startsWith('http') ? user.profile_picture : `${BASE_URL}${user.profile_picture}`) : null);

  return (
    <Modal open={open} onClose={handleClose} title={`Edit User — ${user?.username || ''}`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Profile picture upload */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border-2 border-gray-200">
              {currentPic ? (
                <img src={currentPic} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <span className="text-gray-400 text-lg font-bold">
                  {user?.full_name?.[0]?.toUpperCase() || user?.username?.[0]?.toUpperCase() || 'U'}
                </span>
              )}
            </div>
            <label className="absolute -bottom-0.5 -right-0.5 w-6 h-6 bg-brand rounded-full flex items-center justify-center cursor-pointer shadow">
              <Pencil size={11} className="text-white" />
              <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
            </label>
          </div>
          <div className="text-xs text-gray-500">Change profile photo</div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Username" name="username" value={form.username} onChange={handleChange} />
          <Field label="Email" name="email" type="email" value={form.email} onChange={handleChange} />
          <Field label="Full Name" name="full_name" value={form.full_name} onChange={handleChange} />
          <Field label="Phone" name="phone" value={form.phone} onChange={handleChange} />
          <div className="sm:col-span-2">
            <label className={labelCls}>Bio</label>
            <textarea name="bio" value={form.bio || ''} onChange={handleChange} rows={2} className={inputCls + ' resize-none'} />
          </div>
          <div>
            <label className={labelCls}>Role</label>
            <select name="role" value={form.role} onChange={handleChange} className={inputCls}>
              {ROLES.map((r) => (
                <option key={r.value} value={r.value}>{r.label}</option>
              ))}
            </select>
          </div>
        </div>
        <StatusBanner st={status} onClose={() => setStatus(null)} />
        <div className="flex justify-end gap-3 pt-2">
          <button type="button" onClick={handleClose} className={btnSecondary}>Cancel</button>
          <button type="submit" disabled={isPending} className={btnPrimary}>{isPending ? 'Saving...' : 'Save Changes'}</button>
        </div>
      </form>
    </Modal>
  );
}

/* ──────────── Delete Confirmation Modal ──────────── */
function DeleteUserModal({ open, user, onClose }) {
  const { mutate, isPending } = useDeleteUser();
  const [status, setStatus] = useState(null);

  const handleClose = () => { setStatus(null); onClose(); };

  const handleDelete = () => {
    setStatus(null);
    mutate(user.id, {
      onSuccess: () => { setStatus({ type: 'success', message: 'User deleted.' }); setTimeout(handleClose, 800); },
      onError: (err) => setStatus({ type: 'error', message: err.message || 'Failed to delete.' }),
    });
  };

  return (
    <Modal open={open} onClose={handleClose} title="Delete User" width="max-w-md">
      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center shrink-0">
            <Trash2 size={18} className="text-red-500" />
          </div>
          <div>
            <p className="text-sm text-gray-900 font-medium">Are you sure you want to delete this user?</p>
            <p className="text-sm text-gray-500 mt-1">
              <strong>{user?.full_name || user?.username}</strong> ({user?.email}) will be permanently removed. This action cannot be undone.
            </p>
          </div>
        </div>
        <StatusBanner st={status} onClose={() => setStatus(null)} />
        <div className="flex justify-end gap-3 pt-2">
          <button onClick={handleClose} className={btnSecondary}>Cancel</button>
          <button onClick={handleDelete} disabled={isPending} className="px-5 py-2.5 rounded-lg bg-red-500 text-white text-sm font-semibold hover:bg-red-600 transition disabled:opacity-50 cursor-pointer border-none">
            {isPending ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </Modal>
  );
}

/* ──────────── Change Password Modal ──────────── */
function ChangePasswordModal({ open, user, onClose }) {
  const { mutate, isPending } = useAdminChangePassword();
  const [form, setForm] = useState({ new_password: '', confirm_password: '' });
  const [status, setStatus] = useState(null);

  const reset = () => { setForm({ new_password: '', confirm_password: '' }); setStatus(null); };
  const handleClose = () => { reset(); onClose(); };
  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus(null);
    if (!form.new_password || !form.confirm_password) {
      setStatus({ type: 'error', message: 'Both fields are required.' });
      return;
    }
    if (form.new_password !== form.confirm_password) {
      setStatus({ type: 'error', message: 'Passwords do not match.' });
      return;
    }
    mutate(
      { id: user.id, data: form },
      {
        onSuccess: () => { setStatus({ type: 'success', message: 'Password changed!' }); setTimeout(handleClose, 800); },
        onError: (err) => {
          const d = err.data || err.response?.data || {};
          const msg = Object.values(d).flat().join(' ') || err.message || 'Failed.';
          setStatus({ type: 'error', message: msg });
        },
      },
    );
  };

  return (
    <Modal open={open} onClose={handleClose} title={`Change Password — ${user?.username || ''}`} width="max-w-md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Field label="New Password" name="new_password" type="password" value={form.new_password} onChange={handleChange} />
        <Field label="Confirm Password" name="confirm_password" type="password" value={form.confirm_password} onChange={handleChange} />
        <StatusBanner st={status} onClose={() => setStatus(null)} />
        <div className="flex justify-end gap-3 pt-2">
          <button type="button" onClick={handleClose} className={btnSecondary}>Cancel</button>
          <button type="submit" disabled={isPending} className={btnPrimary}>{isPending ? 'Changing...' : 'Change Password'}</button>
        </div>
      </form>
    </Modal>
  );
}

/* ──────────── View User Profile Modal ──────────── */
function ViewUserModal({ open, user, onClose }) {
  if (!user) return null;
  const BASE_URL = import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || 'http://127.0.0.1:8000';
  const fields = [
    { label: 'Full Name', value: user.full_name },
    { label: 'Username', value: user.username },
    { label: 'Email', value: user.email },
    { label: 'Phone', value: user.phone },
    { label: 'Role', value: user.role?.replace('_', ' ') },
    { label: 'Bio', value: user.bio },
    { label: 'Status', value: user.is_active ? 'Active' : 'Inactive' },
    { label: 'Superuser', value: user.is_superuser ? 'Yes' : 'No' },
    { label: 'Staff', value: user.is_staff ? 'Yes' : 'No' },
    { label: 'Joined', value: user.date_joined ? new Date(user.date_joined).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—' },
  ];

  return (
    <Modal open={open} onClose={onClose} title="User Profile">
      <div className="space-y-5">
        {/* avatar header */}
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-brand to-orange-400 flex items-center justify-center text-white text-xl font-bold border-2 border-white shadow overflow-hidden shrink-0">
            {user.profile_picture ? (
              <img src={user.profile_picture.startsWith('http') ? user.profile_picture : `${BASE_URL}${user.profile_picture}`} alt="" className="w-full h-full object-cover" />
            ) : (
              user.full_name?.[0]?.toUpperCase() || user.username?.[0]?.toUpperCase() || 'U'
            )}
          </div>
          <div>
            <h4 className="text-base font-semibold text-gray-900">{user.full_name || user.username}</h4>
            <p className="text-sm text-gray-500 capitalize">{user.role?.replace('_', ' ') || '—'}</p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-x-6 gap-y-3">
          {fields.map((f) => (
            <div key={f.label}>
              <div className="text-[11px] text-gray-400 font-medium uppercase tracking-wide">{f.label}</div>
              <div className="text-sm text-gray-900 font-medium capitalize mt-0.5">{f.value || '—'}</div>
            </div>
          ))}
        </div>

        <div className="flex justify-end pt-2">
          <button onClick={onClose} className={btnSecondary}>Close</button>
        </div>
      </div>
    </Modal>
  );
}

/* ──────────── Reusable Field ──────────── */
function Field({ label, name, type = 'text', value = '', onChange }) {
  return (
    <div>
      <label className={labelCls}>{label}</label>
      <input name={name} type={type} value={value} onChange={onChange} className={inputCls} placeholder={`Enter ${label.replace(' *', '').toLowerCase()}`} />
    </div>
  );
}