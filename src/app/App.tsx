import { lazy, Suspense } from 'react'
import { Route, Routes, Navigate } from 'react-router-dom'
import { AppLayout } from './layouts/AppLayout'
import { AuthProvider } from '../contexts/AuthContext'
import { ProtectedRoute } from '../components/navigation/ProtectedRoute'
import { HomePage } from '../features/home/HomePage'
import { MarketplacePage } from '../pages/MarketplacePage'
import { ProductDetailPage } from '../pages/ProductDetailPage'
import { ArtisansPage } from '../pages/ArtisansPage'
import { MaterialsPage } from '../pages/MaterialsPage'
import { AIAssistantPage } from '../pages/AIAssistantPage'
import { CartWishlistPage } from '../pages/CartWishlistPage'
import { AboutPage } from '../pages/AboutPage'

import { ARStudioPage } from '../pages/ARStudioPage'
import { OrderTrackingPage } from '../pages/OrderTrackingPage'
import { OriginMapPage } from '../pages/OriginMapPage'

const NotFoundPage = lazy(() => import('../pages/NotFoundPage').then((module) => ({ default: module.NotFoundPage })))
const LoginPage = lazy(() => import('../pages/LoginPage').then(m => ({ default: m.LoginPage })))
const RegisterPage = lazy(() => import('../pages/RegisterPage').then(m => ({ default: m.RegisterPage })))
const ProfilePage = lazy(() => import('../pages/ProfilePage').then(m => ({ default: m.ProfilePage })))
const CheckoutPage = lazy(() => import('../pages/CheckoutPage').then(m => ({ default: m.CheckoutPage })))
const OrderConfirmationPage = lazy(() => import('../pages/OrderConfirmationPage').then(m => ({ default: m.OrderConfirmationPage })))
const ArtisanDetailPage = lazy(() => import('../pages/ArtisanDetailPage').then(m => ({ default: m.ArtisanDetailPage })))
const RawMaterialsPage = lazy(() => import('../pages/RawMaterialsPage').then(m => ({ default: m.RawMaterialsPage })))
const ProductStoryPage = lazy(() => import('../pages/ProductStoryPage').then(m => ({ default: m.ProductStoryPage })))
const ContactPage = lazy(() => import('../pages/ContactPage').then(m => ({ default: m.ContactPage })))

function RouteLoader() {
  return <div className="route-loader" role="status"><span className="route-loader__mark">HC</span><span className="sr-only">Loading page</span></div>
}

export function App() {
  return (
    <AuthProvider>
      <Suspense fallback={<RouteLoader />}>
        <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<HomePage />} />
          <Route path="/marketplace" element={<MarketplacePage />} />
          <Route path="/marketplace/:productId" element={<ProductDetailPage />} />
          <Route path="/story/:productId" element={<ProductStoryPage />} />
          <Route path="/artisans" element={<ArtisansPage />} />
          <Route path="/artisans/:artisanId" element={<ArtisanDetailPage />} />
          <Route path="/materials" element={<MaterialsPage />} />
          <Route path="/raw-materials" element={<RawMaterialsPage />} />
          <Route path="/ai-material-guide" element={<MaterialsPage />} />
          <Route path="/ai-fashion-assistant" element={<AIAssistantPage />} />
          <Route path="/ar-studio" element={<ARStudioPage />} />
          <Route path="/order-tracking" element={<OrderTrackingPage />} />
          <Route path="/origin-map" element={<OriginMapPage />} />
          <Route path="/wishlist" element={<CartWishlistPage type="wishlist" />} />
          <Route path="/cart" element={<CartWishlistPage type="cart" />} />
          
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          <Route element={<ProtectedRoute />}>
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/account" element={<Navigate to="/profile" replace />} />
          </Route>
          
          <Route path="/order-confirmation/:orderId" element={<OrderConfirmationPage />} />

          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
        </Routes>
      </Suspense>
    </AuthProvider>
  )
}

