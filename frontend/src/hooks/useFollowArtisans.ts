import { useState, useEffect, useCallback } from 'react'
import { toggleFollowArtisan, fetchFollowedArtisanIds } from '../services/artisanService'
import { getAuthToken } from '../services/api'

const FOLLOWED_KEY = 'hc-followed-artisans'

function loadFollowed(): string[] {
  try {
    const raw = localStorage.getItem(FOLLOWED_KEY)
    return raw ? JSON.parse(raw) : ['rajeshwar-ansari', 'saraswathi-guild']
  } catch {
    return ['rajeshwar-ansari', 'saraswathi-guild']
  }
}

export function useFollowArtisans() {
  const [followedIds, setFollowedIds] = useState<string[]>(() => loadFollowed())

  useEffect(() => {
    localStorage.setItem(FOLLOWED_KEY, JSON.stringify(followedIds))
  }, [followedIds])

  useEffect(() => {
    if (!getAuthToken()) return
    let isMounted = true
    fetchFollowedArtisanIds().then(ids => {
      if (isMounted && ids.length) setFollowedIds(ids)
    }).catch(() => {})
    return () => { isMounted = false }
  }, [])

  const toggleFollow = useCallback((artisanId: string) => {
    setFollowedIds(prev =>
      prev.includes(artisanId)
        ? prev.filter(id => id !== artisanId)
        : [...prev, artisanId]
    )

    if (getAuthToken()) {
      toggleFollowArtisan(artisanId).catch(() => {})
    }
  }, [])

  const isFollowing = useCallback((artisanId: string) => followedIds.includes(artisanId), [followedIds])

  return {
    followedIds,
    toggleFollow,
    isFollowing
  }
}

