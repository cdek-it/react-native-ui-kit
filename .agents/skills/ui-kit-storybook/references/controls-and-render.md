# Typed Controls And Render

## Types And Adapters

- Use public prop types plus local `StoryArgs` for demo fields. When replacing a
  prop type, remove it with `Omit` before adding the control type; do not create
  an incompatible intersection or bypass errors with `any` or double casts.
- Keep the real `component` in typed CSF metadata. Reuse a matching family's
  existing typed helper when needed rather than adding a universal abstraction.
- Map serializable preset keys to actual nodes, functions, or objects through
  `mapping` or a typed lookup. Consume demo fields before spreading public props
  into the component.
- For independently editable nested-node properties, use flat typed fields and
  construct the node in render. Dotted keys such as `badge.text` label panel
  controls; they do not introduce nested runtime props.
- Distinguish hiding an element from resetting its override to an internal
  default. Use the API's actual absence or visibility mechanism; do not assume
  `undefined` always hides the element or substitute an empty fake wrapper.

## State, Actions, And Controls

- Put initial values in `args`, not `argTypes.defaultValue`.
- An args-controlled playground updates its controlling argument through
  `useArgs`/`updateArgs`. Custom handlers must also call the original callback
  with its full payload so Actions keep working; do not impose one callback
  ordering across unrelated contracts.
- Local consumer state is valid for a real integration setup. Synchronize it
  with Controls where they govern the same value; hide inherited controls that
  the render does not consume. Static comparisons need no artificial state.
- When restricting `controls.include`, retain environment controls actually
  provided by the checkout, such as its global `theme` control.
- Keep callback Actions separate from editable Controls. Reuse existing labels
  and the global actions regex; do not rename them only for uniformity.
