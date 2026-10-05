import type { TrainerPokemon } from '../types'
import { PokemonCard } from './PokemonCard'

type PokemonBagProps = {
  items: TrainerPokemon[]
  onRemoveFromBag: (id: number) => void
  movingId: number | null
}

export function PokemonBag({
  items,
  onRemoveFromBag,
  movingId,
}: PokemonBagProps) {
  return (
    <section className="section inventory-section">
      <div className="inventory-heading">
        <h2 className="inventory-title">Pokemon in the bag</h2>
        <span
          className="info-icon"
          tabIndex={0}
          role="img"
          aria-label="you can only have 6 pokemon in the bag at any time"
          title="you can only have 6 pokemon in the bag at any time"
        >
          i
        </span>
      </div>
      {items.length === 0 ? (
        <p className="hint">No Pokemon in the bag.</p>
      ) : (
        <div className="pokemon-list">
          {items.map((item) => (
            <PokemonCard
              key={item.id}
              item={item}
              actionLabel={
                movingId === item.id ? 'Moving…' : 'Remove from bag'
              }
              onAction={() => onRemoveFromBag(item.id)}
              actionDisabled={movingId === item.id}
            />
          ))}
        </div>
      )}
    </section>
  )
}
