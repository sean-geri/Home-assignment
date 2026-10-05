import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { addPokemonToBank } from './operations/addPokemonToBank'
import { createTrainer } from './operations/createTrainer'
import { loadTrainers } from './operations/loadTrainers'
import { searchPokemon } from './operations/searchPokemon'
import type { Gender, Pokemon, Trainer } from './types'
import './App.css'

function formatPokemonLabel(pokemon: Pokemon): string {
  const name = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)
  return `#${pokemon.id} ${name}`
}

function App() {
  const [trainers, setTrainers] = useState<Trainer[]>([])
  const [selectedTrainerId, setSelectedTrainerId] = useState<number | ''>('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const [trainerName, setTrainerName] = useState('')
  const [trainerAge, setTrainerAge] = useState('')
  const [trainerGender, setTrainerGender] = useState<Gender>('MALE')
  const [creatingTrainer, setCreatingTrainer] = useState(false)

  const [pokemonQuery, setPokemonQuery] = useState('')
  const [pokemonResults, setPokemonResults] = useState<Pokemon[]>([])
  const [selectedPokemonId, setSelectedPokemonId] = useState<number | ''>('')
  const [searchingPokemon, setSearchingPokemon] = useState(false)
  const [nickname, setNickname] = useState('')
  const [level, setLevel] = useState('')
  const [pokemonGender, setPokemonGender] = useState<Gender>('MALE')
  const [addingPokemon, setAddingPokemon] = useState(false)

  const hasTrainerSelected = selectedTrainerId !== ''

  useEffect(() => {
    void (async () => {
      try {
        const loaded = await loadTrainers()
        setTrainers(loaded)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load trainers')
      }
    })()
  }, [])

  async function handleCreateTrainer(event: FormEvent) {
    event.preventDefault()
    setError(null)
    setSuccess(null)
    setCreatingTrainer(true)

    try {
      const created = await createTrainer({
        name: trainerName.trim(),
        age: Number(trainerAge),
        gender: trainerGender,
      })
      const refreshed = await loadTrainers()
      setTrainers(refreshed)
      setSelectedTrainerId(created.id)
      setTrainerName('')
      setTrainerAge('')
      setTrainerGender('MALE')
      setSuccess(`Trainer "${created.name}" created`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create trainer')
    } finally {
      setCreatingTrainer(false)
    }
  }

  async function handleSearchPokemon(event: FormEvent) {
    event.preventDefault()
    if (!hasTrainerSelected) return

    setError(null)
    setSuccess(null)
    setSearchingPokemon(true)

    try {
      const results = await searchPokemon(pokemonQuery.trim())
      setPokemonResults(results)
      setSelectedPokemonId(results[0]?.id ?? '')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search Pokemon')
    } finally {
      setSearchingPokemon(false)
    }
  }

  async function handleAddPokemonToBank(event: FormEvent) {
    event.preventDefault()
    if (!hasTrainerSelected || selectedPokemonId === '') return

    setError(null)
    setSuccess(null)
    setAddingPokemon(true)

    try {
      const result = await addPokemonToBank(selectedTrainerId, {
        pokemonId: selectedPokemonId,
        nickname: nickname.trim(),
        level: Number(level),
        gender: pokemonGender,
      })
      setNickname('')
      setLevel('')
      setPokemonGender('MALE')
      setSuccess(
        `Added "${result.nickname}" to ${result.location} for the selected trainer`,
      )
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add Pokemon')
    } finally {
      setAddingPokemon(false)
    }
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>Pokemon Trainer Bank</h1>
        <p>Manage trainers and add Pokemon to the bank.</p>
      </header>

      {error && <p className="banner error">{error}</p>}
      {success && <p className="banner success">{success}</p>}

      <section className="section">
        <h2>Trainers</h2>
        <label className="field">
          <span>Select trainer</span>
          <select
            value={selectedTrainerId}
            onChange={(event) => {
              const value = event.target.value
              setSelectedTrainerId(value === '' ? '' : Number(value))
            }}
          >
            <option value="">Select a trainer</option>
            {trainers.map((trainer) => (
              <option key={trainer.id} value={trainer.id}>
                {trainer.name}
              </option>
            ))}
          </select>
        </label>
      </section>

      <section className="section">
        <h2>Add trainer</h2>
        <form className="form" onSubmit={handleCreateTrainer}>
          <label className="field">
            <span>Name</span>
            <input
              type="text"
              value={trainerName}
              onChange={(event) => setTrainerName(event.target.value)}
              required
            />
          </label>

          <label className="field">
            <span>Age</span>
            <input
              type="number"
              min={1}
              value={trainerAge}
              onChange={(event) => setTrainerAge(event.target.value)}
              required
            />
          </label>

          <fieldset className="gender-field">
            <legend>Gender</legend>
            <label className="radio">
              <input
                type="radio"
                name="trainer-gender"
                checked={trainerGender === 'MALE'}
                onChange={() => setTrainerGender('MALE')}
              />
              <span>Male</span>
            </label>
            <label className="radio">
              <input
                type="radio"
                name="trainer-gender"
                checked={trainerGender === 'FEMALE'}
                onChange={() => setTrainerGender('FEMALE')}
              />
              <span>Female</span>
            </label>
          </fieldset>

          <button type="submit" className="btn" disabled={creatingTrainer}>
            {creatingTrainer ? 'Adding…' : 'Add trainer'}
          </button>
        </form>
      </section>

      <section className={`section ${hasTrainerSelected ? '' : 'disabled'}`}>
        <h2>Find Pokemon & add to Bank</h2>
        {!hasTrainerSelected && (
          <p className="hint">Select a trainer to enable this section.</p>
        )}

        <form className="form" onSubmit={handleSearchPokemon}>
          <label className="field">
            <span>Search Pokemon</span>
            <div className="row">
              <input
                type="text"
                value={pokemonQuery}
                onChange={(event) => setPokemonQuery(event.target.value)}
                disabled={!hasTrainerSelected}
                required
              />
              <button
                type="submit"
                className="btn secondary"
                disabled={!hasTrainerSelected || searchingPokemon}
              >
                {searchingPokemon ? 'Searching…' : 'Search'}
              </button>
            </div>
          </label>
        </form>

        <form className="form" onSubmit={handleAddPokemonToBank}>
          <label className="field">
            <span>Results</span>
            <select
              value={selectedPokemonId}
              onChange={(event) => {
                const value = event.target.value
                setSelectedPokemonId(value === '' ? '' : Number(value))
              }}
              disabled={!hasTrainerSelected || pokemonResults.length === 0}
              required
            >
              <option value="">
                {pokemonResults.length === 0
                  ? 'Search to load results'
                  : 'Select a Pokemon'}
              </option>
              {pokemonResults.map((pokemon) => (
                <option key={pokemon.id} value={pokemon.id}>
                  {formatPokemonLabel(pokemon)}
                </option>
              ))}
            </select>
          </label>

          <label className="field">
            <span>Nickname</span>
            <input
              type="text"
              value={nickname}
              onChange={(event) => setNickname(event.target.value)}
              disabled={!hasTrainerSelected}
              required
            />
          </label>

          <label className="field">
            <span>Level</span>
            <input
              type="number"
              min={1}
              max={100}
              value={level}
              onChange={(event) => setLevel(event.target.value)}
              disabled={!hasTrainerSelected}
              required
            />
          </label>

          <fieldset className="gender-field" disabled={!hasTrainerSelected}>
            <legend>Gender</legend>
            <label className="radio">
              <input
                type="radio"
                name="pokemon-gender"
                checked={pokemonGender === 'MALE'}
                onChange={() => setPokemonGender('MALE')}
                disabled={!hasTrainerSelected}
              />
              <span>Male</span>
            </label>
            <label className="radio">
              <input
                type="radio"
                name="pokemon-gender"
                checked={pokemonGender === 'FEMALE'}
                onChange={() => setPokemonGender('FEMALE')}
                disabled={!hasTrainerSelected}
              />
              <span>Female</span>
            </label>
          </fieldset>

          <button
            type="submit"
            className="btn"
            disabled={
              !hasTrainerSelected ||
              selectedPokemonId === '' ||
              addingPokemon
            }
          >
            {addingPokemon ? 'Adding…' : 'Add to Bank'}
          </button>
        </form>
      </section>
    </div>
  )
}

export default App
