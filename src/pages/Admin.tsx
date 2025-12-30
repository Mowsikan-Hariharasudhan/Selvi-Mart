import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Plus,
    Trash2,
    Edit,
    Package,
    Layers,
    Settings,
    LogOut,
    ChevronRight,
    TrendingUp,
    Box,
    CheckCircle2,
    XCircle,
    Image as ImageIcon,
    Languages,
    ArrowLeft,
    Upload,
    Loader2
} from 'lucide-react';
import { useProducts } from '@/contexts/ProductContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
    DialogClose
} from '@/components/ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Link } from 'react-router-dom';

import { supabase } from '@/integrations/supabase/client';

interface AdminProductState {
    name: { en: string; ta: string };
    description: { en: string; ta: string };
    price: number;
    unit: string;
    category: string;
    image: string;
    inStock: boolean;
    featured: boolean;
    isNew: boolean;
    variants: { unit: string; price: number }[];
}

const initialProductState: AdminProductState = {
    name: { en: '', ta: '' },
    description: { en: '', ta: '' },
    price: 0,
    unit: '',
    category: '',
    image: '',
    inStock: true,
    featured: false,
    isNew: true,
    variants: []
};

interface AdminCategoryState {
    name: { en: string; ta: string };
    icon: string;
    color: string;
}

const initialCategoryState: AdminCategoryState = {
    name: { en: '', ta: '' },
    icon: 'Package',
    color: 'blue'
};

