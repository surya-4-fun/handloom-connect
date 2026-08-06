import type { Product } from '../types/product'

export const products: Product[] = [
  { 
    id: 1, 
    name: 'Indigo Reversible Throw', 
    maker: 'Nila Collective', 
    place: 'Kutch', 
    price: '₹4,800', 
    image: 'https://images.unsplash.com/photo-1558171813-4c088753af8f?q=80&w=800&auto=format&fit=crop', 
    alt: 'Indigo reversible throw handwoven in Kutch', 
    badge: 'New' 
  },
  { 
    id: 2, 
    name: 'Tussar Silk Stole', 
    maker: 'Meera Devi', 
    place: 'Bhagalpur', 
    price: '₹3,200', 
    image: 'https://images.unsplash.com/photo-1606744824163-985d376605aa?q=80&w=800&auto=format&fit=crop', 
    alt: 'Golden handwoven Tussar silk stole', 
    badge: 'Maker direct' 
  },
  { 
    id: 3, 
    name: 'Handspun Table Linen', 
    maker: 'Sutradhar Studio', 
    place: 'Bengal', 
    price: '₹2,600', 
    image: 'https://images.unsplash.com/photo-1490751907972-0ae72a22f0ba?q=80&w=800&auto=format&fit=crop', 
    alt: 'Natural handwoven table linen fabric with rich texture' 
  },
]

export const artisans = [
  { 
    name: 'Leela Raman', 
    craft: 'Kanchipuram silk', 
    place: 'Tamil Nadu', 
    years: '28 years at the loom', 
    image: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=800&auto=format&fit=crop' 
  },
  { 
    name: 'The Nila Collective', 
    craft: 'Natural indigo', 
    place: 'Kutch, Gujarat', 
    years: 'Three generations', 
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=800&auto=format&fit=crop' 
  },
]
