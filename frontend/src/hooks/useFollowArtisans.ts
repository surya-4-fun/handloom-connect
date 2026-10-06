import { useState, useEffect, useCallback } from 'react'
import { toggleFollowArtisan, fetchFollowedArtisanIds } from '../services/artisanService'
import { supabase } from '../lib/supabase'

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
    let isMounted = true
    const init = async () => {
      const { data } = await supabase.auth.getSession()
      if (!data.session) return
      fetchFollowedArtisanIds().then(ids => {
        if (isMounted && ids.length) setFollowedIds(ids)
      }).catch(() => {})
    }
    init()
    return () => { isMounted = false }
  }, [])

  const toggleFollow = useCallback(async (artisanId: string) => {
    setFollowedIds(prev =>
      prev.includes(artisanId)
        ? prev.filter(id => id !== artisanId)
        : [...prev, artisanId]
    )

    const { data } = await supabase.auth.getSession()
    if (data.session) {
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

