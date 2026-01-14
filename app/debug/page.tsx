'use client'

import { useEffect, useState } from 'react'
import { getSupabase } from '@/lib/supabase/client'

export default function DebugPage() {
  const [result, setResult] = useState<any>(null)

  useEffect(() => {
    ;(async () => {
      try {
        const supabase = getSupabase()
        const { data, error } = await supabase
          .from('site_settings')
          .select('*')
          .limit(1)
        setResult({ data, error })
      } catch (error) {
        setResult({ data: null, error: String(error) })
      }
    })()
  }, [])

  return (
    <main style={{ padding: 24 }}>
      <h1>Supabase Debug</h1>
      <pre>{JSON.stringify(result, null, 2)}</pre>
    </main>
  )
}
