import { Order, DeliveryMethod } from '../types/order'
import { Address } from '../types/auth'
import { api } from './api'


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


export async function fetchOrderById(id: string): Promise<Order | null> {
  const res = await api.get<Order>(`/orders/${id}`)
  return res.data
}

export async function fetchUserOrders(): Promise<Order[]> {
  try {
    const res = await api.get<Order[]>('/orders')
    return res.data
  } catch {
    return []
  }
}

export async function fetchOrderTracking(id: string): Promise<any> {
  const res = await api.get<any>(`/orders/${id}/tracking`)
  return res.data
}

export async function createOrder(params: {
  items: Order['items']
  shippingAddress: Address
  deliveryMethod: DeliveryMethod
  paymentDetails: Order['paymentDetails']
  includeGiftBox?: boolean
}): Promise<Order> {
  const res = await api.post<Order>('/orders', {
    items: params.items.map(i => ({
      productId: i.productId,
      quantity: i.quantity,
      name: i.name,
      price: i.price,
      image: i.image
    })),
    shippingAddress: params.shippingAddress,
    deliveryMethod: params.deliveryMethod,
    paymentDetails: params.paymentDetails,
    includeGiftBox: params.includeGiftBox
  })

  return res.data
}
