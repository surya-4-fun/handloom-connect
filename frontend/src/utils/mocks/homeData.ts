import type { Product } from '../../types/product'

export const products: Product[] = [
  { 
    id: 1, 
    name: 'Indigo Reversible Throw', 
    maker: 'Nila Collective', 
    place: 'Kutch', 
    price: '₹4,800', 
    image: '/images/products/indigo-throw.jpg', 
    alt: 'Indigo reversible throw handwoven in Kutch with geometric patterns', 
    badge: 'New' 
  },
  { 
    id: 2, 
    name: 'Tussar Silk Stole', 
    maker: 'Meera Devi', 
    place: 'Bhagalpur', 
    price: '₹3,200', 
    image: '/images/products/bhagalpuri-silk-stole.jpg', 
    alt: 'Golden handwoven Tussar silk stole with textured slub weave', 
    badge: 'Maker direct' 
  },
  { 
    id: 3, 
    name: 'Handspun Table Linen', 
    maker: 'Sutradhar Studio', 
    place: 'Bengal', 
    price: '₹2,600', 
    image: '/images/products/handspun-table-linen.jpg', 
    alt: 'Natural handwoven table linen fabric with rich texture' 
  },
]

export const artisans = [
  { 
    name: 'Leela Raman', 
    craft: 'Kanchipuram silk', 
    place: 'Tamil Nadu', 
    years: '28 years at the loom', 
    image: '/images/artisans/artisan-portrait.jpg' 
  },
  { 
    name: 'The Nila Collective', 
    craft: 'Natural indigo & Ajrakh', 
    place: 'Kutch, Gujarat', 
    years: 'Three generations', 
    image: '/images/artisans/nila-collective.jpg' 
  },
]
