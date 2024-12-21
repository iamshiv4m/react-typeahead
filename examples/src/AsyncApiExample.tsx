import React, { useState } from "react";
import { Typeahead } from "../../src";

interface GithubUser {
  id: number;
  login: string;
  avatar_url: string;
}

export const AsyncApiExample = () => {
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (query: string) => {
    if (!query) return [];

    try {
      setError(null);
      const response = await fetch(
        `https://api.github.com/search/users?q=${query}`
      );
      const data = await response.json();

      return data.items.map((user: GithubUser) => ({
        id: user.id,
        label: user.login,
        avatar: user.avatar_url,
      }));
    } catch (err) {
      setError("Failed to fetch users");
      return [];
    }
  };

  const renderItem = (item: any) => (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        padding: "8px",
      }}
    >
      <img
        src={item.avatar}
        alt=""
        style={{
          width: 24,
          height: 24,
          borderRadius: "50%",
        }}
      />
      <span>{item.label}</span>
    </div>
  );

  return (
    <div style={{ padding: "20px" }}>
      <h2>GitHub Users Search Example</h2>
      <Typeahead
        onSearch={handleSearch}
        onSelect={console.log}
        renderItem={renderItem}
        placeholder="Search GitHub users..."
        debounceTime={500}
        minQueryLength={2}
      />
      {error && <div style={{ color: "red", marginTop: "8px" }}>{error}</div>}
    </div>
  );
};
