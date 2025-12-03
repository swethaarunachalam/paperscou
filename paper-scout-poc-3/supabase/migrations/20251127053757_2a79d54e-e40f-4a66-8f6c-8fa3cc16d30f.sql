-- Create profiles table for user information
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE,
  email TEXT NOT NULL,
  domain TEXT,
  expertise_level TEXT CHECK (expertise_level IN ('Beginner', 'Intermediate', 'Expert')),
  goal TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Policies for profiles
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid()::text = user_id::text);

-- Create papers table
CREATE TABLE public.papers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  authors TEXT[] NOT NULL,
  abstract TEXT,
  publication_date DATE,
  venue TEXT,
  domain TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS for papers (public read access)
ALTER TABLE public.papers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view papers"
  ON public.papers FOR SELECT
  USING (true);

-- Create feedback table
CREATE TABLE public.feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  paper_id UUID NOT NULL REFERENCES public.papers(id) ON DELETE CASCADE,
  is_helpful BOOLEAN NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, paper_id)
);

-- Enable RLS for feedback
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own feedback"
  ON public.feedback FOR SELECT
  USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert their own feedback"
  ON public.feedback FOR INSERT
  WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update their own feedback"
  ON public.feedback FOR UPDATE
  USING (auth.uid()::text = user_id::text);

-- Function to update timestamps
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for profiles updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Insert some sample papers for demonstration
INSERT INTO public.papers (title, authors, abstract, publication_date, venue, domain) VALUES
('Deep Learning for Computer Vision', ARRAY['John Smith', 'Jane Doe'], 'A comprehensive review of deep learning techniques in computer vision applications.', '2024-01-15', 'CVPR 2024', 'AI'),
('Quantum Computing Applications', ARRAY['Alice Johnson'], 'Exploring practical applications of quantum computing in cryptography.', '2024-02-20', 'Nature', 'Computer Science'),
('Machine Learning in Healthcare', ARRAY['Bob Wilson', 'Carol Martinez'], 'Novel approaches to disease prediction using machine learning algorithms.', '2023-12-10', 'JAMA', 'Healthcare'),
('Natural Language Processing Advances', ARRAY['David Lee'], 'Recent breakthroughs in transformer-based NLP models.', '2024-03-05', 'ACL 2024', 'AI'),
('Blockchain Technology Review', ARRAY['Emma Brown', 'Frank Taylor'], 'A systematic review of blockchain applications beyond cryptocurrency.', '2023-11-30', 'IEEE Transactions', 'Computer Science');