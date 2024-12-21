import React from "react";
import { Typeahead, TypeaheadItem } from "../../src";

interface User extends TypeaheadItem {
  email: string;
  avatar: string;
}

export const CustomRenderingExample = () => {
  const handleSearch = async (query: string): Promise<User[]> => {
    // Simulating API call with more detailed data
    const mockUsers: User[] = [
      {
        id: 1,
        label: "John Doe",
        email: "john@example.com",
        avatar: "https://via.placeholder.com/32",
      },
      {
        id: 2,
        label: "Jane Smith",
        email: "jane@example.com",
        avatar: "https://via.placeholder.com/32",
      },
    ];

    return mockUsers.filter((user) =>
      user.label.toLowerCase().includes(query.toLowerCase())
    );
  };

  const renderItem = (item: TypeaheadItem) => {
    const user = item as User;
    return `${user.label} (${user.email})`;
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Custom Rendering Example</h2>
      <Typeahead
        onSearch={handleSearch}
        onSelect={console.log}
        renderItem={renderItem}
        placeholder="Search users with custom rendering..."
      />
    </div>
  );
};
