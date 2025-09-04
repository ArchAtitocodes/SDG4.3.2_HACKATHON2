import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Brain, Code, Sparkles, Globe, User as UserIcon } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { User } from '@/pages/Index';

interface AuthModalProps {
  onAuthSuccess: (user: User) => void;
}

export function AuthModal({ onAuthSuccess }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    sex: '',
    age: '',
    nation: '',
    nearestTown: '',
    phone: '',
    educationLevel: '',
    fieldOfStudy: '',
    programmingExperience: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (isLogin) {
        // Login user
        const { data: authData, error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });

        if (error) throw error;

        if (authData.user) {
          // Fetch user profile
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', authData.user.id)
            .single();

          const user: User = {
            id: authData.user.id,
            name: profile?.full_name || authData.user.email?.split('@')[0] || 'User',
            email: authData.user.email || '',
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
          
          onAuthSuccess(user);
        }
      } else {
        // Sign up user
        if (formData.password !== formData.confirmPassword) {
          throw new Error('Passwords do not match');
        }

        const redirectUrl = `${window.location.origin}/`;
        
        const { data: authData, error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            emailRedirectTo: redirectUrl,
            data: {
              full_name: formData.name,
            }
          }
        });

        if (error) throw error;

        if (authData.user) {
          // Create/update profile with additional demographics
          await supabase
            .from('profiles')
            .upsert({
              id: authData.user.id,
              full_name: formData.name,
              username: formData.email.split('@')[0],
            });

          toast({
            title: "Account created successfully!",
            description: "Please check your email to verify your account.",
          });

          // For immediate login after signup (if email confirmation is disabled)
          const user: User = {
            id: authData.user.id,
            name: formData.name,
            email: formData.email,
            demographics: {
              sex: formData.sex,
              age: parseInt(formData.age) || 25,
              nation: formData.nation,
              nearestTown: formData.nearestTown,
              phone: formData.phone,
              educationLevel: formData.educationLevel,
              fieldOfStudy: formData.fieldOfStudy,
              programmingExperience: formData.programmingExperience
            },
            stats: {
              totalQuizzes: 0,
              correctAnswers: 0,
              streakCount: 0,
              badgesEarned: [],
              xpPoints: 0,
              level: 1
            }
          };
          
          onAuthSuccess(user);
        }
      }
    } catch (error: any) {
      console.error('Auth error:', error);
      toast({
        title: "Authentication Error",
        description: error.message || "An error occurred during authentication",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* App Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="relative">
              <Brain className="h-12 w-12 text-primary animate-neural-pulse" />
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-lg" />
            </div>
            <Code className="h-10 w-10 text-silver animate-glow-pulse" />
            <Sparkles className="h-8 w-8 text-primary-glow" />
          </div>
          <h1 className="text-3xl font-montserrat font-bold text-foreground mb-2">
            EASYCODE REVISION
          </h1>
          <Badge variant="outline" className="bg-primary/10 border-primary text-primary-glow">
            SDG 4.3.2 Support App
          </Badge>
          <p className="text-sm text-muted-foreground mt-2">
            By Stephen Odhiambo
          </p>
        </div>

        <Card className="p-6 bg-card/80 backdrop-blur-lg border-primary/20 shadow-glow">
          <div className="flex gap-1 mb-6">
            <Button
              variant={isLogin ? "default" : "outline"}
              onClick={() => setIsLogin(true)}
              className="flex-1"
            >
              Login
            </Button>
            <Button
              variant={!isLogin ? "default" : "outline"}
              onClick={() => setIsLogin(false)}
              className="flex-1"
            >
              Sign Up
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <Input
                type="text"
                placeholder="Full Name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({...prev, name: e.target.value}))}
                className="bg-muted/50 border-primary/20 focus:border-primary"
                required
              />
            )}
            
            <Input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({...prev, email: e.target.value}))}
              className="bg-muted/50 border-primary/20 focus:border-primary"
              required
            />
            
            <Input
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={(e) => setFormData(prev => ({...prev, password: e.target.value}))}
              className="bg-muted/50 border-primary/20 focus:border-primary"
              required
            />

            {!isLogin && (
              <>
                <Input
                  type="password"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData(prev => ({...prev, confirmPassword: e.target.value}))}
                  className="bg-muted/50 border-primary/20 focus:border-primary"
                  required
                />

                {/* Demographics Section */}
                <div className="pt-4 border-t border-primary/20">
                  <h3 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
                    <UserIcon className="h-4 w-4" />
                    Demographics (SDG 4.3.2 Tracking)
                  </h3>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <Select onValueChange={(value) => setFormData(prev => ({...prev, sex: value}))}>
                      <SelectTrigger className="bg-muted/50 border-primary/20">
                        <SelectValue placeholder="Sex" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Input
                      type="number"
                      placeholder="Age"
                      value={formData.age}
                      onChange={(e) => setFormData(prev => ({...prev, age: e.target.value}))}
                      className="bg-muted/50 border-primary/20 focus:border-primary"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 mt-3">
                    <Select onValueChange={(value) => setFormData(prev => ({...prev, nation: value}))}>
                      <SelectTrigger className="bg-muted/50 border-primary/20">
                        <SelectValue placeholder="Country" />
                      </SelectTrigger>
                      <SelectContent className="max-h-60 overflow-y-auto">
                        <SelectItem value="dz">🇩🇿 Algeria (+213)</SelectItem>
                        <SelectItem value="ao">🇦🇴 Angola (+244)</SelectItem>
                        <SelectItem value="bj">🇧🇯 Benin (+229)</SelectItem>
                        <SelectItem value="bw">🇧🇼 Botswana (+267)</SelectItem>
                        <SelectItem value="bf">🇧🇫 Burkina Faso (+226)</SelectItem>
                        <SelectItem value="bi">🇧🇮 Burundi (+257)</SelectItem>
                        <SelectItem value="cv">🇨🇻 Cape Verde (+238)</SelectItem>
                        <SelectItem value="cm">🇨🇲 Cameroon (+237)</SelectItem>
                        <SelectItem value="cf">🇨🇫 Central African Rep. (+236)</SelectItem>
                        <SelectItem value="td">🇹🇩 Chad (+235)</SelectItem>
                        <SelectItem value="km">🇰🇲 Comoros (+269)</SelectItem>
                        <SelectItem value="cg">🇨🇬 Congo (+242)</SelectItem>
                        <SelectItem value="cd">🇨🇩 DR Congo (+243)</SelectItem>
                        <SelectItem value="dj">🇩🇯 Djibouti (+253)</SelectItem>
                        <SelectItem value="eg">🇪🇬 Egypt (+20)</SelectItem>
                        <SelectItem value="gq">🇬🇶 Equatorial Guinea (+240)</SelectItem>
                        <SelectItem value="er">🇪🇷 Eritrea (+291)</SelectItem>
                        <SelectItem value="sz">🇸🇿 Eswatini (+268)</SelectItem>
                        <SelectItem value="et">🇪🇹 Ethiopia (+251)</SelectItem>
                        <SelectItem value="ga">🇬🇦 Gabon (+241)</SelectItem>
                        <SelectItem value="gm">🇬🇲 Gambia (+220)</SelectItem>
                        <SelectItem value="gh">🇬🇭 Ghana (+233)</SelectItem>
                        <SelectItem value="gn">🇬🇳 Guinea (+224)</SelectItem>
                        <SelectItem value="gw">🇬🇼 Guinea-Bissau (+245)</SelectItem>
                        <SelectItem value="ci">🇨🇮 Ivory Coast (+225)</SelectItem>
                        <SelectItem value="ke">🇰🇪 Kenya (+254)</SelectItem>
                        <SelectItem value="ls">🇱🇸 Lesotho (+266)</SelectItem>
                        <SelectItem value="lr">🇱🇷 Liberia (+231)</SelectItem>
                        <SelectItem value="ly">🇱🇾 Libya (+218)</SelectItem>
                        <SelectItem value="mg">🇲🇬 Madagascar (+261)</SelectItem>
                        <SelectItem value="mw">🇲🇼 Malawi (+265)</SelectItem>
                        <SelectItem value="ml">🇲🇱 Mali (+223)</SelectItem>
                        <SelectItem value="mr">🇲🇷 Mauritania (+222)</SelectItem>
                        <SelectItem value="mu">🇲🇺 Mauritius (+230)</SelectItem>
                        <SelectItem value="ma">🇲🇦 Morocco (+212)</SelectItem>
                        <SelectItem value="mz">🇲🇿 Mozambique (+258)</SelectItem>
                        <SelectItem value="na">🇳🇦 Namibia (+264)</SelectItem>
                        <SelectItem value="ne">🇳🇪 Niger (+227)</SelectItem>
                        <SelectItem value="ng">🇳🇬 Nigeria (+234)</SelectItem>
                        <SelectItem value="rw">🇷🇼 Rwanda (+250)</SelectItem>
                        <SelectItem value="st">🇸🇹 São Tomé and Príncipe (+239)</SelectItem>
                        <SelectItem value="sn">🇸🇳 Senegal (+221)</SelectItem>
                        <SelectItem value="sc">🇸🇨 Seychelles (+248)</SelectItem>
                        <SelectItem value="sl">🇸🇱 Sierra Leone (+232)</SelectItem>
                        <SelectItem value="so">🇸🇴 Somalia (+252)</SelectItem>
                        <SelectItem value="za">🇿🇦 South Africa (+27)</SelectItem>
                        <SelectItem value="ss">🇸🇸 South Sudan (+211)</SelectItem>
                        <SelectItem value="sd">🇸🇩 Sudan (+249)</SelectItem>
                        <SelectItem value="tz">🇹🇿 Tanzania (+255)</SelectItem>
                        <SelectItem value="tg">🇹🇬 Togo (+228)</SelectItem>
                        <SelectItem value="tn">🇹🇳 Tunisia (+216)</SelectItem>
                        <SelectItem value="ug">🇺🇬 Uganda (+256)</SelectItem>
                        <SelectItem value="zm">🇿🇲 Zambia (+260)</SelectItem>
                        <SelectItem value="zw">🇿🇼 Zimbabwe (+263)</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Input
                      type="text"
                      placeholder="Nearest Town"
                      value={formData.nearestTown}
                      onChange={(e) => setFormData(prev => ({...prev, nearestTown: e.target.value}))}
                      className="bg-muted/50 border-primary/20 focus:border-primary"
                    />
                  </div>
                  
                  <Input
                    type="tel"
                    placeholder="Phone Number"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({...prev, phone: e.target.value}))}
                    className="bg-muted/50 border-primary/20 focus:border-primary mt-3"
                  />
                  
                  <Select onValueChange={(value) => setFormData(prev => ({...prev, programmingExperience: value}))}>
                    <SelectTrigger className="bg-muted/50 border-primary/20 mt-3">
                      <SelectValue placeholder="Programming Experience" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">🌱 Beginner (0-1 years)</SelectItem>
                      <SelectItem value="intermediate">🔧 Intermediate (1-3 years)</SelectItem>
                      <SelectItem value="advanced">🚀 Advanced (3+ years)</SelectItem>
                      <SelectItem value="expert">⭐ Expert (5+ years)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}

            <Button 
              type="submit" 
              disabled={loading}
              className="w-full bg-gradient-primary hover:shadow-glow transition-all duration-300"
            >
              {loading ? 'Processing...' : (isLogin ? 'Login' : 'Create Account')}
            </Button>
          </form>
        </Card>

        <div className="text-center mt-6 text-sm text-muted-foreground">
          <p>🎯 Supporting SDG 4.3.2: Equal access to quality education</p>
        </div>
      </div>
    </div>
  );
}