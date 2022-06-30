import { Logger } from "@nestjs/common";
import { Parent, ResolveField, Resolver } from "@nestjs/graphql";
import { ICoiProblem } from "src/types/coi-problem";

@Resolver("CoiProblem")
export class CoiProblemresolver {
  private readonly logger = new Logger(CoiProblemresolver.name);

  // constructor() {}

  @ResolveField("field_datum")
  async fieldDatum(@Parent() coiProblem: ICoiProblem) {
    return new Date(coiProblem.field_datum);
  }
}
