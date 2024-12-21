# React Typeahead Component

A highly customizable React Typeahead component with TypeScript support, built with performance and accessibility in mind.

## Features

- 🚀 Performance optimized with built-in debouncing
- ♿️ Fully accessible with ARIA attributes
- 💅 Customizable styling with modular CSS
- 🎹 Keyboard navigation support (Arrow keys, Enter, Escape)
- 🔄 Built-in result caching
- 📱 Mobile-friendly design
- 📦 Small bundle size with tree-shaking
- 💪 TypeScript support with full type definitions

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
| cacheTime      | `number`                                      | 300000      | Cache duration in milliseconds         |

## License

MIT © Shivam Jha

## Examples

### Custom Rendering

```tsx
import { Typeahead } from "react-typeahead-component";

const CustomExample = () => {
  const renderItem = (item) => (
    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      <img
        src={item.avatar}
        alt=""
        style={{ width: 24, height: 24, borderRadius: "50%" }}
      />
      <span>{item.label}</span>
    </div>
  );

  return (
    <Typeahead
      onSearch={handleSearch}
      onSelect={handleSelect}
      renderItem={renderItem}
      placeholder="Search users..."
    />
  );
};
```

### Form Integration

```tsx
import React, { useState } from "react";
import { Typeahead } from "react-typeahead-component";

const FormExample = () => {
  const [formData, setFormData] = useState({ userId: "", userName: "" });

  return (
    <form>
      <Typeahead
        onSearch={handleSearch}
        onSelect={(item) => {
          setFormData({
            userId: item.id,
            userName: item.label,
          });
        }}
        placeholder="Select user..."
      />
    </form>
  );
};
```
