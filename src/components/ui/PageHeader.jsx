import React from "react";
import { Button } from "@/components/ui/button";
import { Upload, Download, Filter, Plus } from "lucide-react";

const PageHeader = ({
  title,
  onCreate,
  onImport,
  onExport,
  onFilter,
  showCreate = true,
  showImportExport = true,
  showFilter = true,
}) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
      <h1 className="text-2xl font-bold">{title}</h1>

      <div className="flex flex-wrap gap-2">
        {showImportExport && (
          <>
            <Button
              variant="outline"
              className="flex items-center gap-1"
              onClick={onImport}
            >
              <Upload size={16} />
              Import
            </Button>
            <Button
              variant="outline"
              className="flex items-center gap-1"
              onClick={onExport}
            >
              <Download size={16} />
              Export
            </Button>
          </>
        )}

        {showFilter && (
          <Button
            variant="outline"
            className="flex items-center gap-1"
            onClick={onFilter}
          >
            <Filter size={16} />
            Show in Sidebar
          </Button>
        )}

        {showCreate && (
          <Button
            onClick={onCreate}
            className="flex items-center gap-1"
            variant="rose"
          >
            <Plus size={18} />
            Create
          </Button>
        )}
      </div>
    </div>
  );
};

export default PageHeader;
