import type { TrainerPokemon } from '../types'
import { PokemonCard } from './PokemonCard'

type PokemonBankProps = {
  items: TrainerPokemon[]
  onMoveToBag: (id: number) => void
  movingId: number | null
}

export function PokemonBank({
  items,
  onMoveToBag,
  movingId,
}: PokemonBankProps) {
  return (
    <section className="section inventory-section">
      <h2 className="inventory-title">Pokemon in the bank</h2>
      {items.length === 0 ? (
        <p className="hint">No Pokemon in the bank.</p>
      ) : (
        <div className="pokemon-list">
          {items.map((item) => (
            <PokemonCard
              key={item.id}
              item={item}
              actionLabel={
                movingId === item.id ? 'Moving…' : 'Move to bag'
              }
              onAction={() => onMoveToBag(item.id)}
              actionDisabled={movingId === item.id}
            />
          ))}
        </div>
      )}
    </section>
  )
}
