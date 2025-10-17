// components/data-table/DataTableFilter.tsx
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface FilterOption {
  value: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
}

export interface DataTableFilterProps {
  // Configuración del filtro
  options: FilterOption[];
  placeholder?: string;
  emptyLabel?: string;
  
  // Estado y control
  value: string;
  onValueChange: (value: string) => void;
  
  // Personalización
  label: string;
  className?: string;
  showBadge?: boolean;
}

export function DataTableFilter({
  options,
  placeholder = "Seleccionar filtro",
  emptyLabel = "Todos",
  value,
  onValueChange,
  label,
  className,
  showBadge = true
}: DataTableFilterProps) {
  // Encontrar la opción seleccionada para mostrar en el badge
  const selectedOption = options.find(opt => opt.value === value);
  
  // Valor para "vacío" - usamos el primer option como default para empty
  const emptyValue = options[0]?.value || 'ALL';

  return (
    <div className={cn("flex items-center gap-4", className)}>
      {/* Select Component */}
      <div className="w-64">
        <Select value={value} onValueChange={onValueChange}>
          <SelectTrigger>
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem 
                key={option.value} 
                value={option.value}
              >
                <div className="flex items-center gap-2">
                  {option.icon && <option.icon className="h-4 w-4" />}
                  {option.label}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Badge para mostrar filtro activo */}
      {showBadge && value && value !== emptyValue && selectedOption && (
        <Badge variant="secondary" className="flex items-center gap-1">
          {label}: {selectedOption.label}
          <Button
            variant="ghost"
            size="sm"
            className="h-3 w-3 p-0 hover:bg-transparent"
            onClick={() => onValueChange(emptyValue)}
          >
            ×
          </Button>
        </Badge>
      )}
    </div>
  );
}