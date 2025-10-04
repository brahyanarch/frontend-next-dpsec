export type DocElement =
  | { type: "section"; title: string; children: DocElement[] }
  | { type: "subsection"; title: string; children: DocElement[] }
  | { type: "subsubsection"; title: string; children: DocElement[] }
  | { type: "text"; content: string; editable: boolean } // editable = true (usuario llena), false (predefinido)
  | { type: "list"; ordered: boolean; items: string[] }
  | { type: "table"; rows: string[][] };