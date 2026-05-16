"use client";

import {visionTool} from "@sanity/vision";
import {defineConfig} from "sanity";
import {structureTool} from "sanity/structure";
import {media} from "sanity-plugin-media";

import {apiVersion, dataset, projectId} from "./sanity/env";
import {schema} from "./sanity/schemaTypes";
import {structure} from "./sanity/structure";
import {resolveDocumentActions} from "./sanity/actions";

export default defineConfig({
  name: "heavenpro-ats",
  title: "Heaven Pro ATS",
  basePath: "/studio",
  projectId,
  dataset,
  schema,
  plugins: [structureTool({structure}), visionTool({defaultApiVersion: apiVersion}), media()],
  document: {
    actions: resolveDocumentActions,
  },
});
