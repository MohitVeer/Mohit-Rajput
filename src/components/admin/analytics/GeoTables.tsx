import { useMemo, useState } from 'react'
import type { CityRow, CountryRow } from '../../../lib/adminApi'
import { exportAsCsv, exportAsJson } from '../../../lib/adminApi'
import ChartCard from '../ChartCard'
import WorldDotMap from './WorldDotMap'
import { formatSeconds } from './chartTheme'
import ExportMenu from './ExportMenu'

type SortDir = 'asc' | 'desc'

function useSort<T>(rows: T[], defaultKey: keyof T) {
  const [key, setKey] = useState<keyof T>(defaultKey)
  const [dir, setDir] = useState<SortDir>('desc')

  const sorted = useMemo(() => {
    const copy = [...rows]
    copy.sort((a, b) => {
      const av = a[key]
      const bv = b[key]
      const cmp = typeof av === 'number' && typeof bv === 'number' ? av - bv : String(av).localeCompare(String(bv))
      return dir === 'asc' ? cmp : -cmp
    })
    return copy
  }, [rows, key, dir])

  const toggle = (k: keyof T) => {
    if (k === key) setDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    else {
      setKey(k)
      setDir('desc')
    }
  }

  return { sorted, sortKey: key, sortDir: dir, toggle }
}

function SortHeader<T>({
  label,
  column,
  active,
  dir,
  onClick,
}: {
  label: string
  column: keyof T
  active: boolean
  dir: SortDir
  onClick: (c: keyof T) => void
}) {
  return (
    <th className="pb-2 pr-4">
      <button
        type="button"
        onClick={() => onClick(column)}
        className={`inline-flex items-center gap-1 font-mono text-xs uppercase tracking-wide transition-colors ${
          active ? 'text-accent' : 'text-muted-foreground hover:text-foreground'
        }`}
      >
        {label}
        {active && <span aria-hidden="true">{dir === 'asc' ? '↑' : '↓'}</span>}
      </button>
    </th>
  )
}

export default function GeoTables({ countries, cities }: { countries: CountryRow[]; cities: CityRow[] }) {
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null)
  const countrySort = useSort(countries, 'sessions')
  const filteredCities = selectedCountry ? cities.filter((c) => c.country === selectedCountry) : cities
  const citySort = useSort(filteredCities, 'sessions')

  return (
    <div className="space-y-6">
      <ChartCard title="Visitor locations">
        <WorldDotMap cities={cities} />
      </ChartCard>

      <div className="grid gap-4 lg:grid-cols-2">
        <ChartCard
          title="Countries"
          action={
            <ExportMenu
              onCsv={() => exportAsCsv('countries.csv', countries)}
              onJson={() => exportAsJson('countries.json', countries)}
            />
          }
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr>
                  <SortHeader label="Country" column="country" active={countrySort.sortKey === 'country'} dir={countrySort.sortDir} onClick={countrySort.toggle} />
                  <SortHeader label="Visitors" column="visitors" active={countrySort.sortKey === 'visitors'} dir={countrySort.sortDir} onClick={countrySort.toggle} />
                  <SortHeader label="Sessions" column="sessions" active={countrySort.sortKey === 'sessions'} dir={countrySort.sortDir} onClick={countrySort.toggle} />
                  <SortHeader label="Avg. time" column="avg_seconds" active={countrySort.sortKey === 'avg_seconds'} dir={countrySort.sortDir} onClick={countrySort.toggle} />
                  <SortHeader label="Bounce" column="bounce_rate" active={countrySort.sortKey === 'bounce_rate'} dir={countrySort.sortDir} onClick={countrySort.toggle} />
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {countrySort.sorted.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-3 text-muted-foreground">
                      No visitor data yet
                    </td>
                  </tr>
                )}
                {countrySort.sorted.map((c) => (
                  <tr
                    key={c.country}
                    onClick={() => setSelectedCountry((cur) => (cur === c.country ? null : c.country))}
                    className={`cursor-pointer transition-colors hover:bg-accent/5 ${
                      selectedCountry === c.country ? 'bg-accent/10' : ''
                    }`}
                  >
                    <td className="py-2 pr-4 text-foreground">
                      {c.country_code && <span className="mr-2 font-mono text-xs text-muted-foreground">{c.country_code}</span>}
                      {c.country}
                    </td>
                    <td className="py-2 pr-4 font-mono text-muted-foreground">{c.visitors}</td>
                    <td className="py-2 pr-4 font-mono text-muted-foreground">{c.sessions}</td>
                    <td className="py-2 pr-4 font-mono text-muted-foreground">{formatSeconds(c.avg_seconds)}</td>
                    <td className="py-2 font-mono text-muted-foreground">{c.bounce_rate}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ChartCard>

        <ChartCard
          title={selectedCountry ? `Cities in ${selectedCountry}` : 'Cities'}
          action={
            <div className="flex items-center gap-2">
              {selectedCountry && (
                <button
                  type="button"
                  onClick={() => setSelectedCountry(null)}
                  className="rounded-full border border-border px-2.5 py-1 text-[11px] text-muted-foreground hover:border-accent hover:text-foreground"
                >
                  Clear ×
                </button>
              )}
              <ExportMenu
                onCsv={() => exportAsCsv('cities.csv', filteredCities)}
                onJson={() => exportAsJson('cities.json', filteredCities)}
              />
            </div>
          }
        >
          <p className="mb-2 text-[11px] text-muted-foreground">
            City-level location is approximate (derived from IP), not exact.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr>
                  <SortHeader label="City" column="city" active={citySort.sortKey === 'city'} dir={citySort.sortDir} onClick={citySort.toggle} />
                  <SortHeader label="Region" column="region" active={citySort.sortKey === 'region'} dir={citySort.sortDir} onClick={citySort.toggle} />
                  <SortHeader label="Visitors" column="visitors" active={citySort.sortKey === 'visitors'} dir={citySort.sortDir} onClick={citySort.toggle} />
                  <SortHeader label="Sessions" column="sessions" active={citySort.sortKey === 'sessions'} dir={citySort.sortDir} onClick={citySort.toggle} />
                  <SortHeader label="Pages/session" column="avg_pages_per_session" active={citySort.sortKey === 'avg_pages_per_session'} dir={citySort.sortDir} onClick={citySort.toggle} />
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {citySort.sorted.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-3 text-muted-foreground">
                      No visitor data yet
                    </td>
                  </tr>
                )}
                {citySort.sorted.map((c) => (
                  <tr key={`${c.city}-${c.country}`}>
                    <td className="py-2 pr-4 text-foreground">{c.city}</td>
                    <td className="py-2 pr-4 text-muted-foreground">{c.region || '—'}</td>
                    <td className="py-2 pr-4 font-mono text-muted-foreground">{c.visitors}</td>
                    <td className="py-2 pr-4 font-mono text-muted-foreground">{c.sessions}</td>
                    <td className="py-2 font-mono text-muted-foreground">
                      {c.avg_pages_per_session ? c.avg_pages_per_session.toFixed(1) : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ChartCard>
      </div>
    </div>
  )
}
