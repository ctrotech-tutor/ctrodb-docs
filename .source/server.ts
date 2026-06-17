// @ts-nocheck
import { default as __fd_glob_33 } from "../content/docs/meta.json?collection=meta"
import * as __fd_glob_32 from "../content/docs/react/use-query.mdx?collection=docs"
import * as __fd_glob_31 from "../content/docs/react/use-mutation.mdx?collection=docs"
import * as __fd_glob_30 from "../content/docs/react/use-doc.mdx?collection=docs"
import * as __fd_glob_29 from "../content/docs/react/setup.mdx?collection=docs"
import * as __fd_glob_28 from "../content/docs/react/database-provider.mdx?collection=docs"
import * as __fd_glob_27 from "../content/docs/plugins/validation.mdx?collection=docs"
import * as __fd_glob_26 from "../content/docs/plugins/relations.mdx?collection=docs"
import * as __fd_glob_25 from "../content/docs/plugins/overview.mdx?collection=docs"
import * as __fd_glob_24 from "../content/docs/plugins/full-text-search.mdx?collection=docs"
import * as __fd_glob_23 from "../content/docs/plugins/custom-plugins.mdx?collection=docs"
import * as __fd_glob_22 from "../content/docs/migration/from-alpha.mdx?collection=docs"
import * as __fd_glob_21 from "../content/docs/getting-started/quick-start.mdx?collection=docs"
import * as __fd_glob_20 from "../content/docs/getting-started/installation.mdx?collection=docs"
import * as __fd_glob_19 from "../content/docs/getting-started/cdn-usage.mdx?collection=docs"
import * as __fd_glob_18 from "../content/docs/core-concepts/schema.mdx?collection=docs"
import * as __fd_glob_17 from "../content/docs/core-concepts/query-engine.mdx?collection=docs"
import * as __fd_glob_16 from "../content/docs/core-concepts/model.mdx?collection=docs"
import * as __fd_glob_15 from "../content/docs/core-concepts/database.mdx?collection=docs"
import * as __fd_glob_14 from "../content/docs/core-concepts/collection.mdx?collection=docs"
import * as __fd_glob_13 from "../content/docs/examples/react-spa.mdx?collection=docs"
import * as __fd_glob_12 from "../content/docs/examples/node-cli.mdx?collection=docs"
import * as __fd_glob_11 from "../content/docs/examples/cdn-todo.mdx?collection=docs"
import * as __fd_glob_10 from "../content/docs/api-reference/types.mdx?collection=docs"
import * as __fd_glob_9 from "../content/docs/api-reference/schema.mdx?collection=docs"
import * as __fd_glob_8 from "../content/docs/api-reference/query-builder.mdx?collection=docs"
import * as __fd_glob_7 from "../content/docs/api-reference/model.mdx?collection=docs"
import * as __fd_glob_6 from "../content/docs/api-reference/errors.mdx?collection=docs"
import * as __fd_glob_5 from "../content/docs/api-reference/database.mdx?collection=docs"
import * as __fd_glob_4 from "../content/docs/api-reference/collection.mdx?collection=docs"
import * as __fd_glob_3 from "../content/docs/adapters/overview.mdx?collection=docs"
import * as __fd_glob_2 from "../content/docs/adapters/memory-adapter.mdx?collection=docs"
import * as __fd_glob_1 from "../content/docs/adapters/indexeddb-adapter.mdx?collection=docs"
import * as __fd_glob_0 from "../content/docs/contributing.mdx?collection=docs"
import { server } from 'fumadocs-mdx/runtime/server';
import type * as Config from '../source.config';

const create = server<typeof Config, import("fumadocs-mdx/runtime/types").InternalTypeConfig & {
  DocData: {
  }
}>({"doc":{"passthroughs":["extractedReferences"]}});

export const docs = await create.doc("docs", "content/docs", {"contributing.mdx": __fd_glob_0, "adapters/indexeddb-adapter.mdx": __fd_glob_1, "adapters/memory-adapter.mdx": __fd_glob_2, "adapters/overview.mdx": __fd_glob_3, "api-reference/collection.mdx": __fd_glob_4, "api-reference/database.mdx": __fd_glob_5, "api-reference/errors.mdx": __fd_glob_6, "api-reference/model.mdx": __fd_glob_7, "api-reference/query-builder.mdx": __fd_glob_8, "api-reference/schema.mdx": __fd_glob_9, "api-reference/types.mdx": __fd_glob_10, "examples/cdn-todo.mdx": __fd_glob_11, "examples/node-cli.mdx": __fd_glob_12, "examples/react-spa.mdx": __fd_glob_13, "core-concepts/collection.mdx": __fd_glob_14, "core-concepts/database.mdx": __fd_glob_15, "core-concepts/model.mdx": __fd_glob_16, "core-concepts/query-engine.mdx": __fd_glob_17, "core-concepts/schema.mdx": __fd_glob_18, "getting-started/cdn-usage.mdx": __fd_glob_19, "getting-started/installation.mdx": __fd_glob_20, "getting-started/quick-start.mdx": __fd_glob_21, "migration/from-alpha.mdx": __fd_glob_22, "plugins/custom-plugins.mdx": __fd_glob_23, "plugins/full-text-search.mdx": __fd_glob_24, "plugins/overview.mdx": __fd_glob_25, "plugins/relations.mdx": __fd_glob_26, "plugins/validation.mdx": __fd_glob_27, "react/database-provider.mdx": __fd_glob_28, "react/setup.mdx": __fd_glob_29, "react/use-doc.mdx": __fd_glob_30, "react/use-mutation.mdx": __fd_glob_31, "react/use-query.mdx": __fd_glob_32, });

export const meta = await create.meta("meta", "content/docs", {"meta.json": __fd_glob_33, });