import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { Pokemon } from './pokemon.entity.js';
import { PokeApiService, PokeApiListItem } from './pokeapi.service.js';
import { PokemonService } from './pokemon.service.js';

const BATCH_SIZE = 5;

@Injectable()
export class PokemonSyncService implements OnApplicationBootstrap {
  private readonly logger = new Logger(PokemonSyncService.name);

  constructor(
    private readonly pokeApiService: PokeApiService,
    private readonly pokemonService: PokemonService,
  ) {}

  onApplicationBootstrap(): void {
    void this.syncMissingPokemon();
  }

  private async syncMissingPokemon(): Promise<void> {
    try {
      this.logger.log('Starting Pokemon sync...');

      const list = await this.pokeApiService.fetchPokemonList();
      const listWithIds = list
        .map((item) => ({
          item,
          id: this.pokeApiService.extractIdFromUrl(item.url),
        }))
        .filter(
          (entry): entry is { item: PokeApiListItem; id: number } =>
            entry.id !== null,
        );

      const existingIds = new Set(await this.pokemonService.findAllIds());
      const missing = listWithIds.filter((entry) => !existingIds.has(entry.id));

      this.logger.log(
        `Found ${listWithIds.length} Pokemon in API, ${existingIds.size} in DB, ${missing.length} missing`,
      );

      for (let i = 0; i < missing.length; i += BATCH_SIZE) {
        const batch = missing.slice(i, i + BATCH_SIZE);
        const results = await Promise.allSettled(
          batch.map(({ item }) =>
            this.pokeApiService.fetchPokemonDetail(item.url),
          ),
        );

        const toSave: Pokemon[] = [];

        for (const result of results) {
          if (result.status === 'rejected') {
            this.logger.warn(
              `Failed to fetch Pokemon detail: ${String(result.reason)}`,
            );
            continue;
          }

          const detail = result.value;
          const sortedTypes = [...detail.types].sort(
            (a, b) => a.slot - b.slot,
          );
          const type1 = sortedTypes[0]?.type.name;
          if (!type1) {
            this.logger.warn(
              `Skipping Pokemon ${detail.name} (${detail.id}): missing type1`,
            );
            continue;
          }

          toSave.push({
            id: detail.id,
            name: detail.name,
            type1,
            type2: sortedTypes[1]?.type.name ?? null,
            weight: detail.weight,
            height: detail.height,
            imageUrl: detail.sprites?.front_default ?? null,
          });
        }

        await this.pokemonService.saveMany(toSave);
      }

      this.logger.log('Pokemon sync completed');
    } catch (error) {
      this.logger.error('Pokemon sync failed', error);
    }
  }
}
