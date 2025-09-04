import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Clock, 
  ArrowLeft, 
  Star, 
  Lightbulb, 
  CheckCircle, 
  XCircle,
  Zap,
  Trophy,
  Target
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { User, QuizSettings } from '@/pages/Index';

interface QuizInterfaceProps {
  user: User;
  settings: QuizSettings;
  onComplete: () => void;
  onBack: () => void;
}

interface Question {
  id: string;
  question_text: string;
  options: Array<{
    option_order: number;
    option_text: string;
  }>;
  correctAnswerIndex: number;
  explanation: string;
  difficulty_id: string;
  language_id: string;
  points: number;
}

// Helper function to get language and difficulty IDs
const getLanguageId = async (languageName: string): Promise<string | null> => {
  const { data } = await supabase
    .from('programming_languages')
    .select('id')
    .eq('name', languageName.toUpperCase())
    .single();
  return data?.id || null;
};

const getDifficultyId = async (difficultyName: string): Promise<string | null> => {
  const { data } = await supabase
    .from('difficulty_levels')
    .select('id')
    .eq('name', difficultyName.charAt(0).toUpperCase() + difficultyName.slice(1).toLowerCase())
    .single();
  return data?.id || null;
};

export function QuizInterface({ user, settings, onComplete, onBack }: QuizInterfaceProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [timeLeft, setTimeLeft] = useState(settings.timePerQuestion);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bookmarked, setBookmarked] = useState<Set<string>>(new Set());
  const [answeredQuestions, setAnsweredQuestions] = useState<Set<string>>(new Set());
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [quizAttemptId, setQuizAttemptId] = useState<string | null>(null);
  const { toast } = useToast();

  const currentQuestion = questions[currentQuestionIndex];

  // Load questions from Supabase
  useEffect(() => {
    const loadQuestions = async () => {
      try {
        const languageId = await getLanguageId(settings.language);
        const difficultyId = await getDifficultyId(settings.difficulty);
        
        if (!languageId || !difficultyId) {
          toast({
            title: "Error",
            description: "Invalid language or difficulty selection",
            variant: "destructive",
          });
          return;
        }

        // Create quiz attempt
        const { data: attemptData, error: attemptError } = await supabase
          .from('quiz_attempts')
          .insert({
            user_id: user.id,
            language_id: languageId,
            difficulty_id: difficultyId,
            total_questions: 15, // We'll update this with actual count
            correct_answers: 0,
          })
          .select('id')
          .single();

        if (attemptError) throw attemptError;
        setQuizAttemptId(attemptData.id);

        // Fetch questions using the stored function
        const { data: questionsData, error } = await supabase.rpc('get_quiz_questions_payload', {
          p_attempt_id: attemptData.id,
          p_language_id: languageId,
          p_difficulty_id: difficultyId,
          p_limit: 15
        });

        if (error) throw error;

        const formattedQuestions: Question[] = questionsData.map((q: any) => {
          // Find correct answer index
          const correctOption = q.options.find((opt: any) => opt.is_correct);
          const correctAnswerIndex = correctOption ? correctOption.option_order - 1 : 0;
          
          return {
            id: q.id,
            question_text: q.question_text,
            options: q.options.sort((a: any, b: any) => a.option_order - b.option_order),
            correctAnswerIndex,
            explanation: q.explanation || 'No explanation available.',
            difficulty_id: q.difficulty_id,
            language_id: q.language_id,
            points: q.points || 10,
          };
        });

        setQuestions(formattedQuestions);
        
        // Update quiz attempt with actual question count
        await supabase
          .from('quiz_attempts')
          .update({ total_questions: formattedQuestions.length })
          .eq('id', attemptData.id);
          
      } catch (error) {
        console.error('Error loading questions:', error);
        toast({
          title: "Error",
          description: "Failed to load quiz questions. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadQuestions();
  }, [settings.language, settings.difficulty, user.id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 text-center">
          <h2 className="text-xl font-semibold mb-4">Loading Quiz...</h2>
          <Progress value={50} className="w-64" />
        </Card>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 text-center">
          <h2 className="text-xl font-semibold mb-4">No Questions Available</h2>
          <p className="text-muted-foreground mb-4">
            No questions found for {settings.language} - {settings.difficulty} level.
          </p>
          <Button onClick={onBack}>Back to Dashboard</Button>
        </Card>
      </div>
    );
  }

  useEffect(() => {
    if (timeLeft > 0 && !showResult) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !showResult) {
      handleTimeUp();
    }
  }, [timeLeft, showResult]);

  const handleTimeUp = () => {
    setShowResult(true);
    if (selectedAnswer === null) {
      setStreak(0);
    }
  };

  const handleAnswerSelect = (answerIndex: number) => {
    if (!showResult) {
      setSelectedAnswer(answerIndex);
    }
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null) return;
    
    setShowResult(true);
    const isCorrect = selectedAnswer === currentQuestion.correctAnswerIndex;
    
    if (isCorrect) {
      setScore(score + 1);
      setStreak(streak + 1);
    } else {
      setStreak(0);
    }
    
    setAnsweredQuestions(prev => new Set([...prev, currentQuestion.id]));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setShowResult(false);
      setShowHint(false);
      setTimeLeft(settings.timePerQuestion);
    } else {
      // Quiz complete
      onComplete();
    }
  };

  const toggleBookmark = () => {
    const newBookmarked = new Set(bookmarked);
    if (bookmarked.has(currentQuestion.id)) {
      newBookmarked.delete(currentQuestion.id);
    } else {
      newBookmarked.add(currentQuestion.id);
    }
    setBookmarked(newBookmarked);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const progressPercent = ((currentQuestionIndex + 1) / questions.length) * 100;
  const isCorrect = selectedAnswer === currentQuestion.correctAnswerIndex;

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="bg-primary/10 border-primary">
              {settings.language.toUpperCase()} - {settings.difficulty}
            </Badge>
            <div className="flex items-center gap-2 text-sm">
              <Target className="h-4 w-4 text-success" />
              <span>{score}/{questions.length}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Zap className="h-4 w-4 text-warning" />
              <span>{streak} streak</span>
            </div>
          </div>
        </div>

        {/* Progress */}
        <div className="mb-6">
          <div className="flex justify-between text-sm mb-2">
            <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
            <span>{Math.round(progressPercent)}% Complete</span>
          </div>
          <Progress value={progressPercent} className="h-3" />
        </div>

        {/* Quiz Card */}
        <Card className="p-8 bg-card/80 backdrop-blur-lg border-primary/20 shadow-glow">
          {/* Question Header */}
          <div className="flex items-center justify-between mb-6">
            <Badge variant="outline">Programming Quiz</Badge>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={toggleBookmark}
                className={bookmarked.has(currentQuestion.id) ? 'text-warning' : ''}
              >
                <Star className={`h-4 w-4 ${bookmarked.has(currentQuestion.id) ? 'fill-current' : ''}`} />
              </Button>
              <div className={`flex items-center gap-2 font-mono text-lg ${
                timeLeft <= 30 ? 'text-destructive animate-pulse' : 'text-primary'
              }`}>
                <Clock className="h-5 w-5" />
                {formatTime(timeLeft)}
              </div>
            </div>
          </div>

          {/* Question */}
          <h2 className="text-xl font-montserrat font-semibold mb-6 leading-relaxed">
            {currentQuestion.question_text}
          </h2>

          {/* Options */}
          <div className="space-y-3 mb-6">
            {currentQuestion.options.map((option, index) => {
              let buttonClass = 'w-full p-4 text-left transition-all duration-300 ';
              
              if (showResult) {
                if (index === currentQuestion.correctAnswerIndex) {
                  buttonClass += 'bg-success/20 border-success text-success-foreground';
                } else if (index === selectedAnswer && index !== currentQuestion.correctAnswerIndex) {
                  buttonClass += 'bg-destructive/20 border-destructive text-destructive-foreground';
                } else {
                  buttonClass += 'bg-muted/50 border-muted text-muted-foreground';
                }
              } else {
                if (index === selectedAnswer) {
                  buttonClass += 'bg-primary/20 border-primary shadow-glow';
                } else {
                  buttonClass += 'bg-muted/50 border-muted hover:bg-muted/80 hover:border-primary/50';
                }
              }

              return (
                <Button
                  key={index}
                  variant="outline"
                  className={buttonClass}
                  onClick={() => handleAnswerSelect(index)}
                  disabled={showResult}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-background/80 flex items-center justify-center text-sm font-semibold">
                      {String.fromCharCode(65 + index)}
                    </span>
                    <span className="flex-1">{option.option_text}</span>
                    {showResult && index === currentQuestion.correctAnswerIndex && (
                      <CheckCircle className="h-5 w-5 text-success" />
                    )}
                    {showResult && index === selectedAnswer && index !== currentQuestion.correctAnswerIndex && (
                      <XCircle className="h-5 w-5 text-destructive" />
                    )}
                  </div>
                </Button>
              );
            })}
          </div>

          {/* Hint */}
          {showHint && (
            <Card className="p-4 mb-6 bg-primary/10 border-primary/20">
              <div className="flex items-start gap-3">
                <Lightbulb className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <h4 className="font-medium text-primary mb-1">Hint</h4>
                  <p className="text-sm">Think carefully about the question and use your knowledge.</p>
                </div>
              </div>
            </Card>
          )}

          {/* Result Explanation */}
          {showResult && (
            <Card className={`p-4 mb-6 ${isCorrect ? 'bg-success/10 border-success/20' : 'bg-destructive/10 border-destructive/20'}`}>
              <div className="flex items-start gap-3">
                {isCorrect ? (
                  <CheckCircle className="h-5 w-5 text-success mt-0.5" />
                ) : (
                  <XCircle className="h-5 w-5 text-destructive mt-0.5" />
                )}
                <div>
                  <h4 className={`font-medium mb-1 ${isCorrect ? 'text-success' : 'text-destructive'}`}>
                    {isCorrect ? 'Correct!' : 'Incorrect'}
                  </h4>
                  <p className="text-sm">{currentQuestion.explanation}</p>
                </div>
              </div>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={() => setShowHint(!showHint)}
              disabled={showResult}
            >
              <Lightbulb className="h-4 w-4 mr-2" />
              {showHint ? 'Hide Hint' : 'Show Hint'}
            </Button>

            <div className="flex gap-3">
              {!showResult ? (
                <Button
                  onClick={handleSubmitAnswer}
                  disabled={selectedAnswer === null}
                  className="bg-gradient-primary hover:shadow-glow"
                >
                  Submit Answer
                </Button>
              ) : (
                <Button
                  onClick={handleNextQuestion}
                  className="bg-gradient-primary hover:shadow-glow"
                >
                  {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'Complete Quiz'}
                  {currentQuestionIndex < questions.length - 1 ? '' : (
                    <Trophy className="h-4 w-4 ml-2" />
                  )}
                </Button>
              )}
            </div>
          </div>
        </Card>

        {/* Streak Celebration */}
        {streak >= 3 && (
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 animate-celebration">
            <Card className="p-6 bg-gradient-primary text-primary-foreground shadow-glow">
              <div className="text-center">
                <Zap className="h-12 w-12 mx-auto mb-2" />
                <h3 className="text-xl font-bold">🔥 {streak} Question Streak!</h3>
                <p>You're on fire!</p>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}