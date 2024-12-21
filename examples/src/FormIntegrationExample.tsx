import React, { useState } from "react";
import { Typeahead, TypeaheadItem } from "../../src";

interface FormData {
  userId: string;
  userName: string;
  comments: string;
}

export const FormIntegrationExample = () => {
  const [formData, setFormData] = useState<FormData>({
    userId: "",
    userName: "",
    comments: "",
  });

  const handleSearch = async (query: string) => {
    // Simulating API call
    const mockUsers = [
      { id: "1", label: "John Doe" },
      { id: "2", label: "Jane Smith" },
      { id: "3", label: "Bob Johnson" },
    ];

    return mockUsers.filter((user) =>
      user.label.toLowerCase().includes(query.toLowerCase())
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Form Integration Example</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "16px" }}>
          <label style={{ display: "block", marginBottom: "8px" }}>
            Select User:
          </label>
          <Typeahead
            onSearch={handleSearch}
            onSelect={(item: TypeaheadItem) => {
              setFormData((prev) => ({
                ...prev,
                userId: item.id.toString(),
                userName: item.label,
              }));
            }}
            placeholder="Search for a user..."
          />
        </div>

        <div style={{ marginBottom: "16px" }}>
          <label style={{ display: "block", marginBottom: "8px" }}>
            Comments:
          </label>
          <textarea
            value={formData.comments}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                comments: e.target.value,
              }))
            }
            rows={4}
            style={{ width: "100%", padding: "8px" }}
          />
        </div>

        <button
          type="submit"
          style={{
            padding: "8px 16px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Submit
        </button>

        <div style={{ marginTop: "16px" }}>
          <strong>Form Data:</strong>
          <pre>{JSON.stringify(formData, null, 2)}</pre>
        </div>
      </form>
    </div>
  );
};
