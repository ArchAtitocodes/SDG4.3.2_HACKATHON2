import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Session, User as SupabaseUser } from '@supabase/supabase-js';
import { useToast } from '@/hooks/use-toast';
import { AuthModal } from '@/components/auth/AuthModal';
import { Dashboard } from '@/components/dashboard/Dashboard';
import { QuizInterface } from '@/components/quiz/QuizInterface';

export type AppState = 'auth' | 'dashboard' | 'quiz';

export interface User {
  id: string;
  name: string;
  email: string;
  demographics: {
    sex: string;
    age: number;
    nation: string;
    nearestTown: string;
    phone: string;
    educationLevel: string;
    fieldOfStudy: string;
    programmingExperience: string;
  };
  stats: {
    totalQuizzes: number;
    correctAnswers: number;
    streakCount: number;
    badgesEarned: string[];
    xpPoints: number;
    level: number;
  };
}

export interface QuizSettings {
  language: string;
  difficulty: string;
  timePerQuestion: number;
}

const Index = () => {
  const [appState, setAppState] = useState<AppState>('auth');
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [quizSettings, setQuizSettings] = useState<QuizSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Handle authentication state changes
  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        
        if (session?.user) {
          // Fetch user profile data
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          const userData: User = {
            id: session.user.id,
            name: profile?.full_name || session.user.email?.split('@')[0] || 'User',
            email: session.user.email || '',
            demographics: {
              sex: '',
              age: 25,
              nation: '',
              nearestTown: '',
              phone: '',
              educationLevel: '',
              fieldOfStudy: '',
              programmingExperience: ''
            },
            stats: {
              totalQuizzes: 0,
              correctAnswers: 0,
              streakCount: profile?.streak_days || 0,
              badgesEarned: [],
              xpPoints: profile?.experience_points || 0,
              level: profile?.level || 1
            }
          };
          
          setUser(userData);
          setAppState('dashboard');
        } else {
          setUser(null);
          setAppState('auth');
        }
        setLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      // The onAuthStateChange will handle the session
      if (!session) {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Show loading spinner while checking auth state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  const handleAuthSuccess = (userData: User) => {
    setUser(userData);
    setAppState('dashboard');
  };

  const handleStartQuiz = (settings: QuizSettings) => {
    setQuizSettings(settings);
    setAppState('quiz');
  };

  const handleQuizComplete = () => {
    setAppState('dashboard');
  };

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      setUser(null);
      setSession(null);
      setAppState('auth');
      setQuizSettings(null);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to log out. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background font-roboto">
      {/* Neural Network Background */}
      <div className="fixed inset-0 bg-gradient-neural opacity-50 pointer-events-none" />
      <div className="fixed inset-0 bg-gradient-glow opacity-30 pointer-events-none animate-neural-pulse" />
      
      {/* Main Content */}
      <div className="relative z-10">
        {appState === 'auth' && (
          <AuthModal onAuthSuccess={handleAuthSuccess} />
        )}
        
        {appState === 'dashboard' && user && (
          <Dashboard 
            user={user} 
            onStartQuiz={handleStartQuiz} 
            onLogout={handleLogout}
          />
        )}
        
        {appState === 'quiz' && user && quizSettings && (
          <QuizInterface
            user={user}
            settings={quizSettings}
            onComplete={handleQuizComplete}
            onBack={() => setAppState('dashboard')}
          />
        )}
      </div>
    </div>
  );
};

export default Index;