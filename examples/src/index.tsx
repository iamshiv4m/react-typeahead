import React from "react";
import { createRoot } from "react-dom/client";
import { BasicExample } from "./BasicExample";
import { CustomRenderingExample } from "./CustomRenderingExample";
import { AsyncApiExample } from "./AsyncApiExample";
import { FormIntegrationExample } from "./FormIntegrationExample";

const container = document.getElementById("root");
const root = createRoot(container!);

root.render(
  <React.StrictMode>
    <div style={{ padding: "20px" }}>
      <div>
        <h1>Typeahead Examples</h1>

        <section>
          <BasicExample />
        </section>

        <hr />

        <section>
          <CustomRenderingExample />
        </section>

        <hr />

        <section>
          <AsyncApiExample />
        </section>

        <hr />

        <section>
          <FormIntegrationExample />
        </section>
      </div>
    </div>
  </React.StrictMode>
);
