-- Create the Categories Table
CREATE TABLE public.categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name_en TEXT NOT NULL,
    name_ta TEXT,
    icon TEXT,
    color TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create the Products Table
CREATE TABLE public.products (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    category_id UUID REFERENCES public.categories(id),
    name_en TEXT NOT NULL,
    name_ta TEXT,
    description_en TEXT,
    description_ta TEXT,
    price NUMERIC NOT NULL,
    unit TEXT,
    image TEXT,
    in_stock BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false,
    is_new BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Create Policies (Allow Public Read, Allow Admin Insert/Update/Delete)
-- For now, we will allow public read access
CREATE POLICY "Enable read access for all users" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON public.products FOR SELECT USING (true);

-- For simple admin usage (without complex auth setup initially), we can create a policy 
-- that allows write access if the user is authenticated (using Supabase Auth which we will setup later)
-- OR for development, you can temporarily allow all operations:
-- CREATE POLICY "Enable write access for all users" ON public.products FOR ALL USING (true);
