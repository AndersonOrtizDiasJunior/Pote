import { useCallback, useState } from 'react'
import type { ToastMessage, ToastTone } from '../components/ui/Toast'

let nextToastId = 0

/** Um aviso por vez: o novo substitui o anterior. */
export function useToast() {
  const [toast, setToast] = useState<ToastMessage | null>(null)

  const showToast = useCallback((text: string, tone: ToastTone = 'info') => {
    nextToastId += 1
    setToast({ id: nextToastId, tone, text })
  }, [])

  const dismissToast = useCallback(() => setToast(null), [])

  return { toast, showToast, dismissToast }
}
