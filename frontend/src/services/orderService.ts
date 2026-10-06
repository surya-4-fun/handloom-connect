import { Order, DeliveryMethod, PaymentMethodType } from '../types/order'
import { Address } from '../types/auth'
import { supabase } from '../lib/supabase'

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
  const { data: order } = await supabase.from('orders').select('*').eq('id', id).single()
  if (!order) return null
  
  const { data: items } = await supabase.from('order_items').select('*').eq('order_id', id)
  
  return {
    id: order.id,
    items: (items || []).map((i: { product_id: string, quantity: number, name: string, price: number | string, display_price: string, image: string, craft: string, artisan_name: string, cluster: string }) => ({
      productId: i.product_id,
      quantity: i.quantity,
      name: i.name,
      price: Number(i.price),
      displayPrice: i.display_price,
      image: i.image,
      craft: i.craft,
      artisanName: i.artisan_name,
      cluster: i.cluster
    })),
    shippingAddress: order.shipping_address as unknown as Address,
    deliveryMethod: order.delivery_method as unknown as DeliveryMethod,
    paymentDetails: order.payment_details as { method: PaymentMethodType; upiId?: string; cardLast4?: string; cardHolderName?: string },
    subtotal: Number(order.subtotal),
    shippingFee: Number(order.shipping_fee),
    giftBoxFee: Number(order.gift_box_fee),
    taxFee: Number(order.tax_fee),
    totalAmount: Number(order.total_amount),
    status: order.status,
    currentStage: order.current_stage,
    totalHours: order.total_hours,
    completedHours: order.completed_hours,
    estimatedDelivery: order.estimated_delivery,
    silkMarkNo: order.silk_mark_no,
    giTagNo: order.gi_tag_no,
    createdAt: order.created_at
  }
}

export async function fetchUserOrders(): Promise<Order[]> {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session?.user) return []
  
  const { data: orders } = await supabase.from('orders').select('*').eq('user_id', session.user.id).order('created_at', { ascending: false })
  
  const result: Order[] = []
  for (const o of (orders || [])) {
    result.push((await fetchOrderById(o.id)) as Order)
  }
  return result
}

export async function fetchOrderTracking(id: string): Promise<Record<string, unknown> | null> {
  const order = await fetchOrderById(id)
  if (!order) return null
  return {
    orderId: order.id,
    status: order.status,
    currentStage: order.currentStage,
    totalHours: order.totalHours,
    completedHours: order.completedHours,
    estimatedDelivery: order.estimatedDelivery
  }
}

export async function createOrder(params: {
  items: Order['items']
  shippingAddress: Address
  deliveryMethod: DeliveryMethod
  paymentDetails: Order['paymentDetails']
  includeGiftBox?: boolean
}): Promise<Order | null> {
  const { data: { session } } = await supabase.auth.getSession()
  const userId = session?.user?.id
  
  let subtotal = 0
  params.items.forEach(i => subtotal += (i.price * i.quantity))
  const shippingFee = params.deliveryMethod.cost
  const giftBoxFee = params.includeGiftBox ? 150 : 0
  const taxFee = subtotal * 0.12 // 12% GST
  const totalAmount = subtotal + shippingFee + giftBoxFee + taxFee
  
  const { data: order, error: orderError } = await supabase.from('orders').insert({
    user_id: userId,
    shipping_address: params.shippingAddress,
    delivery_method: params.deliveryMethod,
    payment_details: params.paymentDetails,
    subtotal,
    shipping_fee: shippingFee,
    gift_box_fee: giftBoxFee,
    tax_fee: taxFee,
    total_amount: totalAmount,
    status: 'commissioned',
    current_stage: 0,
    total_hours: 120,
    completed_hours: 12,
    estimated_delivery: params.deliveryMethod.estimatedDays,
    silk_mark_no: 'SM' + Math.random().toString().slice(2, 10),
    gi_tag_no: 'GI' + Math.random().toString().slice(2, 10)
  }).select().single()
  
  if (orderError) {
    console.error('Failed to create order', orderError)
    throw new Error('Failed to create order')
  }
  
  for (const item of params.items) {
    await supabase.from('order_items').insert({
      order_id: order.id,
      product_id: item.productId,
      name: item.name,
      price: item.price,
      display_price: item.displayPrice || `₹${item.price}`,
      quantity: item.quantity,
      image: item.image,
      craft: item.craft || '',
      artisan_name: item.artisanName || '',
      cluster: item.cluster || ''
    })
  }
  
  if (userId) {
    await supabase.from('cart_items').delete().eq('user_id', userId)
  }
  
  return fetchOrderById(order.id)
}
