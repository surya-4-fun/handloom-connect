import { Order, DeliveryMethod } from '../types/order'
import { Address } from '../types/auth'

const ORDERS_KEY = 'hc-orders'

export const DELIVERY_METHODS: DeliveryMethod[] = [
  {
    id: 'standard',
    name: 'Standard Insured Craft Transit',
    estimatedDays: '5 - 7 Business Days',
    cost: 0,
    displayCost: 'FREE',
    description: 'Eco-friendly cardboard tube & handloom cotton dustbag.'
  },
  {
    id: 'express',
    name: 'Express Atelier Air Courier',
    estimatedDays: '2 - 4 Business Days',
    cost: 350,
    displayCost: '₹350',
    description: 'Priority flight routing & dedicated artisan handling.'
  },
  {
    id: 'climate-pack',
    name: 'Heritage Silk Climate-Vault Pack',
    estimatedDays: '1 - 2 Business Days',
    cost: 750,
    displayCost: '₹750',
    description: 'Humidity-controlled cedarwood box & tamper-evident wax seal.'
  }
]

const DEMO_SEED_ORDERS: Order[] = [
  {
    id: 'HC-2026-8942',
    createdAt: '2026-07-12T10:30:00.000Z',
    items: [
      {
        productId: 'kanchipuram-gold',
        name: 'Royal Kanchipuram Gold Zari Saree',
        price: 24500,
        displayPrice: '₹24,500',
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=1200&auto=format&fit=crop',
        craft: 'Kanchipuram Double Warp Korvai',
        artisanName: 'Master Weaver Ramanathan & Family',
        cluster: 'Kanchipuram Cluster, Tamil Nadu'
      }
    ],
    shippingAddress: {
      id: 'addr-1',
      type: 'shipping',
      fullName: 'Ananya Collector',
      addressLine1: '128 Heritage Enclave, Block B',
      city: 'Bengaluru',
      state: 'Karnataka',
      postalCode: '560038',
      country: 'India',
      isDefault: true
    },
    deliveryMethod: DELIVERY_METHODS[1],
    paymentDetails: {
      method: 'upi',
      upiId: 'ananya@upi'
    },
    subtotal: 24500,
    shippingFee: 350,
    giftBoxFee: 750,
    taxFee: 1225,
    totalAmount: 26825,
    status: 'weaving_in_progress',
    currentStage: 3,
    totalHours: 140,
    completedHours: 105,
    estimatedDelivery: 'August 4, 2026',
    silkMarkNo: 'SM-TN-2026-9812',
    giTagNo: 'GI-KANCHI-4482'
  },
  {
    id: 'HC-2026-3105',
    createdAt: '2026-07-18T14:20:00.000Z',
    items: [
      {
        productId: 'tussar-raw-silk',
        name: 'Raw Tussar Silk Stole',
        price: 6800,
        displayPrice: '₹6,800',
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?q=80&w=1200&auto=format&fit=crop',
        craft: 'Hand-reeled Slub Tussar',
        artisanName: 'Devi Prasad Weaving Collective',
        cluster: 'Bhagalpur Cluster, Bihar'
      }
    ],
    shippingAddress: {
      id: 'addr-1',
      type: 'shipping',
      fullName: 'Ananya Collector',
      addressLine1: '128 Heritage Enclave, Block B',
      city: 'Bengaluru',
      state: 'Karnataka',
      postalCode: '560038',
      country: 'India',
      isDefault: true
    },
    deliveryMethod: DELIVERY_METHODS[0],
    paymentDetails: {
      method: 'card',
      cardLast4: '4242',
      cardHolderName: 'Ananya Collector'
    },
    subtotal: 6800,
    shippingFee: 0,
    giftBoxFee: 0,
    taxFee: 340,
    totalAmount: 7140,
    status: 'quality_audit',
    currentStage: 4,
    totalHours: 60,
    completedHours: 52,
    estimatedDelivery: 'July 30, 2026',
    silkMarkNo: 'SM-BH-2026-1102',
    giTagNo: 'GI-BHAGAL-8821'
  }
]

function loadOrders(): Order[] {
  try {
    const raw = localStorage.getItem(ORDERS_KEY)
    if (!raw) {
      localStorage.setItem(ORDERS_KEY, JSON.stringify(DEMO_SEED_ORDERS))
      return DEMO_SEED_ORDERS
    }
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEMO_SEED_ORDERS
  } catch {
    return DEMO_SEED_ORDERS
  }
}

export function getOrders(): Order[] {
  return loadOrders()
}

export function getOrderById(id: string): Order | undefined {
  const cleanId = id.trim().toUpperCase()
  const orders = loadOrders()
  return orders.find(o => o.id.toUpperCase() === cleanId)
}

export function createOrder(params: {
  items: Order['items']
  shippingAddress: Address
  deliveryMethod: DeliveryMethod
  paymentDetails: Order['paymentDetails']
  includeGiftBox?: boolean
}): Order {
  const existing = loadOrders()
  const randomNum = Math.floor(1000 + Math.random() * 9000)
  const newId = `HC-2026-${randomNum}`

  const subtotal = params.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const giftBoxFee = params.includeGiftBox ? 750 : 0
  const shippingFee = params.deliveryMethod.cost
  const taxFee = Math.round(subtotal * 0.05) // 5% handloom GST
  const totalAmount = subtotal + giftBoxFee + shippingFee + taxFee

  // Estimated delivery calculation (3 to 7 days from now)
  const estDate = new Date()
  estDate.setDate(estDate.getDate() + 5)
  const estDateStr = estDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })

  const newOrder: Order = {
    id: newId,
    createdAt: new Date().toISOString(),
    items: params.items,
    shippingAddress: params.shippingAddress,
    deliveryMethod: params.deliveryMethod,
    paymentDetails: params.paymentDetails,
    subtotal,
    shippingFee,
    giftBoxFee,
    taxFee,
    totalAmount,
    status: 'commissioned',
    currentStage: 0,
    totalHours: 120,
    completedHours: 12,
    estimatedDelivery: estDateStr,
    silkMarkNo: `SM-IND-2026-${Math.floor(1000 + Math.random() * 9000)}`,
    giTagNo: `GI-GUILD-2026-${Math.floor(1000 + Math.random() * 9000)}`
  }

  const updated = [newOrder, ...existing]
  localStorage.setItem(ORDERS_KEY, JSON.stringify(updated))
  return newOrder
}
