import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, Category } from '@/data/products';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ProductContextType {
    products: Product[];
    categories: Category[];
    addProduct: (product: Omit<Product, 'id'>) => Promise<void>;
    updateProduct: (id: string, product: Partial<Product>) => Promise<void>;
    deleteProduct: (id: string) => Promise<void>;
    addCategory: (category: Omit<Category, 'id'>) => Promise<void>;
    deleteCategory: (id: string) => Promise<void>;
    getProductsByCategory: (categoryId: string) => Product[];
    getFeaturedProducts: () => Product[];
    getNewArrivals: () => Product[];
    searchProducts: (query: string) => Product[];
    uploadImage: (file: File) => Promise<string | null>;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchCategories = async () => {
        const { data, error } = await supabase.from('categories').select('*');
        if (error) {
            console.error('Error fetching categories:', error);
            toast.error('Failed to load categories');
            return;
        }

        const mappedCategories: Category[] = data.map((item: any) => ({
            id: item.id,
            name: {
                en: item.name_en,
                ta: item.name_ta || ''
            },
            icon: item.icon,
            color: item.color
        }));
        setCategories(mappedCategories);
    };

    const fetchProducts = async () => {
        const { data, error } = await supabase.from('products').select('*');
        if (error) {
            console.error('Error fetching products:', error);
            toast.error('Failed to load products');
            return;
        }

        const mappedProducts: Product[] = data.map((item: any) => ({
            id: item.id,
            category: item.category_id,
            name: {
                en: item.name_en,
                ta: item.name_ta || ''
            },
            description: {
                en: item.description_en || '',
                ta: item.description_ta || ''
            },
            price: Number(item.price),
            unit: item.unit,
            image: item.image,
            inStock: item.in_stock,
            featured: item.is_featured,
            isNew: item.is_new,
            variants: item.variants || []
        }));
        setProducts(mappedProducts);
    };

    const refreshData = async () => {
        setLoading(true);
        await Promise.all([fetchCategories(), fetchProducts()]);
        setLoading(false);
    };

    useEffect(() => {
        refreshData();
    }, []);

    const uploadImage = async (file: File): Promise<string | null> => {
        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const filePath = `${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('product-images')
                .upload(filePath, file);

            if (uploadError) {
                throw uploadError;
            }

            const { data } = supabase.storage
                .from('product-images')
                .getPublicUrl(filePath);

            return data.publicUrl;
        } catch (error) {
            console.error('Error uploading image:', error);
            toast.error('Failed to upload image');
            return null;
        }
    };

    const addProduct = async (productData: Omit<Product, 'id'>) => {
        try {
            const dbProduct = {
                category_id: productData.category,
                name_en: productData.name.en,
                name_ta: productData.name.ta,
                description_en: productData.description.en,
                description_ta: productData.description.ta,
                price: productData.price,
                unit: productData.unit,
                image: productData.image,
                in_stock: productData.inStock,
                is_featured: productData.featured || false,
                is_new: productData.isNew || false,
                variants: productData.variants || []
            };

            const { error } = await supabase.from('products').insert(dbProduct);

            if (error) throw error;

            await fetchProducts();
            toast.success('Product added successfully to database');
        } catch (error) {
            console.error('Error adding product:', error);
            toast.error('Failed to add product');
        }
    };

    const updateProduct = async (id: string, productData: Partial<Product>) => {
        try {
            const updates: any = {};
            if (productData.category) updates.category_id = productData.category;
            if (productData.name) {
                if (productData.name.en) updates.name_en = productData.name.en;
                if (productData.name.ta) updates.name_ta = productData.name.ta;
            }
            if (productData.description) {
                if (productData.description.en) updates.description_en = productData.description.en;
                if (productData.description.ta) updates.description_ta = productData.description.ta;
            }
            if (productData.price !== undefined) updates.price = productData.price;
            if (productData.unit) updates.unit = productData.unit;
            if (productData.image) updates.image = productData.image;
            if (productData.inStock !== undefined) updates.in_stock = productData.inStock;
            if (productData.featured !== undefined) updates.is_featured = productData.featured;
            if (productData.isNew !== undefined) updates.is_new = productData.isNew;
            if (productData.variants !== undefined) updates.variants = productData.variants;

            const { error } = await supabase.from('products').update(updates).eq('id', id);

            if (error) throw error;

            await fetchProducts();
            toast.success('Product updated');
        } catch (error) {
            console.error('Error updating product:', error);
            toast.error('Failed to update product');
        }
    };

    const deleteProduct = async (id: string) => {
        try {
            const { error } = await supabase.from('products').delete().eq('id', id);
            if (error) throw error;

            await fetchProducts();
            toast.success('Product deleted');
        } catch (error) {
            console.error('Error deleting product:', error);
            toast.error('Failed to delete product');
        }
    };

    const addCategory = async (categoryData: Omit<Category, 'id'>) => {
        try {
            const dbCategory = {
                name_en: categoryData.name.en,
                name_ta: categoryData.name.ta,
                icon: categoryData.icon,
                color: categoryData.color
            };

            const { error } = await supabase.from('categories').insert(dbCategory);
            if (error) throw error;

            await fetchCategories();
            toast.success('Category created');
        } catch (error) {
            console.error('Error adding category:', error);
            toast.error('Failed to add category');
        }
    };

    const deleteCategory = async (id: string) => {
        try {
            const { error } = await supabase.from('categories').delete().eq('id', id);
            if (error) throw error;

            await fetchCategories();
            toast.success('Category deleted');
        } catch (error) {
            console.error('Error deleting category:', error);
            toast.error('Failed to delete category');
        }
    };

    // Derived state selectors
    const getProductsByCategory = (categoryId: string) => {
        if (categoryId === 'all') return products;
        return products.filter(p => p.category === categoryId);
    };

    const getFeaturedProducts = () => products.filter(p => p.featured);

    const getNewArrivals = () => products.filter(p => p.isNew);

    const searchProducts = (query: string) => {
        const lowerQuery = query.toLowerCase();
        return products.filter(p =>
            p.name.en.toLowerCase().includes(lowerQuery) ||
            p.name.ta.includes(query) ||
            p.description.en.toLowerCase().includes(lowerQuery) ||
            p.description.ta.includes(query)
        );
    };

    return (
        <ProductContext.Provider value={{
            products,
            categories,
            addProduct,
            updateProduct,
            deleteProduct,
            addCategory,
            deleteCategory,
            getProductsByCategory,
            getFeaturedProducts,
            getNewArrivals,
            searchProducts,
            uploadImage
        }}>
            {children}
        </ProductContext.Provider>
    );
};

export const useProducts = () => {
    const context = useContext(ProductContext);
    if (context === undefined) {
        throw new Error('useProducts must be used within a ProductProvider');
    }
    return context;
};
