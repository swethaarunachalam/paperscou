import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { useState } from "react";

interface PaperCardProps {
  paper: {
    id: string;
    title: string;
    authors: string[];
    abstract: string | null;
    publication_date: string | null;
    venue: string | null;
    domain: string | null;
  };
  onFeedback?: (paperId: string, isHelpful: boolean) => void;
}

export const PaperCard = ({ paper, onFeedback }: PaperCardProps) => {
  const [feedback, setFeedback] = useState<boolean | null>(null);

  const handleFeedback = (isHelpful: boolean) => {
    setFeedback(isHelpful);
    onFeedback?.(paper.id, isHelpful);
  };

  return (
    <Card className="transition-all duration-300 hover:shadow-hover animate-fade-in border-border/50 bg-gradient-card">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <CardTitle className="text-xl font-semibold text-foreground mb-2">
              {paper.title}
            </CardTitle>
            <CardDescription className="text-sm text-muted-foreground">
              {paper.authors.join(", ")}
            </CardDescription>
          </div>
          {paper.domain && (
            <Badge variant="secondary" className="shrink-0">
              {paper.domain}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {paper.abstract && (
          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
            {paper.abstract}
          </p>
        )}
        <div className="flex items-center justify-between pt-2 border-t border-border/50">
          <div className="flex gap-2 text-xs text-muted-foreground">
            {paper.venue && <span className="font-medium">{paper.venue}</span>}
            {paper.publication_date && (
              <span>
                {new Date(paper.publication_date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                })}
              </span>
            )}
          </div>
          {onFeedback && (
            <div className="flex gap-2">
              <Button
                size="sm"
                variant={feedback === true ? "default" : "outline"}
                onClick={() => handleFeedback(true)}
                className="gap-1"
              >
                <ThumbsUp className="h-3 w-3" />
                Helpful
              </Button>
              <Button
                size="sm"
                variant={feedback === false ? "destructive" : "outline"}
                onClick={() => handleFeedback(false)}
                className="gap-1"
              >
                <ThumbsDown className="h-3 w-3" />
                Not Helpful
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
