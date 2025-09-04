import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import { 
  Brain, 
  Code2, 
  Palette, 
  Zap, 
  Database, 
  Server,
  Cog,
  Trophy,
  Target,
  Clock,
  Star,
  LogOut,
  Play,
  BookOpen,
  TrendingUp
} from 'lucide-react';
import type { User, QuizSettings } from '@/pages/Index';

interface DashboardProps {
  user: User;
  onStartQuiz: (settings: QuizSettings) => void;
  onLogout: () => void;
}

const programmingLanguages = [
  { 
    id: 'html', 
    name: 'HTML', 
    icon: Code2, 
    color: 'text-orange-500',
    description: 'Structure & Semantics'
  },
  { 
    id: 'css', 
    name: 'CSS', 
    icon: Palette, 
    color: 'text-blue-500',
    description: 'Styling & Layout'
  },
  { 
    id: 'javascript', 
    name: 'JavaScript', 
    icon: Zap, 
    color: 'text-yellow-500',
    description: 'Logic & Interactivity'
  },
  { 
    id: 'php', 
    name: 'PHP', 
    icon: Server, 
    color: 'text-purple-500',
    description: 'Server-side Scripting'
  },
  { 
    id: 'python', 
    name: 'Python', 
    icon: Brain, 
    color: 'text-green-500',
    description: 'Data & AI'
  },
  { 
    id: 'sql', 
    name: 'SQL', 
    icon: Database, 
    color: 'text-cyan-500',
    description: 'Database Queries'
  },
  { 
    id: 'rust', 
    name: 'Rust', 
    icon: Cog, 
    color: 'text-red-500',
    description: 'Systems Programming'
  }
];

const difficultyLevels = [
  { id: 'easy', name: 'Easy', color: 'bg-green-500', description: '40+ Questions' },
  { id: 'intermediate', name: 'Intermediate', color: 'bg-yellow-500', description: '40+ Questions' },
  { id: 'expert', name: 'Expert', color: 'bg-red-500', description: '40+ Questions' }
];

