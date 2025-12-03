import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createProfile } from "@/lib/supabase";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { BookOpen } from "lucide-react";

const ProfileSetup = () => {
  const [domain, setDomain] = useState("");
  const [expertiseLevel, setExpertiseLevel] = useState("");
  const [goal, setGoal] = useState("");
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/login");
      } else {
        setUserId(session.user.id);
        setUserEmail(session.user.email || "");
      }
    };
    checkUser();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userId || !userEmail) {
      toast({
        title: "Error",
        description: "User session not found. Please log in again.",
        variant: "destructive",
      });
      return;
    }

    if (!domain || !expertiseLevel || !goal) {
      toast({
        title: "Validation Error",
        description: "Please fill in all fields.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    const { error } = await createProfile(
      userId,
      userEmail,
      domain,
      expertiseLevel,
      goal
    );

    if (error) {
      toast({
        title: "Profile Creation Failed",
        description: error.message,
        variant: "destructive",
      });
      setLoading(false);
    } else {
      toast({
        title: "Profile Created!",
        description: "Your profile has been set up successfully.",
      });
      navigate("/dashboard");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-secondary/20 to-background p-4">
      <div className="w-full max-w-2xl animate-fade-in">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="p-2 bg-gradient-hero rounded-lg">
              <BookOpen className="h-8 w-8 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold bg-gradient-hero bg-clip-text text-transparent">
              PaperScout
            </span>
          </div>
        </div>

        <Card className="shadow-soft border-border/50 bg-card/80 backdrop-blur">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Set Up Your Profile</CardTitle>
            <CardDescription className="text-center">
              Help us personalize your research experience
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="domain">Research Domain</Label>
                <Input
                  id="domain"
                  placeholder="e.g., AI, Healthcare, Physics"
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  What field are you primarily interested in?
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="expertise">Expertise Level</Label>
                <Select value={expertiseLevel} onValueChange={setExpertiseLevel} required>
                  <SelectTrigger id="expertise">
                    <SelectValue placeholder="Select your level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Beginner">Beginner</SelectItem>
                    <SelectItem value="Intermediate">Intermediate</SelectItem>
                    <SelectItem value="Expert">Expert</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  How familiar are you with research in this field?
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="goal">Primary Goal</Label>
                <Input
                  id="goal"
                  placeholder="e.g., Learning, Research, Teaching"
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  What do you hope to achieve with PaperScout?
                </p>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Creating profile..." : "Complete Setup"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfileSetup;
