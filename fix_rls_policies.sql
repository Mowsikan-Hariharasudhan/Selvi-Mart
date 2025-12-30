-- Update Policies to allow Admin operations (Insert, Update, Delete)
-- Since we are currently using a simple frontend password and not Supabase Auth,
-- we need to allow the "anon" key to perform these operations.

-- Policy for Products table
CREATE POLICY "Enable write access for all users" 
ON public.products 
FOR ALL 
USING (true) 
WITH CHECK (true);

-- Policy for Categories table
CREATE POLICY "Enable write access for all users" 
ON public.categories 
FOR ALL 
USING (true) 
WITH CHECK (true);