export function Dashboard({ user, onStartQuiz, onLogout }: DashboardProps) {
  // Update Dashboard to fetch languages and difficulties from Supabase
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [timePerQuestion, setTimePerQuestion] = useState('120');
  const [languages, setLanguages] = useState<any[]>([]);
  const [difficulties, setDifficulties] = useState<any[]>([]);

  // Load languages and difficulties from Supabase
  useEffect(() => {
    const loadData = async () => {
      try {
        const [languagesRes, difficultiesRes] = await Promise.all([
          supabase.from('programming_languages').select('*').order('name'),
          supabase.from('difficulty_levels').select('*').order('level_order')
        ]);

        if (languagesRes.data) setLanguages(languagesRes.data);
        if (difficultiesRes.data) setDifficulties(difficultiesRes.data);
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };

    loadData();
  }, []);

  const handleStartQuiz = () => {
    if (selectedLanguage && selectedDifficulty) {
      onStartQuiz({
        language: selectedLanguage,
        difficulty: selectedDifficulty,
        timePerQuestion: parseInt(timePerQuestion)
      });
    }
  };

  const canStartQuiz = selectedLanguage && selectedDifficulty;

  return (
    <div className="min-h-screen p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-montserrat font-bold text-foreground">
              Welcome back, {user.name}! 👋
            </h1>
            <p className="text-muted-foreground">Ready to level up your coding skills?</p>
          </div>
          
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="bg-primary/10 border-primary">
              Level {user.stats.level}
            </Badge>
            <Badge variant="outline" className="bg-success/10 border-success">
              {user.stats.xpPoints} XP
            </Badge>
            <Button variant="outline" onClick={onLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 bg-gradient-primary text-primary-foreground">
            <div className="flex items-center gap-3">
              <Trophy className="h-8 w-8" />
              <div>
                <p className="text-sm opacity-90">Total Quizzes</p>
                <p className="text-2xl font-bold">{user.stats.totalQuizzes}</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-6 bg-card/80 backdrop-blur-lg border-success/20">
            <div className="flex items-center gap-3">
              <Target className="h-8 w-8 text-success" />
              <div>
                <p className="text-sm text-muted-foreground">Accuracy</p>
                <p className="text-2xl font-bold text-success">
                  {user.stats.totalQuizzes > 0 
                    ? Math.round((user.stats.correctAnswers / user.stats.totalQuizzes) * 100)
                    : 0}%
                </p>
              </div>
            </div>
          </Card>
          
          <Card className="p-6 bg-card/80 backdrop-blur-lg border-warning/20">
            <div className="flex items-center gap-3">
              <Zap className="h-8 w-8 text-warning" />
              <div>
                <p className="text-sm text-muted-foreground">Current Streak</p>
                <p className="text-2xl font-bold text-warning">{user.stats.streakCount}</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-6 bg-card/80 backdrop-blur-lg border-primary/20">
            <div className="flex items-center gap-3">
              <Star className="h-8 w-8 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Badges</p>
                <p className="text-2xl font-bold text-primary">{user.stats.badgesEarned.length}</p>
              </div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Language Selection */}
          <div className="lg:col-span-2">
            <Card className="p-6 bg-card/80 backdrop-blur-lg border-primary/20">
              <h2 className="text-xl font-montserrat font-semibold mb-4 flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                Choose Your Language
              </h2>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                {languages.map((lang) => {
                  // Map language names to icons
                  const iconMap: Record<string, any> = {
                    'HTML': Code2,
                    'CSS': Palette,
                    'JavaScript': Zap,
                    'PHP': Server,
                    'Python': Brain,
                    'SQL': Database,
                    'Rust': Cog
                  };
                  const Icon = iconMap[lang.name] || Code2;
                  
                  return (
                    <Card
                      key={lang.id}
                      className={`p-4 cursor-pointer transition-all duration-300 hover:scale-105 ${
                        selectedLanguage === lang.name 
                          ? 'bg-primary/20 border-primary shadow-glow' 
                          : 'bg-muted/50 hover:bg-muted/80'
                      }`}
                      onClick={() => setSelectedLanguage(lang.name)}
                    >
                      <div className="text-center">
                        <Icon className={`h-8 w-8 mx-auto mb-2 text-primary`} />
                        <h3 className="font-medium text-sm">{lang.name}</h3>
                        <p className="text-xs text-muted-foreground">{lang.description || 'Programming Language'}</p>
                      </div>
                    </Card>
                  );
                })}
              </div>

              <h3 className="text-lg font-montserrat font-medium mb-4">Difficulty Level</h3>
              <div className="grid grid-cols-3 gap-4 mb-6">
                {difficulties.map((level) => (
                  <Card
                    key={level.id}
                    className={`p-4 cursor-pointer transition-all duration-300 ${
                      selectedDifficulty === level.name 
                        ? 'bg-primary/20 border-primary shadow-glow' 
                        : 'bg-muted/50 hover:bg-muted/80'
                    }`}
                    onClick={() => setSelectedDifficulty(level.name)}
                  >
                    <div className="text-center">
                      <div className={`w-4 h-4 rounded-full bg-primary mx-auto mb-2`} />
                      <h4 className="font-medium text-sm">{level.name}</h4>
                      <p className="text-xs text-muted-foreground">{level.description || '15+ Questions'}</p>
                    </div>
                  </Card>
                ))}
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Time per Question</label>
                <Select value={timePerQuestion} onValueChange={setTimePerQuestion}>
                  <SelectTrigger className="bg-muted/50 border-primary/20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="60">1 minute</SelectItem>
                    <SelectItem value="120">2 minutes</SelectItem>
                    <SelectItem value="180">3 minutes</SelectItem>
                    <SelectItem value="300">5 minutes</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                onClick={handleStartQuiz}
                disabled={!canStartQuiz}
                className="w-full bg-gradient-primary hover:shadow-glow disabled:opacity-50"
                size="lg"
              >
                <Play className="h-5 w-5 mr-2" />
                Start Quiz
              </Button>
            </Card>
          </div>

          {/* Progress & Features */}
          <div className="space-y-6">
            <Card className="p-6 bg-card/80 backdrop-blur-lg border-primary/20">
              <h3 className="font-montserrat font-medium mb-4 flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Learning Progress
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Overall Progress</span>
                    <span>{Math.min(user.stats.level * 10, 100)}%</span>
                  </div>
                  <Progress value={Math.min(user.stats.level * 10, 100)} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>XP to Next Level</span>
                    <span>{1000 - (user.stats.xpPoints % 1000)}</span>
                  </div>
                  <Progress value={(user.stats.xpPoints % 1000) / 10} className="h-2" />
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-card/80 backdrop-blur-lg border-primary/20">
              <h3 className="font-montserrat font-medium mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Review Bookmarks
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Clock className="h-4 w-4 mr-2" />
                  Daily Challenge
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Trophy className="h-4 w-4 mr-2" />
                  Leaderboard
                </Button>
              </div>
            </Card>

            <Card className="p-6 bg-gradient-neural border-primary/20">
              <h3 className="font-medium mb-2">🎯 SDG 4.3.2 Impact</h3>
              <p className="text-sm text-muted-foreground">
                You're contributing to equal access to quality technical education!
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}