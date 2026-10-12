import { useLightningRush } from '../hooks/useLightningRush'
import Section from './shell/Section'
import Reveal from './cinematic/Reveal'

export default function LightningRush() {
  const { isPlaying, timeLeft, score, best, activeCell, announcement, gridSize, startGame, hitCell } =
    useLightningRush()

  return (
    <Section id="game" index="09" label="Break" className="relative bg-background px-6 py-32 md:px-12 lg:px-24">
      <div className="mx-auto max-w-[1600px]">
      <Reveal>
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary/60">Take a break</p>
        <h2
          id="game-heading"
          className="mt-4 text-4xl font-black leading-[1.05] tracking-tighter text-foreground md:text-6xl lg:text-7xl"
        >
          Spot the <span className="font-serif font-normal italic">blaze</span>
        </h2>
        <p className="mt-4 max-w-xl text-base text-muted-foreground md:text-lg">
          A tiny reflex game — because portfolios shouldn&apos;t be homework. Fully keyboard playable:
          tab to a cell and press Enter or Space when it lights up.
        </p>
      </Reveal>

      <Reveal delay={0.1} className="mt-12 grid gap-10 md:grid-cols-[1fr_2fr] md:items-center">
        <div className="flex gap-6 font-sans md:flex-col md:gap-8">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">Score</div>
            <div className="mt-1 text-3xl font-semibold tabular-nums">{score}</div>
          </div>
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">Time</div>
            <div className="mt-1 text-3xl font-semibold tabular-nums">{timeLeft}s</div>
          </div>
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">Best</div>
            <div className="mt-1 text-3xl font-semibold tabular-nums text-foreground">{best}</div>
          </div>
        </div>

        <div className="relative h-[340px] w-full max-w-lg overflow-hidden rounded-3xl border border-neutral-200 bg-white/70 shadow-xl backdrop-blur-sm dark:border-neutral-800 dark:bg-zinc-950/60">
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
                    isActive ? 'border-foreground bg-foreground/10 motion-safe:animate-pulse' : 'border-neutral-200 bg-card dark:border-neutral-800'
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className={`h-6 w-3 rounded-[2px] transition-opacity ${
                      isActive ? 'bg-foreground opacity-100' : 'opacity-0'
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
                className="rounded-full bg-foreground px-6 py-3 text-xs font-bold uppercase tracking-widest text-background transition-transform hover:scale-105"
              >
                {score > 0 || timeLeft === 0 ? 'Play again' : 'Start game'}
              </button>
            </div>
          )}
        </div>
      </Reveal>

      <p role="status" aria-live="polite" className="sr-only">
        {announcement}
      </p>
      </div>
    </Section>
  )
}
