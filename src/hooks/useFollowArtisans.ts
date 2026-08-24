import { useState, useEffect, useCallback } from 'react'

const FOLLOWED_KEY = 'hc-followed-artisans'

function loadFollowed(): string[] {
  try {
    const raw = localStorage.getItem(FOLLOWED_KEY)
    return raw ? JSON.parse(raw) : ['rajeshwar-ansari', 'saraswathi-guild'] // default followed for demo
  } catch {
    return ['rajeshwar-ansari', 'saraswathi-guild']
  }
}

export function useFollowArtisans() {
  const [followedIds, setFollowedIds] = useState<string[]>(() => loadFollowed())

  useEffect(() => {
    localStorage.setItem(FOLLOWED_KEY, JSON.stringify(followedIds))
  }, [followedIds])

  const toggleFollow = useCallback((artisanId: string) => {
    setFollowedIds(prev =>
      prev.includes(artisanId)
        ? prev.filter(id => id !== artisanId)
        : [...prev, artisanId]
    )
  }, [])

  const isFollowing = useCallback((artisanId: string) => followedIds.includes(artisanId), [followedIds])

  return {
    followedIds,
    toggleFollow,
    isFollowing
  }
}
