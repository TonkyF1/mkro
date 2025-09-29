import React, { useState } from 'react';
import ProfileDetails from '@/components/ProfileDetails';
import ProfileEdit from '@/components/ProfileEdit';
import { useUserProfile } from '@/hooks/useUserProfile';

const Profile = () => {
  const { profile, saveProfile } = useUserProfile();
  const [editingProfile, setEditingProfile] = useState(false);

  if (!profile) {
    return <div className="text-center py-8">Loading profile...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      {editingProfile ? (
        <ProfileEdit 
          profile={profile} 
          onBack={() => setEditingProfile(false)} 
          onSave={saveProfile}
        />
      ) : (
        <ProfileDetails 
          profile={profile} 
          onEditClick={() => setEditingProfile(true)} 
        />
      )}
    </div>
  );
};

export default Profile;
