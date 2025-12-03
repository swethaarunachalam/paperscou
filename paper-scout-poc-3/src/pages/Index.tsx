import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Search, Target, Zap } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="container mx-auto px-4 py-20 md:py-32">
          <div className="text-center space-y-8 animate-fade-in">
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="p-3 bg-gradient-hero rounded-xl shadow-soft">
                <BookOpen className="h-10 w-10 text-primary-foreground" />
              </div>
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight">
              <span className="bg-gradient-hero bg-clip-text text-transparent">
                PaperScout
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Discover research papers tailored to your expertise and goals. 
              Accelerate your academic journey with intelligent recommendations.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link to="/register">
                <Button size="lg" className="text-lg px-8 shadow-hover">
                  Get Started
                </Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="outline" className="text-lg px-8">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>
        
        {/* Decorative gradient blur */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -z-10"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl -z-10"></div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Why Choose PaperScout?
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Powerful features designed to enhance your research experience
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="shadow-soft hover:shadow-hover transition-all duration-300 border-border/50 bg-gradient-card animate-fade-in">
            <CardHeader>
              <div className="p-3 bg-primary/10 rounded-lg w-fit mb-4">
                <Target className="h-8 w-8 text-primary" />
              </div>
              <CardTitle>Personalized Discovery</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base leading-relaxed">
                Get paper recommendations tailored to your research domain, expertise level, and learning goals.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="shadow-soft hover:shadow-hover transition-all duration-300 border-border/50 bg-gradient-card animate-fade-in" style={{ animationDelay: "0.1s" }}>
            <CardHeader>
              <div className="p-3 bg-accent/10 rounded-lg w-fit mb-4">
                <Search className="h-8 w-8 text-accent" />
              </div>
              <CardTitle>Smart Search</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base leading-relaxed">
                Find exactly what you need with advanced filtering by publication date, venue, and domain.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="shadow-soft hover:shadow-hover transition-all duration-300 border-border/50 bg-gradient-card animate-fade-in" style={{ animationDelay: "0.2s" }}>
            <CardHeader>
              <div className="p-3 bg-primary/10 rounded-lg w-fit mb-4">
                <Zap className="h-8 w-8 text-primary" />
              </div>
              <CardTitle>Feedback Loop</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base leading-relaxed">
                Help improve recommendations by providing feedback on papers, making your experience better over time.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <Card className="bg-gradient-hero text-primary-foreground shadow-hover border-0">
          <CardContent className="p-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Discover?
            </h2>
            <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
              Join researchers worldwide who trust PaperScout to stay ahead in their field
            </p>
            <Link to="/register">
              <Button size="lg" variant="secondary" className="text-lg px-8">
                Create Your Account
              </Button>
            </Link>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-card/30 backdrop-blur">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-gradient-hero rounded-lg">
                <BookOpen className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-bold bg-gradient-hero bg-clip-text text-transparent">
                PaperScout
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 PaperScout. Accelerating research discovery.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
