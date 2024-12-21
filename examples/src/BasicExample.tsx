import React from "react";
import { Typeahead } from "../../src";

export const BasicExample = () => {
  const handleSearch = async (query: string) => {
    // Add console.log to debug
    console.log("Search query:", query);

    const mockData = [
      { id: 1, label: "John Doe", email: "john@example.com" },
      { id: 2, label: "Jane Smith", email: "jane@example.com" },
      { id: 3, label: "Bob Johnson", email: "bob@example.com" },
    ];

    const filteredResults = mockData.filter((item) =>
      item.label.toLowerCase().includes(query.toLowerCase())
    );

    // Add console.log to see filtered results
    console.log("Filtered results:", filteredResults);

    return filteredResults;
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Basic Typeahead Example</h2>
      <Typeahead
        onSearch={handleSearch}
        onSelect={(item) => console.log("Selected:", item)}
        placeholder="Search users..."
        debounceTime={300}
      />
    </div>
  );
};
