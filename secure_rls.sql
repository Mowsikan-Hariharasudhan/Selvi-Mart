-- 1. DROP EXISTING INSECURE POLICIES
-- Drop the development policies we created earlier
DROP POLICY IF EXISTS "Enable write access for all users" ON public.products;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.products;
DROP POLICY IF EXISTS "Enable write access for all users" ON public.categories;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.categories;

-- 2. SECURE PRODUCTS TABLE
-- Allow EVERYONE to SEE products (Customers need this)
CREATE POLICY "Public Read Products" 
ON public.products FOR SELECT 
USING (true);

-- Allow ONLY AUTHENTICATED USERS to ADD/EDIT/DELETE products (Only you)
CREATE POLICY "Admin Full Access Products" 
ON public.products FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);

-- 3. SECURE CATEGORIES TABLE
-- Allow EVERYONE to SEE categories
CREATE POLICY "Public Read Categories" 
ON public.categories FOR SELECT 
USING (true);

-- Allow ONLY AUTHENTICATED USERS to ADD/EDIT/DELETE categories
CREATE POLICY "Admin Full Access Categories" 
ON public.categories FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);

-- 4. SECURE STORAGE (IMAGES)
-- Drop existing upload policy
DROP POLICY IF EXISTS "Allow Uploads" ON storage.objects;
DROP POLICY IF EXISTS "Allow Deletes" ON storage.objects;

-- Allow ONLY AUTHENTICATED USERS to UPLOAD/DELETE images
CREATE POLICY "Admin Upload Images" 
ON storage.objects FOR INSERT 
TO authenticated 
WITH CHECK ( bucket_id = 'product-images' );

CREATE POLICY "Admin Delete Images" 
ON storage.objects FOR DELETE 
TO authenticated 
USING ( bucket_id = 'product-images' );

-- Ensure public can still VIEW images (This is likely already there, but good to ensure)
-- CREATE POLICY "Public View Images" ON storage.objects FOR SELECT USING ( bucket_id = 'product-images' );
