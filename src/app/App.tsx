import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import { AppLayout } from './layouts/AppLayout'
import { HomePage } from '../features/home/HomePage'
import { MarketplacePage } from '../pages/MarketplacePage'
import { ArtisansPage } from '../pages/ArtisansPage'
import { MaterialsPage } from '../pages/MaterialsPage'
import { AIAssistantPage } from '../pages/AIAssistantPage'
import { CartWishlistPage } from '../pages/CartWishlistPage'

import { ARStudioPage } from '../pages/ARStudioPage'
import { OrderTrackingPage } from '../pages/OrderTrackingPage'
import { OriginMapPage } from '../pages/OriginMapPage'

const NotFoundPage = lazy(() => import('../pages/NotFoundPage').then((module) => ({ default: module.NotFoundPage })))

function RouteLoader() {
  return <div className="route-loader" role="status"><span className="route-loader__mark">HC</span><span className="sr-only">Loading page</span></div>
}

export function App() {
  return (
    <Suspense fallback={<RouteLoader />}>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<HomePage />} />
          <Route path="/marketplace" element={<MarketplacePage />} />
          <Route path="/artisans" element={<ArtisansPage />} />
          <Route path="/materials" element={<MaterialsPage />} />
          <Route path="/ai-material-guide" element={<MaterialsPage />} />
          <Route path="/ai-fashion-assistant" element={<AIAssistantPage />} />
          <Route path="/ar-studio" element={<ARStudioPage />} />
          <Route path="/order-tracking" element={<OrderTrackingPage />} />
          <Route path="/origin-map" element={<OriginMapPage />} />
          <Route path="/wishlist" element={<CartWishlistPage type="wishlist" />} />
          <Route path="/cart" element={<CartWishlistPage type="cart" />} />
          <Route path="/account" element={<CartWishlistPage type="cart" />} />
          <Route path="/about" element={<HomePage />} />
          <Route path="/contact" element={<HomePage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </Suspense>
  )
}

