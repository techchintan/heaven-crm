import {type SchemaTypeDefinition} from "sanity";

import {teamMember} from "./teamMember";
import {candidate} from "./candidate";
import {vendor} from "./vendor";
import {placement} from "./placement";

export const schema: {types: SchemaTypeDefinition[]} = {
  types: [teamMember, candidate, vendor, placement],
};
