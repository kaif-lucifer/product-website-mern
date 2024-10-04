import { create } from "zustand";

export const useProductStore = create((set) => ({
    products: [],
    setProducts: (products) => set({ products }),
    createProduct: async (newProduct) => {
        if (!newProduct.name || !newProduct.price || !newProduct.image) {
            return { success: false, message: "Please filled all the fields." }
        }
        const res = await fetch("/api/products", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(newProduct)
        })

        const productData = await res.json();
        set((state) => ({ products: [...state.products, productData.data] }))
        return { success: true, message: "Product Added Successfully." }
    },
    fetchProducts: async () => {
        const res = await fetch("/api/products");
        const productData = await res.json();
        set({ products: productData.data });
    },
    deleteProduct: async (productId) => {
        const res = await fetch(`/api/products/${productId}`, {
            method: "DELETE",
        });

        const productData = await res.json();
        if (!productData.success) return { success: false, message: productData.message };

        // update the UI immediately, with out this line , the product will be deleted in the db but we need to refresh to see it on website.
        set(state => ({ products: state.products.filter(product => product._id !== productId) }));
        return { success: true, message: productData.message };

    },
    editProduct: async (productId, updatedProduct) => {
        const res = await fetch(`/api/products/${productId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedProduct),
        });

        const productData = await res.json();
        if (!productData.success) return { success: false, message: productData.message };

        // Update the UI immediately, without needing a refresh.
        set(state => ({
            products: state.products.map((product) => (product._id === productId ? productData.data : product))
        }))
        return { success: true, message: productData.message };

    }
}));
