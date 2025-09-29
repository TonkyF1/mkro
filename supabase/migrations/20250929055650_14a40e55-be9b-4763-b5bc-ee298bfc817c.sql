-- Create shopping_results table for storing enhanced shopping list data
CREATE TABLE public.shopping_results (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  product_name TEXT NOT NULL,
  gram_quantity NUMERIC NOT NULL,
  ingredient_type TEXT NOT NULL,
  store_name TEXT,
  store_availability JSONB DEFAULT '{}',
  estimated_price NUMERIC,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.shopping_results ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own shopping results" 
ON public.shopping_results 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own shopping results" 
ON public.shopping_results 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own shopping results" 
ON public.shopping_results 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own shopping results" 
ON public.shopping_results 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
NEW.updated_at = now();
RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_shopping_results_updated_at
BEFORE UPDATE ON public.shopping_results
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();