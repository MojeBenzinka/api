import { Logger } from "@nestjs/common";
import { Args, Query, Resolver } from "@nestjs/graphql";
import { ISearchResult } from "src/types/search-result";
import axios from "axios";

@Resolver("SearchResult")
export class SearchResolver {
  private readonly logger = new Logger(SearchResolver.name);

  // constructor() {}

  @Query("search")
  async stations(@Args("query") query: string): Promise<ISearchResult[]> {
    const trimmed = query.toLowerCase().trim();

    try {
      const q = encodeURIComponent(trimmed);

      const result = await axios.get<ISearchResult[]>(
        `https://nominatim.openstreetmap.org/search?q=${q}&format=json&countrycodes=cz,sk`,
        {
          headers: {
            "User-Agent": "KdeNatankuju/1.0.0-alpha",
          },
        },
      );

      // const result = (await res.json()) as ISearchResult[];

      if (result.status !== 200) {
        return [];
      }

      return result.data
        .filter((r) => r.type === "administrative" || r.type === "village")
        .slice(0, 5);
    } catch (e) {
      this.logger.error(e);
      return [];
    }
  }
}
