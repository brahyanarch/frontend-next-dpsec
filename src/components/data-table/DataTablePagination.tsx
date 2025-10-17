// components/data-table/DataTablePagination.tsx
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon
} from 'lucide-react';

interface DataTablePaginationProps {
  pageIndex: number;
  pageSize: number;
  totalCount: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}

export function DataTablePagination({
  pageIndex,
  pageSize,
  totalCount,
  onPageChange,
  onPageSizeChange
}: DataTablePaginationProps) {
  const pageCount = Math.ceil(totalCount / pageSize);
  const canPrevious = pageIndex > 0;
  const canNext = pageIndex < pageCount - 1;

  return (
    <div className="flex items-center justify-between px-2">
      <div className="flex items-center space-x-2">
        <p className="text-sm text-muted-foreground">
          Mostrando {pageIndex * pageSize + 1}-{Math.min((pageIndex + 1) * pageSize, totalCount)} de {totalCount} registros
        </p>
      </div>
      
      <div className="flex items-center space-x-6 lg:space-x-8">
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium">Filas por página</p>
          <Select
            value={`${pageSize}`}
            onValueChange={(value) => onPageSizeChange(Number(value))}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {[10, 20, 30, 40, 50].map((size) => (
                <SelectItem key={size} value={`${size}`}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => onPageChange(0)}
            disabled={!canPrevious}
          >
            <ChevronsLeftIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => onPageChange(pageIndex - 1)}
            disabled={!canPrevious}
          >
            <ChevronLeftIcon className="h-4 w-4" />
          </Button>
          
          <div className="flex w-[100px] items-center justify-center text-sm font-medium">
            Página {pageIndex + 1} de {pageCount}
          </div>
          
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => onPageChange(pageIndex + 1)}
            disabled={!canNext}
          >
            <ChevronRightIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => onPageChange(pageCount - 1)}
            disabled={!canNext}
          >
            <ChevronsRightIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}