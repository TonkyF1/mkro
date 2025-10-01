import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useUserProfile } from '@/hooks/useUserProfile';
import DetailedQuestionnaire from '@/components/DetailedQuestionnaire';
import { UserProfile } from '@/types/profile';
import { useEffect } from 'react';

const Questionnaire = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const { profile, saveProfile } = useUserProfile();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
    
    if (!loading && user && profile?.completed_at) {
      navigate('/');
    }
  }, [user, loading, profile, navigate]);

  const handleQuestionnaireComplete = async (profileData: UserProfile) => {
    try {
      await saveProfile(profileData);
      navigate('/');
    } catch (error) {
      console.error('Failed to save profile:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to auth
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 py-8">
      <div className="container mx-auto px-4">
        <DetailedQuestionnaire
          onComplete={handleQuestionnaireComplete}
          initialData={profile || undefined}
        />
      </div>
    </div>
  );
};

export default Questionnaire;