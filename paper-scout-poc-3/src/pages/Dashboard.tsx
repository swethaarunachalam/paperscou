import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PaperCard } from "@/components/PaperCard";
import { getPapers, getProfile, signOut, submitFeedback } from "@/lib/supabase";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { BookOpen, LogOut, Search, User } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface Paper {
  id: string;
  title: string;
  authors: string[];
  abstract: string | null;
  publication_date: string | null;
  venue: string | null;
  domain: string | null;
}

const Dashboard = () => {
  const [papers, setPapers] = useState<Paper[]>([]);
  const [filteredPapers, setFilteredPapers] = useState<Paper[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<any>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const initDashboard = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate("/login");
        return;
      }

      const { data: profile } = await getProfile(session.user.id);
      setUserProfile(profile);

      const { data: papersData, error } = await getPapers();
      
      if (error) {
        toast({
          title: "Error Loading Papers",
          description: error.message,
          variant: "destructive",
        });
      } else if (papersData) {
        setPapers(papersData);
        setFilteredPapers(papersData);
      }
      
      setLoading(false);
    };

    initDashboard();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_OUT") {
        navigate("/login");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, toast]);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredPapers(papers);
    } else {
      const filtered = papers.filter(
        (paper) =>
          paper.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          paper.authors.some((author) =>
            author.toLowerCase().includes(searchQuery.toLowerCase())
          ) ||
          paper.domain?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredPapers(filtered);
    }
  }, [searchQuery, papers]);

  const handleLogout = async () => {
    await signOut();
    toast({
      title: "Logged out",
      description: "You've been successfully logged out.",
    });
  };

  const handleFeedback = async (paperId: string, isHelpful: boolean) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const { error } = await submitFeedback(session.user.id, paperId, isHelpful);
    
    if (error) {
      toast({
        title: "Error",
        description: "Failed to submit feedback.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Thank you!",
        description: "Your feedback has been recorded.",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your research dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/10 to-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-gradient-hero rounded-lg">
                <BookOpen className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold bg-gradient-hero bg-clip-text text-transparent">
                PaperScout
              </span>
            </div>
            
            <div className="flex items-center gap-4">
              {userProfile && (
                <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground">
                  <Avatar className="h-8 w-8 border-2 border-primary/20">
                    <AvatarFallback className="bg-secondary text-secondary-foreground">
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-foreground">{userProfile.email}</p>
                    <p className="text-xs">{userProfile.domain} • {userProfile.expertise_level}</p>
                  </div>
                </div>
              )}
              <Button variant="outline" size="sm" onClick={handleLogout} className="gap-2">
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Discover Research Papers
          </h1>
          <p className="text-muted-foreground">
            Explore cutting-edge research tailored to your interests
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8 animate-slide-in">
          <div className="relative max-w-2xl">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by title, author, or domain..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12 shadow-soft"
            />
          </div>
        </div>

        {/* Papers Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredPapers.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-muted-foreground">No papers found matching your search.</p>
            </div>
          ) : (
            filteredPapers.map((paper, index) => (
              <div
                key={paper.id}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <PaperCard paper={paper} onFeedback={handleFeedback} />
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
