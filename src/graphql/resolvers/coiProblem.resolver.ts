import { Logger } from "@nestjs/common";
import { Args, Parent, Query, ResolveField, Resolver } from "@nestjs/graphql";
import axios from "axios";
import { ICoiProblem } from "src/types/coi-problem";

@Resolver("CoiProblem")
export class CoiProblemresolver {
  private readonly logger = new Logger(CoiProblemresolver.name);

  // constructor() {}

  @ResolveField("field_datum")
  async fieldDatum(@Parent() coiProblem: ICoiProblem) {
    return new Date(coiProblem.field_datum);
  }

  @Query("coiProblems")
  async coiProblems(@Args("maxDate") maxDate: Date): Promise<ICoiProblem[]> {
    try {
      const res = await axios.get<ICoiProblem[]>(
        `https://drupal.kdenatankuju.cz/api/cois/`,
      );

      if (res.status === 200) {
        return res.data ?? [];
      }
    } catch (e) {
      this.logger.error(e);
    }

    return [];
  }
}
