# @kyso/icons

To achieve type-safety, flexibility and small bundle size, we've implemented a lazy-loaded icons mechanism based on:

- `generate-icons` script (to create types and icon chunks)
- `icons.gen.ts` - the generated part that provides the API
- `Icon` component that leverages the generated code and lazy-loads the chunks

## Usage

To use an icon in your component, import it from `@kyso/icons` and pass the `name` prop:

```typescriptreact
import { Icon } from "@kyso/icons";
<Icon name="Acorn" />
```

You may provide more props and extend their type directly in the `icon` file.

## Extending

1. Add new icon sources to `ICON_SOURCES` in `generate-icons` file:

```typescriptreact
const ICON_SOURCES: IconSource[] = [
  //...
  {
    path: '../../../assets/icons/',
  },
  {
    path: '../../node_modules/some-cool-icons/dist/svg'
  }
];
```

2. Generate the icons using `pnpm i`. It will trigger the `prepare` script of `@kyso/icons` package.

3. Commit the newly generated `icons.gen.ts` file
