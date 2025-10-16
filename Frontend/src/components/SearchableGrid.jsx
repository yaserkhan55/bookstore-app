import React from "react";

export default function SearchableGrid({ items, searchQuery, renderItem, emptyMessage }) {
  const filteredItems = items.filter((item) => {
    const titleMatch = item.title?.toLowerCase().includes(searchQuery.toLowerCase());
    const authorMatch = item.authors?.some(a =>
      a.name.toLowerCase().includes(searchQuery.toLowerCase())
    ) || false;
    return titleMatch || authorMatch;
  });

  if (filteredItems.length === 0) {
    return <p className="text-center text-gray-500 mt-10">{emptyMessage}</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {filteredItems.map((item, idx) => (
        <div key={item._id || item.id || idx}>
          {renderItem(item, idx)}
        </div>
      ))}
    </div>
  );
}
