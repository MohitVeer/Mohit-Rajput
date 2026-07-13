import { useLightningRush } from '../hooks/useLightningRush'
import Scene from './cinematic/Scene'
import Reveal from './cinematic/Reveal'

export default function LightningRush() {
  const { isPlaying, timeLeft, score, best, activeCell, announcement, gridSize, startGame, hitCell } =
    useLightningRush()

  return (
    <Scene id="game" index="08" label="Trailside Break">
      <Reveal>
        <h2
          id="game-heading"
          className="max-w-4xl font-display text-4xl font-semibold leading-tight md:text-6xl"
        >
          Spot the <span className="text-gradient">Blaze.</span>
        </h2>
        <p className="mt-4 max-w-xl text-muted-foreground">
          A tiny reflex game — because portfolios shouldn&apos;t be homework. Fully keyboard playable:
          tab to a cell and press Enter or Space when it lights up.
        </p>
      </Reveal>

      <Reveal delay={0.1} className="mt-12 grid gap-10 md:grid-cols-[1fr_2fr] md:items-center">
        <div className="flex gap-6 font-mono md:flex-col md:gap-8">
          <div>
            <div className="text-[11px] uppercase tracking-widest text-muted-foreground">Score</div>
            <div className="mt-1 text-3xl font-semibold">{score}</div>
          </div>
          <div>
            <div className="text-[11px] uppercase tracking-widest text-muted-foreground">Time</div>
            <div className="mt-1 text-3xl font-semibold">{timeLeft}s</div>
          </div>
          <div>
            <div className="text-[11px] uppercase tracking-widest text-muted-foreground">Best</div>
            <div className="mt-1 text-3xl font-semibold text-accent">{best}</div>
          </div>
        </div>

        <div className="relative h-[340px] w-full max-w-lg overflow-hidden rounded-2xl border border-border">
          <div className="grid h-full grid-cols-3 grid-rows-3 gap-3 p-4">
            {Array.from({ length: gridSize }).map((_, index) => {
              const isActive = activeCell === index
              return (
                <button
                  key={index}
                  type="button"
                  onClick={() => hitCell(index)}
                  disabled={!isPlaying}
                  aria-pressed={isActive}
                  aria-label={
                    isActive ? `Blaze mark lit in cell ${index + 1}, tap now` : `Cell ${index + 1}`
                  }
                  className={`grid place-items-center rounded-xl border transition-colors focus-visible:z-10 disabled:cursor-not-allowed ${
                    isActive ? 'border-accent bg-accent/15 motion-safe:animate-pulse' : 'border-border bg-card'
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className={`h-6 w-3 rounded-[2px] transition-opacity ${
                      isActive ? 'bg-accent opacity-100' : 'opacity-0'
                    }`}
                  />
                </button>
              )
            })}
          </div>

          {!isPlaying && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-background/80 backdrop-blur-sm">
              <p className="text-lg font-medium">
                {score > 0 || timeLeft === 0 ? `Final score: ${score}` : 'Ready to hit the trail?'}
              </p>
              <button
                type="button"
                onClick={startGame}
                className="rounded-full bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground shadow-glow transition hover:opacity-90"
              >
                {score > 0 || timeLeft === 0 ? 'Play again' : 'Start game'}
              </button>
            </div>
          )}
        </div>
      </Reveal>

      {/* Live region: announces score/game-state changes to screen reader users without moving focus */}
      <p role="status" aria-live="polite" className="sr-only">
        {announcement}
      </p>
    </Scene>
  )
}
