import { Address } from './auth'

export interface OrderItem {
  productId: string
  name: string
  price: number
  displayPrice: string
  quantity: number
  image: string
  craft: string
  artisanName: string
  cluster: string
}

export interface DeliveryMethod {
  id: string
  name: string
  estimatedDays: string
  cost: number
  displayCost: string
  description: string
}

export type PaymentMethodType = 'upi' | 'card' | 'cod'

export interface PaymentDetails {
  method: PaymentMethodType
  upiId?: string
  cardLast4?: string
  cardHolderName?: string
}

export type OrderStatus =
  | 'commissioned'
  | 'yarn_washing'
  | 'organic_dyeing'
  | 'warp_prep'
  | 'weaving_in_progress'
  | 'quality_audit'
  | 'dispatched'
  | 'delivered'

export interface Order {
  id: string
  createdAt: string
  items: OrderItem[]
  shippingAddress: Address
  deliveryMethod: DeliveryMethod
  paymentDetails: PaymentDetails
  subtotal: number
  shippingFee: number
  giftBoxFee: number
  taxFee: number
  totalAmount: number
  status: OrderStatus
  currentStage: number
  totalHours: number
  completedHours: number
  estimatedDelivery: string
  silkMarkNo: string
  giTagNo: string
}
