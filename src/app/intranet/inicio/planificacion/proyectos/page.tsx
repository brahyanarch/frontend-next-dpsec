"use client"
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface DataRow {
  id: number;
  name: string;
  email: string;
  role: string;
  tags: string[];
}

const mockData: DataRow[] = [
  { id: 1, name: "Alice", email: "alice@example.com", role: "Admin", tags: ["team", "core"] },
  { id: 2, name: "Bob", email: "bob@example.com", role: "User", tags: ["external"] },
  { id: 3, name: "Charlie", email: "charlie@example.com", role: "Editor", tags: ["team"] },
  { id: 4, name: "Diana", email: "diana@example.com", role: "User", tags: ["review"] },
  // más filas si se desea
];

const columns = ["name", "email", "role", "tags"] as const;

export default function DataTable() {
  const [search, setSearch] = useState("");
  const [visibleColumns, setVisibleColumns] = useState<string[]>([...columns]);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [page, setPage] = useState(1);

  const filteredData = mockData.filter(row => {
    const matchGlobal =
      row.name.toLowerCase().includes(search.toLowerCase()) ||
      row.email.toLowerCase().includes(search.toLowerCase()) ||
      row.role.toLowerCase().includes(search.toLowerCase()) ||
      row.tags.some(tag => tag.toLowerCase().includes(search.toLowerCase()));
    return matchGlobal;
  });

  const paginatedData = filteredData.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const toggleColumn = (col: string) => {
    setVisibleColumns(prev =>
      prev.includes(col) ? prev.filter(c => c !== col) : [...prev, col]
    );
  };

  return (
    <div className="p-4">
      <div className="flex flex-wrap gap-2 mb-4 items-center">
        <Input
          placeholder="Buscar en la tabla..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
        <Select onValueChange={val => setItemsPerPage(Number(val))}>
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder={`${itemsPerPage} por página`} />
          </SelectTrigger>
          <SelectContent>
            {[5, 10, 20, 50].map(num => (
              <SelectItem key={num} value={String(num)}>{num}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="flex gap-2">
          {columns.map(col => (
            <div key={col} className="flex items-center gap-1">
              <Checkbox
                checked={visibleColumns.includes(col)}
                onCheckedChange={() => toggleColumn(col)}
              />
              <label className="text-sm capitalize">{col}</label>
            </div>
          ))}
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            {columns.map(col => visibleColumns.includes(col) && (
              <TableHead key={col} className="capitalize">{col}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedData.map(row => (
            <TableRow key={row.id}>
              {visibleColumns.includes("name") && <TableCell>{row.name}</TableCell>}
              {visibleColumns.includes("email") && <TableCell>{row.email}</TableCell>}
              {visibleColumns.includes("role") && <TableCell>{row.role}</TableCell>}
              {visibleColumns.includes("tags") && (
                <TableCell>{row.tags.map(tag => (
                  <span
                    key={tag}
                    className="inline-block bg-muted text-sm px-2 py-0.5 rounded-full mr-1"
                  >{tag}</span>
                ))}</TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="flex justify-between items-center mt-4">
        <span className="text-sm">Página {page} de {totalPages}</span>
        <div className="flex gap-2">
          <Button variant="outline" disabled={page === 1} onClick={() => setPage(1)}>Primera</Button>
          <Button variant="outline" disabled={page === 1} onClick={() => setPage(page - 1)}>Anterior</Button>
          <Button variant="outline" disabled={page === totalPages} onClick={() => setPage(page + 1)}>Siguiente</Button>
          <Button variant="outline" disabled={page === totalPages} onClick={() => setPage(totalPages)}>Última</Button>
        </div>
      </div>
    </div>
  );
}
