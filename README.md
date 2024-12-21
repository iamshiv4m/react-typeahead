# React Typeahead Component

A highly customizable React Typeahead component with TypeScript support, built with performance and accessibility in mind.

## Features

- 🚀 Performance optimized
- ♿️ Fully accessible
- 💅 Customizable styling
- 🎹 Keyboard navigation
- 🔄 Built-in caching
- 📱 Mobile-friendly
- 📦 Small bundle size
- 💪 TypeScript support

## Installation

```bash
npm install react-typeahead-component
```

## Props

| Prop           | Type                                          | Default     | Description                            |
| -------------- | --------------------------------------------- | ----------- | -------------------------------------- |
| onSearch       | `(query: string) => Promise<TypeaheadItem[]>` | Required    | Function to fetch search results       |
| onSelect       | `(item: TypeaheadItem) => void`               | Required    | Callback when item is selected         |
| placeholder    | `string`                                      | "Search..." | Input placeholder text                 |
| debounceTime   | `number`                                      | 300         | Debounce time in milliseconds          |
| maxResults     | `number`                                      | 10          | Maximum number of results to display   |
| minQueryLength | `number`                                      | 2           | Minimum query length to trigger search |
| renderItem     | `(item: TypeaheadItem) => ReactNode`          | undefined   | Custom item renderer                   |

## License

MIT © [Your Name]

## Usage

```tsx
import { Typeahead } from "react-typeahead-component";

const App = () => {
  return <Typeahead />;
};

export default App;
```