const Admin = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [email, setEmail] = useState(''); // New Email State
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const { products, categories, addProduct, updateProduct, deleteProduct, addCategory, deleteCategory, uploadImage } = useProducts();
    const { language } = useLanguage();

    // Check for existing session on load
    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setIsAuthenticated(!!session);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setIsAuthenticated(!!session);
        });

        return () => subscription.unsubscribe();
    }, []);

    // Form states
    const [newProduct, setNewProduct] = useState<AdminProductState>(initialProductState);
    const [newCategory, setNewCategory] = useState<AdminCategoryState>(initialCategoryState);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState('products');
    const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);

    // New variant state
    const [variantUnit, setVariantUnit] = useState('');
    const [variantPrice, setVariantPrice] = useState('');

    // Image upload state
    const [isDragging, setIsDragging] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement> | React.DragEvent) => {
        let file: File | null = null;

        if ('dataTransfer' in e) {
            e.preventDefault();
            file = e.dataTransfer.files[0];
        } else if (e.target.files) {
            file = e.target.files[0];
        }

        if (!file) return;

        if (!file.type.startsWith('image/')) {
            toast.error('Please upload an image file');
            return;
        }

        setIsUploading(true);
        const url = await uploadImage(file);
        setIsUploading(false);

        if (url) {
            setNewProduct(prev => ({ ...prev, image: url }));
            toast.success('Image uploaded successfully');
        }
    };


    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password
            });

            if (error) {
                toast.error(error.message);
            } else {
                toast.success("Welcome back, Admin!");
            }
        } catch (err) {
            toast.error("An unexpected error occurred");
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        setIsAuthenticated(false);
        toast.info("Logged out successfully");
    };

    const addVariant = () => {
        if (!variantUnit || !variantPrice) {
            toast.error("Please enter both unit and price for the variant");
            return;
        }
        setNewProduct({
            ...newProduct,
            variants: [...newProduct.variants, { unit: variantUnit, price: parseFloat(variantPrice) }]
        });
        setVariantUnit('');
        setVariantPrice('');
    };

    const removeVariant = (index: number) => {
        const newVariants = [...newProduct.variants];
        newVariants.splice(index, 1);
        setNewProduct({ ...newProduct, variants: newVariants });
    };

    const handleCreateProduct = async () => {
        if (!newProduct.name.en || !newProduct.category || newProduct.price <= 0) {
            toast.error("Please fill in all required fields (Name, Category, Price)");
            return;
        }
        await addProduct(newProduct);
        setNewProduct(initialProductState);
        setIsDialogOpen(false);
    };

    const handleUpdateProduct = async () => {
        if (editingId) {
            await updateProduct(editingId, newProduct);
            setEditingId(null);
            setNewProduct(initialProductState);
            setIsDialogOpen(false);
        }
    };

    const handleCreateCategory = async () => {
        if (!newCategory.name.en) {
            toast.error("Category name is required");
            return;
        }
        await addCategory(newCategory);
        setNewCategory(initialCategoryState);
        setIsCategoryDialogOpen(false);
    };

    const startEdit = (product: any) => {
        setEditingId(product.id);
        setNewProduct({
            name: { en: product.name.en, ta: product.name.ta },
            description: { en: product.description.en, ta: product.description.ta },
            price: product.price,
            unit: product.unit,
            category: product.category,
            image: product.image,
            inStock: product.inStock,
            featured: product.featured || false,
            isNew: product.isNew || false,
            variants: product.variants || []
        });
        setIsDialogOpen(true);
    };

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] p-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full max-w-md"
                >
                    <Card className="shadow-2xl border-none overflow-hidden">
                        <div className="h-2 bg-primary w-full" />
                        <CardHeader className="text-center pt-10 pb-6">
                            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
                                <Settings className="w-8 h-8 text-primary" />
                            </div>
                            <CardTitle className="text-3xl font-bold font-heading">Admin Portal</CardTitle>
                            <CardDescription>Secure Login</CardDescription>
                        </CardHeader>
                        <CardContent className="px-10 pb-10">
                            <form onSubmit={handleLogin} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email Address</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="admin@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="h-12 text-lg"
                                        required
                                        disabled={isLoading}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="password">Password</Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="h-12 text-lg"
                                        required
                                        disabled={isLoading}
                                    />
                                </div>
                                <Button type="submit" className="w-full h-12 text-lg font-semibold rounded-xl" disabled={isLoading}>
                                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Log In'}
                                </Button>
                                <div className="text-center mt-6">
                                    <Link to="/" className="text-sm text-muted-foreground hover:text-primary flex items-center justify-center gap-1 transition-colors">
                                        <ArrowLeft className="w-4 h-4" /> Back to Storefront
                                    </Link>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f1f5f9] flex flex-col lg:flex-row">
            {/* Sidebar for Admin */}
            <aside className="w-full lg:w-72 bg-white border-r border-slate-200 lg:sticky lg:top-0 lg:h-screen p-6 flex flex-col">
                <div className="flex items-center gap-3 mb-10">
                    <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/20">
                        <Package className="w-6 h-6" />
                    </div>
                    <span className="font-heading font-bold text-xl tracking-tight">FreshCart Admin</span>
                </div>

                <nav className="flex-1 space-y-2">
                    <Button
                        variant="ghost"
                        onClick={() => setActiveTab('dashboard')}
                        className={`w-full justify-start gap-3 h-12 ${activeTab === 'dashboard' ? 'bg-slate-50 text-primary font-semibold' : 'text-slate-600 hover:bg-slate-50 hover:text-primary'}`}
                    >
                        <TrendingUp className="w-5 h-5" /> Dashboard
                    </Button>
                    <Button
                        variant="ghost"
                        onClick={() => setActiveTab('products')}
                        className={`w-full justify-start gap-3 h-12 ${activeTab === 'products' ? 'bg-slate-50 text-primary font-semibold' : 'text-slate-600 hover:bg-slate-50 hover:text-primary'}`}
                    >
                        <Package className="w-5 h-5" /> Products
                    </Button>
                    <Button
                        variant="ghost"
                        onClick={() => setActiveTab('categories')}
                        className={`w-full justify-start gap-3 h-12 ${activeTab === 'categories' ? 'bg-slate-50 text-primary font-semibold' : 'text-slate-600 hover:bg-slate-50 hover:text-primary'}`}
                    >
                        <Layers className="w-5 h-5" /> Categories
                    </Button>
                    <div className="pt-4 mt-4 border-t border-slate-100">
                        <Link to="/">
                            <Button variant="ghost" className="w-full justify-start gap-3 h-12 text-slate-600 hover:bg-slate-50 hover:text-primary">
                                <ArrowLeft className="w-5 h-5" /> Back to Site
                            </Button>
                        </Link>
                    </div>
                </nav>

                <Button
                    variant="outline"
                    onClick={handleLogout}
                    className="mt-auto gap-2 border-red-100 text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-200"
                >
                    <LogOut className="w-4 h-4" /> Log Out
                </Button>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-4 lg:p-10">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsContent value="dashboard">
                        <header className="mb-10">
                            <h1 className="text-3xl font-bold text-slate-900 font-heading">Management Dashboard</h1>
                            <p className="text-slate-500 mt-1">Global overview of your store performance</p>
                        </header>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
                            {[
                                { label: 'Total Products', value: products.length, icon: Box, color: 'bg-blue-50 text-blue-600' },
                                { label: 'Categories', value: categories.length, icon: Layers, color: 'bg-indigo-50 text-indigo-600' },
                                { label: 'Out of Stock', value: products.filter(p => !p.inStock).length, icon: XCircle, color: 'bg-red-50 text-red-600' },
                                { label: 'Featured Items', value: products.filter(p => p.featured).length, icon: TrendingUp, color: 'bg-amber-50 text-amber-600' },
                            ].map((stat, i) => (
                                <Card key={i} className="border-none shadow-sm rounded-3xl overflow-hidden group hover:shadow-md transition-all">
                                    <CardContent className="p-6 flex items-center gap-4">
                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${stat.color} group-hover:scale-110 transition-transform`}>
                                            <stat.icon className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-slate-500">{stat.label}</p>
                                            <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        <Card className="border-none shadow-sm rounded-[32px] overflow-hidden bg-white p-8">
                            <div className="flex flex-col items-center text-center py-10">
                                <TrendingUp className="w-12 h-12 text-primary/20 mb-4" />
                                <h3 className="text-xl font-bold text-slate-800">Quick Stats</h3>
                                <p className="text-slate-500 max-w-md mx-auto mt-2">
                                    Your store is running smoothly. Use the side tabs to manage products and categories.
                                </p>
                            </div>
                        </Card>
                    </TabsContent>

                    <TabsContent value="products">
                        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                            <div>
                                <h1 className="text-3xl font-bold text-slate-900 font-heading">Product Catalog</h1>
                                <p className="text-slate-500 mt-1">Manage all products available in your store</p>
                            </div>

                            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                                <DialogTrigger asChild>
                                    <Button size="lg" className="rounded-2xl gap-2 shadow-lg shadow-primary/20 h-14 px-8 text-lg" onClick={() => {
                                        setEditingId(null);
                                        setNewProduct(initialProductState);
                                    }}>
                                        <Plus className="w-6 h-6" /> Add New Product
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                                    <DialogHeader>
                                        <DialogTitle className="text-2xl">{editingId ? 'Edit Product' : 'Add New Product'}</DialogTitle>
                                        <CardDescription>Fill out the details below as simply as possible.</CardDescription>
                                    </DialogHeader>

                                    <div className="grid md:grid-cols-2 gap-8 py-4">
                                        <div className="space-y-6">
                                            <div className="space-y-2">
                                                <Label className="text-base font-semibold">Basic Information (English)</Label>
                                                <Input
                                                    placeholder="Product Name (e.g. Fresh Apple)"
                                                    value={newProduct.name.en}
                                                    onChange={(e) => setNewProduct({ ...newProduct, name: { ...newProduct.name, en: e.target.value } })}
                                                    className="h-12"
                                                />
                                                <Textarea
                                                    placeholder="Short description of the product"
                                                    value={newProduct.description.en}
                                                    onChange={(e) => setNewProduct({ ...newProduct, description: { ...newProduct.description, en: e.target.value } })}
                                                />
                                            </div>

                                            <div className="space-y-4 pt-4 border-t border-slate-100">
                                                <Label className="text-base font-semibold">Tamil Details (Optional)</Label>
                                                <Input
                                                    placeholder="பெயர் (எ.கா. ஆப்பிள்)"
                                                    value={newProduct.name.ta}
                                                    onChange={(e) => setNewProduct({ ...newProduct, name: { ...newProduct.name, ta: e.target.value } })}
                                                    className="h-12"
                                                />
                                                <Textarea
                                                    placeholder="உற்பத்தி விளக்கம்"
                                                    value={newProduct.description.ta}
                                                    onChange={(e) => setNewProduct({ ...newProduct, description: { ...newProduct.description, ta: e.target.value } })}
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-6">
                                            <div className="space-y-2">
                                                <Label className="text-base font-semibold">Pricing & Category</Label>
                                                <div className="flex gap-4">
                                                    <div className="flex-1 space-y-1">
                                                        <Label className="text-xs text-slate-500">Base Price (₹)</Label>
                                                        <Input
                                                            type="number"
                                                            placeholder="0.00"
                                                            className="h-12"
                                                            value={newProduct.price || ''}
                                                            onChange={(e) => setNewProduct({ ...newProduct, price: parseFloat(e.target.value) })}
                                                        />
                                                    </div>
                                                    <div className="flex-1 space-y-1">
                                                        <Label className="text-xs text-slate-500">Base Unit (e.g. 1kg)</Label>
                                                        <Input
                                                            placeholder="1 kg"
                                                            className="h-12"
                                                            value={newCategory.name.en === 'test' ? '1 kg' : newProduct.unit}
                                                            onChange={(e) => setNewProduct({ ...newProduct, unit: e.target.value })}
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="space-y-2 bg-slate-50 p-4 rounded-xl border border-slate-100">
                                                <Label className="text-base font-semibold text-slate-700">Additional Variants (Optional)</Label>
                                                <p className="text-xs text-slate-500 mb-3">Add different sizes like 500g, 250g etc.</p>

                                                <div className="flex gap-2 mb-3">
                                                    <Input
                                                        placeholder="Unit (e.g. 500g)"
                                                        className="h-10 text-sm"
                                                        value={variantUnit}
                                                        onChange={(e) => setVariantUnit(e.target.value)}
                                                    />
                                                    <Input
                                                        type="number"
                                                        placeholder="Price (₹)"
                                                        className="h-10 text-sm w-24"
                                                        value={variantPrice}
                                                        onChange={(e) => setVariantPrice(e.target.value)}
                                                    />
                                                    <Button type="button" onClick={addVariant} size="sm" className="h-10 w-10 p-0">
                                                        <Plus className="w-4 h-4" />
                                                    </Button>
                                                </div>

                                                {newProduct.variants.length > 0 && (
                                                    <div className="space-y-2 max-h-32 overflow-y-auto">
                                                        {newProduct.variants.map((v, idx) => (
                                                            <div key={idx} className="flex items-center justify-between text-sm bg-white p-2 rounded border border-slate-100">
                                                                <span>{v.unit} - ₹{v.price}</span>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    className="h-6 w-6 text-red-500 hover:text-red-700 p-0"
                                                                    onClick={() => removeVariant(idx)}
                                                                >
                                                                    <XCircle className="w-4 h-4" />
                                                                </Button>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>

                                            <div className="space-y-2">
                                                <Label className="text-xs text-slate-500">Select Category</Label>
                                                <Select onValueChange={(val) => setNewProduct({ ...newProduct, category: val })} value={newProduct.category}>
                                                    <SelectTrigger className="h-12">
                                                        <SelectValue placeholder="Which category?" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {categories.map(cat => (
                                                            <SelectItem key={cat.id} value={cat.id}>{cat.name.en}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            <div className="space-y-2 pt-4 border-t border-slate-100">
                                                <Label className="text-base font-semibold">Visuals</Label>

                                                <div
                                                    className={`border-2 border-dashed rounded-xl p-6 text-center transition-all ${isDragging ? 'border-primary bg-primary/5 scale-[1.02]' : 'border-slate-200 hover:border-primary/50 hover:bg-slate-50'
                                                        }`}
                                                    onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                                                    onDragLeave={() => setIsDragging(false)}
                                                    onDrop={(e) => { setIsDragging(false); handleImageUpload(e); }}
                                                >
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        className="hidden"
                                                        id="image-upload"
                                                        onChange={handleImageUpload}
                                                        disabled={isUploading}
                                                    />

                                                    {isUploading ? (
                                                        <div className="flex flex-col items-center justify-center py-4">
                                                            <Loader2 className="w-8 h-8 text-primary animate-spin mb-2" />
                                                            <p className="text-sm text-slate-500">Uploading image...</p>
                                                        </div>
                                                    ) : newProduct.image ? (
                                                        <div className="relative group">
                                                            <img
                                                                src={newProduct.image}
                                                                alt="Preview"
                                                                className="h-40 w-full object-cover rounded-lg shadow-sm"
                                                            />
                                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg">
                                                                <Label
                                                                    htmlFor="image-upload"
                                                                    className="cursor-pointer bg-white text-slate-900 px-4 py-2 rounded-full font-medium hover:bg-slate-100 transition-colors"
                                                                >
                                                                    Change Image
                                                                </Label>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className="flex flex-col items-center justify-center py-4">
                                                            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-3">
                                                                <Upload className="w-6 h-6" />
                                                            </div>
                                                            <p className="text-sm font-medium text-slate-700">
                                                                Drag & Drop image here
                                                            </p>
                                                            <p className="text-xs text-slate-400 mt-1 mb-3">
                                                                or click to browse from your computer
                                                            </p>
                                                            <Label
                                                                htmlFor="image-upload"
                                                                className="cursor-pointer bg-white border border-slate-200 shadow-sm px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors"
                                                            >
                                                                Choose File
                                                            </Label>
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="space-y-1 mt-4">
                                                    <Label className="text-xs text-slate-500">Or use Image URL directly</Label>
                                                    <Input
                                                        placeholder="https://images.unsplash.com/..."
                                                        className="h-12"
                                                        value={newProduct.image}
                                                        onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
                                                    />
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-6 pt-4">
                                                <div className="flex items-center gap-2 cursor-pointer" onClick={() => setNewProduct({ ...newProduct, inStock: !newProduct.inStock })}>
                                                    {newProduct.inStock ? <CheckCircle2 className="w-6 h-6 text-green-500" /> : <XCircle className="w-6 h-6 text-slate-300" />}
                                                    <span className="font-medium">In Stock</span>
                                                </div>
                                                <div className="flex items-center gap-2 cursor-pointer" onClick={() => setNewProduct({ ...newProduct, featured: !newProduct.featured })}>
                                                    {newProduct.featured ? <TrendingUp className="w-6 h-6 text-primary" /> : <TrendingUp className="w-6 h-6 text-slate-300" />}
                                                    <span className="font-medium">Featured</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <DialogFooter className="mt-8 border-t border-slate-100 pt-6">
                                        <DialogClose asChild>
                                            <Button variant="outline" className="h-12 px-8">Cancel</Button>
                                        </DialogClose>
                                        <Button onClick={editingId ? handleUpdateProduct : handleCreateProduct} className="h-12 px-10 shadow-lg shadow-primary/20">
                                            {editingId ? 'Update Product' : 'Save Product Now'}
                                        </Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </header>

                        <Card className="border-none shadow-sm rounded-[32px] overflow-hidden">
                            <CardHeader className="p-8 border-b border-slate-50">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle className="text-2xl font-bold">Store Catalog</CardTitle>
                                        <CardDescription>Manage {products.length} active products</CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="p-0">
                                {products.length > 0 ? (
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left">
                                            <thead className="bg-slate-50/50">
                                                <tr>
                                                    <th className="px-8 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Product</th>
                                                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Category</th>
                                                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Price</th>
                                                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Stock</th>
                                                    <th className="px-8 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-right">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-50">
                                                {products.map((product) => (
                                                    <tr key={product.id} className="hover:bg-slate-50/30 transition-colors group">
                                                        <td className="px-8 py-6">
                                                            <div className="flex items-center gap-4">
                                                                <div className="w-14 h-14 rounded-2xl bg-slate-100 overflow-hidden border border-slate-200 flex-shrink-0 shadow-sm">
                                                                    {product.image ? (
                                                                        <img src={product.image} alt="" className="w-full h-full object-cover" />
                                                                    ) : (
                                                                        <div className="w-full h-full flex items-center justify-center text-slate-400">
                                                                            <ImageIcon className="w-6 h-6" />
                                                                        </div>
                                                                    )}
                                                                </div>
                                                                <div>
                                                                    <p className="font-bold text-slate-900">{product.name.en}</p>
                                                                    <div className="flex items-center gap-2 mt-0.5">
                                                                        <p className="text-xs text-slate-400">{product.unit}</p>
                                                                        {product.variants && product.variants.length > 0 && (
                                                                            <span className="text-[10px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded-full font-medium">
                                                                                +{product.variants.length} options
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-6 font-medium text-slate-600">
                                                            <span className="px-3 py-1 bg-slate-100 rounded-full text-xs">
                                                                {categories.find(c => c.id === product.category)?.name.en || product.category}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-6 font-bold text-slate-900">₹{product.price}</td>
                                                        <td className="px-6 py-6">
                                                            <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 w-max ${product.inStock ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                                {product.inStock ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                                                                {product.inStock ? 'In Stock' : 'Out of Stock'}
                                                            </span>
                                                        </td>
                                                        <td className="px-8 py-6 text-right">
                                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    className="w-10 h-10 rounded-xl hover:bg-white hover:text-blue-600 shadow-sm"
                                                                    onClick={() => startEdit(product)}
                                                                >
                                                                    <Edit className="w-5 h-5" />
                                                                </Button>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    className="w-10 h-10 rounded-xl hover:bg-white hover:text-red-600 shadow-sm"
                                                                    onClick={async () => {
                                                                        if (confirm(`Delete ${product.name.en}?`)) {
                                                                            await deleteProduct(product.id);
                                                                        }
                                                                    }}
                                                                >
                                                                    <Trash2 className="w-5 h-5" />
                                                                </Button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <div className="py-20 text-center flex flex-col items-center">
                                        <div className="w-20 h-20 bg-slate-50 rounded-[40px] flex items-center justify-center mb-6 text-slate-300">
                                            <Box className="w-10 h-10" />
                                        </div>
                                        <h3 className="text-xl font-bold text-slate-400">No products yet</h3>
                                        <p className="text-slate-400 mt-2 max-w-xs mx-auto">Click the button above to add your very first product to the store!</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="categories">
                        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                            <div>
                                <h1 className="text-3xl font-bold text-slate-900 font-heading">Categories</h1>
                                <p className="text-slate-500 mt-1">Organize your store by grouping products</p>
                            </div>

                            <Dialog open={isCategoryDialogOpen} onOpenChange={setIsCategoryDialogOpen}>
                                <DialogTrigger asChild>
                                    <Button size="lg" className="rounded-2xl gap-2 shadow-lg shadow-primary/20 h-14 px-8 text-lg" onClick={() => setNewCategory(initialCategoryState)}>
                                        <Plus className="w-6 h-6" /> Create Category
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-md">
                                    <DialogHeader>
                                        <DialogTitle className="text-2xl">New Category</DialogTitle>
                                        <CardDescription>Add a new category for your products.</CardDescription>
                                    </DialogHeader>

                                    <div className="space-y-6 py-4">
                                        <div className="space-y-2">
                                            <Label>Category Name (English)</Label>
                                            <Input
                                                placeholder="e.g. Vegetables"
                                                value={newCategory.name.en}
                                                onChange={(e) => setNewCategory({ ...newCategory, name: { ...newCategory.name, en: e.target.value } })}
                                                className="h-12"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Tamil Name</Label>
                                            <Input
                                                placeholder="எ.கா. காய்கறிகள்"
                                                value={newCategory.name.ta}
                                                onChange={(e) => setNewCategory({ ...newCategory, name: { ...newCategory.name, ta: e.target.value } })}
                                                className="h-12"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Visual Marker (Color & Icon)</Label>
                                            <div className="grid grid-cols-2 gap-4">
                                                <Select onValueChange={(val) => setNewCategory({ ...newCategory, color: val })} value={newCategory.color}>
                                                    <SelectTrigger className="h-12">
                                                        <SelectValue placeholder="Color" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {['green', 'blue', 'red', 'amber', 'pink', 'indigo', 'orange', 'slate'].map(c => (
                                                            <SelectItem key={c} value={c}>
                                                                <div className="flex items-center gap-2">
                                                                    <div className={`w-3 h-3 rounded-full bg-${c}-500`} />
                                                                    {c.charAt(0).toUpperCase() + c.slice(1)}
                                                                </div>
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <Select onValueChange={(val) => setNewCategory({ ...newCategory, icon: val })} value={newCategory.icon}>
                                                    <SelectTrigger className="h-12">
                                                        <SelectValue placeholder="Icon" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {['Package', 'Layers', 'Box', 'ShoppingBag', 'Store', 'Milk', 'Utensils', 'Apple', 'Zap', 'Heart', 'Stethoscope', 'TrendingUp'].map(i => (
                                                            <SelectItem key={i} value={i}>{i}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="pt-2">
                                                <Label className="text-xs text-slate-500">Or use an Emoji (Matches original look)</Label>
                                                <Input
                                                    placeholder="Paste emoji here (eg. 🍎, 🧴)"
                                                    className="h-10"
                                                    onChange={(e) => {
                                                        if (e.target.value.trim()) {
                                                            setNewCategory({ ...newCategory, icon: e.target.value.trim() });
                                                        }
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <DialogFooter className="pt-6">
                                        <Button variant="outline" onClick={() => setIsCategoryDialogOpen(false)}>Cancel</Button>
                                        <Button onClick={handleCreateCategory}>Create Category</Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </header>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {categories.map((category) => (
                                <Card key={category.id} className="border-none shadow-sm rounded-3xl overflow-hidden group">
                                    <CardContent className="p-6">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center bg-${category.color}-50 text-${category.color}-600`}>
                                                <Layers className="w-7 h-7" />
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="text-slate-300 hover:text-red-500 rounded-xl"
                                                onClick={async () => {
                                                    if (confirm(`Delete ${category.name.en} category? This will not delete the products in it.`)) {
                                                        await deleteCategory(category.id);
                                                    }
                                                }}
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </Button>
                                        </div>
                                        <h3 className="font-bold text-xl text-slate-900">{category.name.en}</h3>
                                        <p className="text-sm text-slate-500 mt-1">{category.name.ta}</p>
                                        <div className="mt-6 pt-6 border-t border-slate-50 flex items-center justify-between">
                                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                                                {products.filter(p => p.category === category.id).length} Products
                                            </span>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </TabsContent>
                </Tabs>
            </main>
        </div>
    );
};

export default Admin;
