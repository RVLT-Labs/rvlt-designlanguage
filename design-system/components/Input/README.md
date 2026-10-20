# Input

`Input` and `SearchInput` share a 44px minimum height, 16px text, accessible control outline and muted placeholder. SearchInput defaults to `type="search"`. A placeholder supplements a persistent label. Textarea retains the same text and outline contract.

Associate Label `htmlFor` with the control `id`. Set native `required` and a visible “required” label for mandatory fields. Use the appropriate native type, including `email` and `number`. Set `aria-invalid` after validation, and link hints/errors using `aria-describedby`. Announce newly inserted validation errors with `role="alert"`; do not announce errors on every keystroke. Keep entered values when validation fails and focus the invalid field on submission.

Forms stack in one column on phones, with an optional two-column grid from medium widths. Source: `packages/flow-theme/examples/form-field.tsx`. This source is compiled against the registry and rendered at `/preview-v2/contracts/#form-field`.
