import { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lock, LogOut, User as UserIcon, ShieldCheck } from 'lucide-react';
import { toast } from 'react-hot-toast';
import axios from 'axios';

export default function ProfileSettingsModal({ isOpen, onClose, user, onLogout }) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) return;

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        '/api/auth/change-password',
        { currentPassword, newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Password updated successfully!');
      setCurrentPassword('');
      setNewPassword('');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100]"
          />

          {/* Centering Wrapper */}
          <div className="fixed inset-0 z-[101] flex items-center justify-center pl-0 lg:pl-64 pointer-events-none p-4">
            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-md bg-[#18181A] border border-white/10 rounded-2xl shadow-2xl overflow-hidden pointer-events-auto"
            >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-white/[0.02]">
              <h2 className="text-[#FAFAF9] font-medium text-lg flex items-center gap-2">
                <UserIcon size={18} className="text-[#F97316]" />
                Profile Settings
              </h2>
              <button 
                onClick={onClose}
                className="text-[#A8A29E] hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Profile Data */}
              <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/5">
                <div className="w-12 h-12 rounded-full bg-[#F97316]/20 flex items-center justify-center text-[#F97316] shrink-0">
                  <UserIcon size={24} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[#FAFAF9] font-semibold truncate" title={user?.email}>{user?.email}</p>
                  <p className="text-[#F97316] text-xs uppercase tracking-wider font-bold flex items-center gap-1 mt-1">
                    {user?.isPro ? <ShieldCheck size={14} /> : null}
                    {user?.isPro ? 'Pro Member' : 'Free Member'}
                  </p>
                </div>
              </div>

              {/* Password Change Form */}
              <div>
                <h3 className="text-[#FAFAF9] text-sm font-medium mb-3 flex items-center gap-2">
                  <Lock size={16} className="text-[#A8A29E]" />
                  Change Password
                </h3>
                <form onSubmit={handlePasswordChange} className="space-y-3">
                  <input
                    type="password"
                    placeholder="Current Password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full bg-[#27272A] border border-white/10 rounded-xl px-4 py-3 text-sm text-[#FAFAF9] focus:outline-none focus:border-[#F97316]/50 transition-colors"
                  />
                  <input
                    type="password"
                    placeholder="New Password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full bg-[#27272A] border border-white/10 rounded-xl px-4 py-3 text-sm text-[#FAFAF9] focus:outline-none focus:border-[#F97316]/50 transition-colors"
                  />
                  <button
                    type="submit"
                    disabled={loading || !currentPassword || !newPassword}
                    className="w-full py-3 rounded-xl bg-[#F97316] text-white text-sm font-medium hover:bg-[#EA580C] transition-all disabled:opacity-50 mt-2"
                  >
                    {loading ? 'Updating...' : 'Update Password'}
                  </button>
                </form>
              </div>

              <div className="pt-4 border-t border-white/5">
                <button
                  onClick={onLogout}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors text-sm font-medium"
                >
                  <LogOut size={16} />
                  Sign Out
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </>
    )}
  </AnimatePresence>,
    document.body
  );
}
