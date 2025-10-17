// components/data-table/DataTableViewOptions.tsx
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Settings2 } from 'lucide-react';
import { ColumnDef } from './types';

interface DataTableViewOptionsProps<T> {
  columns: ColumnDef<T>[];
  columnVisibility: Record<string, boolean>;
  onColumnVisibilityChange: (visibility: Record<string, boolean>) => void;
}

export function DataTableViewOptions<T>({
  columns,
  columnVisibility,
  onColumnVisibilityChange
}: DataTableViewOptionsProps<T>) {
  const handleVisibilityChange = (key: string, visible: boolean) => {
    onColumnVisibilityChange({
      ...columnVisibility,
      [key]: visible
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="ml-auto">
          <Settings2 className="mr-2 h-4 w-4" />
          Ver columnas
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel>Columnas visibles</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {columns.map((column) => (
          <DropdownMenuCheckboxItem
            key={column.key as string}
            checked={columnVisibility[column.key as string] !== false}
            onCheckedChange={(checked) => 
              handleVisibilityChange(column.key as string, checked as boolean)
            }
          >
            {column.header}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}