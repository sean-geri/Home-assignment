import { Injectable, Logger } from '@nestjs/common';

export type PokeApiListItem = {
  name: string;
  url: string;
};

export type PokeApiListResponse = {
  count: number;
  results: PokeApiListItem[];
};

export type PokeApiPokemonDetail = {
  id: number;
  name: string;
  height: number;
  weight: number;
  types: Array<{
    slot: number;
    type: { name: string };
  }>;
  sprites: {
    front_default: string | null;
  };
};

@Injectable()
export class PokeApiService {
  private readonly logger = new Logger(PokeApiService.name);
  private readonly listUrl =
    'https://pokeapi.co/api/v2/pokemon?limit=1351';

  async fetchPokemonList(): Promise<PokeApiListItem[]> {
    const response = await fetch(this.listUrl);
    if (!response.ok) {
      throw new Error(
        `Failed to fetch Pokemon list: ${response.status} ${response.statusText}`,
      );
    }

    const data = (await response.json()) as PokeApiListResponse;
    return data.results;
  }

  async fetchPokemonDetail(url: string): Promise<PokeApiPokemonDetail> {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(
        `Failed to fetch Pokemon detail (${url}): ${response.status} ${response.statusText}`,
      );
    }

    return (await response.json()) as PokeApiPokemonDetail;
  }

  extractIdFromUrl(url: string): number | null {
    const match = url.match(/\/pokemon\/(\d+)\/?$/);
    if (!match) {
      this.logger.warn(`Could not extract Pokemon id from URL: ${url}`);
      return null;
    }
    return Number(match[1]);
  }
}
