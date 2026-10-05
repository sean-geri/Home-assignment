import type { TrainerPokemon } from '../types'

type PokemonCardProps = {
  item: TrainerPokemon
  actionLabel: string
  onAction: () => void
  actionDisabled?: boolean
}

function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1)
}

export function PokemonCard({
  item,
  actionLabel,
  onAction,
  actionDisabled = false,
}: PokemonCardProps) {
  const types = [item.pokemon.type1, item.pokemon.type2]
    .filter((type): type is string => Boolean(type))
    .map(capitalize)

  return (
    <article className="pokemon-card">
      <div className="pokemon-card-image">
        {item.pokemon.imageUrl ? (
          <img
            src={item.pokemon.imageUrl}
            alt={item.pokemon.name}
            width={72}
            height={72}
          />
        ) : (
          <div className="pokemon-card-placeholder" aria-hidden="true">
            ?
          </div>
        )}
      </div>

      <div className="pokemon-card-body">
        <h3 className="pokemon-card-name">{capitalize(item.pokemon.name)}</h3>
        <p className="pokemon-card-meta">
          Nickname: <strong>{item.nickname}</strong>
        </p>
        <p className="pokemon-card-meta">
          Level: <strong>{item.level}</strong>
        </p>
        <p className="pokemon-card-types">
          {types.map((type) => (
            <span key={type} className="type-chip">
              {type}
            </span>
          ))}
        </p>
        <button
          type="button"
          className="btn secondary"
          onClick={onAction}
          disabled={actionDisabled}
        >
          {actionLabel}
        </button>
      </div>
    </article>
  )
}
