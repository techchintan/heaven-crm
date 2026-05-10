import {type SchemaTypeDefinition} from "sanity";

import {teamMember} from "./teamMember";
import {candidate} from "./candidate";
import {client} from "./client";
import {placement} from "./placement";

export const schema: {types: SchemaTypeDefinition[]} = {
  types: [teamMember, candidate, client, placement],
};
