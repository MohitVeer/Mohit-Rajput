import { useCallback, useEffect, useState } from 'react'

// Shared list/create/update/delete state machine for the admin CMS editors.
// Each content type (Experience, Skills, ...) has its own field shape but
// identical list lifecycle — fetch on mount, save in place, remove with
// optimistic UI — so that part lives here once instead of six times over.
export function useCrudList<T extends { id: string; sort_order: number }>(
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

  // Swaps this item's sort_order with its neighbor in the current (already
  // sort_order-ascending) list, so "move up/down" is just persisting two
  // writes rather than renumbering the whole list.
  const move = async (id: string, direction: 'up' | 'down') => {
    const index = items.findIndex((item) => item.id === id)
    const neighborIndex = direction === 'up' ? index - 1 : index + 1
    if (index === -1 || neighborIndex < 0 || neighborIndex >= items.length) return

    const current = items[index]
    const neighbor = items[neighborIndex]
    const [a, b] = [current.sort_order, neighbor.sort_order]

    // Optimistic reorder so the UI responds immediately.
    setItems((prev) => {
      const next = [...prev]
      next[index] = { ...neighbor, sort_order: a }
      next[neighborIndex] = { ...current, sort_order: b }
      return next.sort((x, y) => x.sort_order - y.sort_order)
    })

    try {
      await Promise.all([
        updateFn(current.id, { sort_order: b } as Partial<T>),
        updateFn(neighbor.id, { sort_order: a } as Partial<T>),
      ])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reorder.')
      reload()
    }
  }

  return { items, loading, error, savingId, create, update, remove, move, reload }
}
