import { useCallback, useEffect, useState } from 'react'

// Shared list/create/update/delete state machine for the admin CMS editors.
// Each content type (Experience, Skills, ...) has its own field shape but
// identical list lifecycle — fetch on mount, save in place, remove with
// optimistic UI — so that part lives here once instead of six times over.
export function useCrudList<T extends { id: string }>(
  fetchFn: () => Promise<T[]>,
  createFn: (row: Omit<T, 'id'>) => Promise<T>,
  updateFn: (id: string, row: Partial<T>) => Promise<T>,
  deleteFn: (id: string) => Promise<void>,
) {
  const [items, setItems] = useState<T[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [savingId, setSavingId] = useState<string | null>(null)

  const reload = useCallback(() => {
    setLoading(true)
    setError(null)
    fetchFn()
      .then((rows) => setItems(rows))
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load.'))
      .finally(() => setLoading(false))
  }, [fetchFn])

  useEffect(() => {
    reload()
    // Intentionally run once on mount only — fetchFn is stable per call site.
  }, [])

  const create = async (row: Omit<T, 'id'>) => {
    setSavingId('__new__')
    setError(null)
    try {
      const created = await createFn(row)
      setItems((prev) => [...prev, created])
      return created
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create.')
      throw err
    } finally {
      setSavingId(null)
    }
  }

  const update = async (id: string, row: Partial<T>) => {
    setSavingId(id)
    setError(null)
    try {
      const updated = await updateFn(id, row)
      setItems((prev) => prev.map((item) => (item.id === id ? updated : item)))
      return updated
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save.')
      throw err
    } finally {
      setSavingId(null)
    }
  }

  const remove = async (id: string) => {
    setSavingId(id)
    setError(null)
    try {
      await deleteFn(id)
      setItems((prev) => prev.filter((item) => item.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete.')
      throw err
    } finally {
      setSavingId(null)
    }
  }

  return { items, loading, error, savingId, create, update, remove, reload }
}
