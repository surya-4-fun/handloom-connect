import { lazy, Suspense } from 'react'
import { Route, Routes, Navigate } from 'react-router-dom'
import { AppLayout } from './layouts/AppLayout'
import { AuthProvider } from './context/AuthContext'
import { ProtectedRoute } from './components/navigation/ProtectedRoute'
import { HomePage } from './pages/HomePage'

const MarketplacePage = lazy(() => import('./pages/MarketplacePage').then(m => ({ default: m.MarketplacePage })))
const ProductDetailPage = lazy(() => import('./pages/ProductDetailPage').then(m => ({ default: m.ProductDetailPage })))
const ArtisansPage = lazy(() => import('./pages/ArtisansPage').then(m => ({ default: m.ArtisansPage })))
const AIAssistantPage = lazy(() => import('./pages/AIAssistantPage').then(m => ({ default: m.AIAssistantPage })))
const CartWishlistPage = lazy(() => import('./pages/CartWishlistPage').then(m => ({ default: m.CartWishlistPage })))
const AboutPage = lazy(() => import('./pages/AboutPage').then(m => ({ default: m.AboutPage })))
const ARStudioPage = lazy(() => import('./pages/ARStudioPage').then(m => ({ default: m.ARStudioPage })))
const OrderTrackingPage = lazy(() => import('./pages/OrderTrackingPage').then(m => ({ default: m.OrderTrackingPage })))
const OriginMapPage = lazy(() => import('./pages/OriginMapPage').then(m => ({ default: m.OriginMapPage })))

const NotFoundPage = lazy(() => import('./pages/NotFoundPage').then((module) => ({ default: module.NotFoundPage })))
const LoginPage = lazy(() => import('./pages/LoginPage').then(m => ({ default: m.LoginPage })))
const RegisterPage = lazy(() => import('./pages/RegisterPage').then(m => ({ default: m.RegisterPage })))
const ProfilePage = lazy(() => import('./pages/ProfilePage').then(m => ({ default: m.ProfilePage })))
const CheckoutPage = lazy(() => import('./pages/CheckoutPage').then(m => ({ default: m.CheckoutPage })))
const OrderConfirmationPage = lazy(() => import('./pages/OrderConfirmationPage').then(m => ({ default: m.OrderConfirmationPage })))
const ArtisanDetailPage = lazy(() => import('./pages/ArtisanDetailPage').then(m => ({ default: m.ArtisanDetailPage })))
const ArtisanStoryPage = lazy(() => import('./pages/ArtisanStoryPage').then(m => ({ default: m.ArtisanStoryPage })))
const RawMaterialsPage = lazy(() => import('./pages/RawMaterialsPage').then(m => ({ default: m.RawMaterialsPage })))
const ProductStoryPage = lazy(() => import('./pages/ProductStoryPage').then(m => ({ default: m.ProductStoryPage })))
const ContactPage = lazy(() => import('./pages/ContactPage').then(m => ({ default: m.ContactPage })))

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
          <Route path="/artisan-story/:artisanId" element={<ArtisanStoryPage />} />
          <Route path="/raw-materials" element={<RawMaterialsPage />} />
          <Route path="/ai-fashion-assistant" element={<AIAssistantPage />} />
          <Route path="/ar-studio" element={<ARStudioPage />} />
          <Route path="/order-tracking" element={<OrderTrackingPage />} />
          <Route path="/origin-map" element={<OriginMapPage />} />
          <Route path="/wishlist" element={<CartWishlistPage type="wishlist" />} />
          <Route path="/cart" element={<CartWishlistPage type="cart" />} />
          
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/signup" element={<RegisterPage />} />
          
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

