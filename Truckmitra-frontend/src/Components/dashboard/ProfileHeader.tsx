import React from 'react';
import { HiUser, HiBadgeCheck } from 'react-icons/hi';

export interface ProfileStat {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
}

export interface ProfileHeaderProps {
  user: {
    fullName?: string;
    profileImageUrl?: string;
  } | null;
  roleBadgeText: string;
  roleBadgeClasses?: string;
  welcomeMessage: string;
  stats: ProfileStat[];
  children?: React.ReactNode; // For notifications/refresh buttons
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  user,
  roleBadgeText,
  roleBadgeClasses = 'bg-emerald-50 text-emerald-600 border-emerald-100',
  welcomeMessage,
  stats,
  children
}) => {
  // Generate initials for avatar fallback
  const getInitials = (name?: string) => {
    if (!name) return 'U';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return name[0].toUpperCase();
  };

  return (
    <header className="bg-white px-6 md:px-10 py-6 border-b border-slate-200 sticky top-0 z-10 shadow-sm flex flex-col xl:flex-row xl:items-center justify-between gap-6">
      <div className="flex items-center space-x-5">
        {/* Profile Photo / Dynamic Avatar */}
        <div className="relative group w-16 h-16 md:w-20 md:h-20 bg-slate-100 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0 shadow-inner border-2 border-white ring-2 ring-slate-100">
          {user?.profileImageUrl ? (
            <img src={user.profileImageUrl} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            <span className="text-2xl font-black text-slate-400">
              {getInitials(user?.fullName)}
            </span>
          )}
          
          {/* Upload Overlay */}
          <label className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
            <svg className="w-6 h-6 text-white mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="text-[8px] font-bold text-white uppercase tracking-wider">Upload</span>
            <input 
              type="file" 
              className="hidden" 
              accept="image/*"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                try {
                  const toast = (await import('react-hot-toast')).default;
                  toast.loading('Uploading photo...', { id: 'photo-upload' });
                  const protectedApi = (await import('../../services/api/protectedAndPublicAPI')).default;
                  const formData = new FormData();
                  formData.append('file', file);
                  
                  // Need user ID, fallback to parsing from localStorage
                  let userId = 0;
                  try {
                    const userStr = localStorage.getItem('user');
                    if (userStr) userId = JSON.parse(userStr).id;
                  } catch (err) {}
                  
                  if (!userId) throw new Error('User ID not found');
                  
                  const res = await protectedApi.post(`/api/profile/${userId}/upload-image`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                  });
                  
                  // Update local storage user with new photo
                  try {
                    const userStr = localStorage.getItem('user');
                    if (userStr) {
                      const userObj = JSON.parse(userStr);
                      userObj.profileImageUrl = res.data.data;
                      localStorage.setItem('user', JSON.stringify(userObj));
                    }
                  } catch (err) {}
                  
                  toast.success('Profile photo updated! Please refresh.', { id: 'photo-upload' });
                  window.location.reload();
                } catch (error) {
                  const toast = (await import('react-hot-toast')).default;
                  toast.error('Failed to upload photo', { id: 'photo-upload' });
                }
              }}
            />
          </label>
        </div>
        
        {/* User Info */}
        <div>
          <div className="text-2xl font-black text-slate-900 leading-tight flex items-center space-x-2">
            <span>{user?.fullName || 'User'}</span>
            <HiBadgeCheck className="w-6 h-6 text-emerald-500" />
          </div>
          <div className="flex items-center space-x-2 mt-1">
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${roleBadgeClasses}`}>
              {roleBadgeText}
            </span>
            <span className="text-sm font-medium text-slate-500">{welcomeMessage}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between xl:justify-end flex-1 gap-6">
        {/* Quick Statistics */}
        <div className="flex items-center gap-4 md:gap-8 bg-slate-50 px-6 py-3 rounded-2xl border border-slate-100 w-full md:w-auto overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
          {stats.map((stat, idx) => (
            <div key={idx} className="flex flex-col flex-shrink-0">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-1">
                {stat.icon && <span className="text-slate-400">{stat.icon}</span>}
                {stat.label}
              </span>
              <span className="text-lg font-black text-slate-900">{stat.value}</span>
            </div>
          ))}
        </div>
        
        {/* Actions (Notifications Shortcut, Refresh, etc.) */}
        <div className="flex items-center space-x-3 shrink-0">
          {children}
        </div>
      </div>
    </header>
  );
};

export default ProfileHeader;
