export type CameraPermissionState =
  | 'idle'
  | 'prompting'
  | 'active'
  | 'denied'
  | 'unsupported'
  | 'off'

export type StudioBackdrop =
  | 'atelier'
  | 'interior'
  | 'daylight'
  | 'gallery'

export interface ARTransformState {
  x: number
  y: number
  scale: number
  rotation: number
}

export interface ARProductPreviewProps {
  productId?: string
}
