// components/DataTable.jsx
"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Eye, 
  Edit3, // Changed from Edit to match UserManagement icons
  Trash2,
  MoreVertical
} from 'lucide-react';

// --- Generic DataTable Component ---
const DataTable = ({ 
  data = [], 
  columns = [], 
  onAction = () => {},
  getRowKey = (item) => item.id, 
  emptyStateMessage = "No data available.",
  searchTerm = "", 
  onSearchTermChange = () => {},
  showActions = true, // Flag to show/hide the actions column
  customRenderCell, // Optional: Function to override default cell rendering
  className = "" // Allow passing additional classes to the container card
}) => {

  // --- Handle Empty State ---
  if (data.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 text-gray-300 mx-auto mb-4 flex items-center justify-center">
          {/* You might want a dynamic icon here based on data type, or pass one as a prop */}
          <MoreVertical className="w-8 h-8" /> 
        </div>
        <h3 className="text-lg font-semibold text-gray-600 mb-2">{emptyStateMessage}</h3>
        <p className="text-gray-500 mb-6">
          {searchTerm ? 'Try adjusting your search terms' : 'No items found.'}
        </p>
        {/* Optionally add an 'Add' button here if needed, passed as a prop */}
      </div>
    );
  }

  // --- Default Cell Renderer ---
  const defaultRenderCell = (item, column) => {
    const value = item[column.key];
    if (column.render) {
      // Allow columns to define their own render function
      return column.render(value, item);
    }
    // Basic rendering: Check for date-like strings and format?
    // For now, just display the value as text.
    return <span className="text-gray-700">{value}</span>;
  };

  return (
    <Card className={`shadow-sm ${className}`}>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {columns.map((column) => (
                  <th 
                    key={column.key} 
                    className="text-left py-3 px-4 md:py-4 md:px-6 font-semibold text-gray-700 text-xs md:text-sm"
                  >
                    {column.label}
                  </th>
                ))}
                {showActions && <th className="text-center py-3 px-4 md:py-4 md:px-6 font-semibold text-gray-700 text-xs md:text-sm">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {data.map((item) => (
                <tr 
                  key={getRowKey(item)} 
                  className="hover:bg-gray-50 transition-colors duration-150"
                >
                  {columns.map((column) => (
                    <td key={`${getRowKey(item)}-${column.key}`} className="py-3 px-4 md:py-4 md:px-6">
                      {customRenderCell ? customRenderCell(item, column) : defaultRenderCell(item, column)}
                    </td>
                  ))}
                  {showActions && (
                    <td className="py-3 px-4 md:py-4 md:px-6">
                      <div className="flex items-center justify-center space-x-1"> {/* Reduced space-x */}
                        <Button 
                          variant="ghost" 
                          size="sm" // Use sm size
                          onClick={() => onAction('view', item)}
                          className="h-8 w-8 p-0 text-blue-600 hover:bg-blue-50 hover:text-blue-700" // Specific hover colors
                          title="View"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => onAction('edit', item)}
                          className="h-8 w-8 p-0 text-gray-600 hover:bg-gray-50 hover:text-gray-700"
                          title="Edit"
                        >
                          <Edit3 className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => onAction('delete', item)}
                          className="h-8 w-8 p-0 text-red-600 hover:bg-red-50 hover:text-red-700"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default DataTable;