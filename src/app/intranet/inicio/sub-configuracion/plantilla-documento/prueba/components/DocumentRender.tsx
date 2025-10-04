"use client";

import React from "react";
export type DocElement =
  | { type: "section"; title: string; children: DocElement[] }
  | { type: "subsection"; title: string; children: DocElement[] }
  | { type: "subsubsection"; title: string; children: DocElement[] }
  | { type: "text"; content: string; editable: boolean } // editable = true (usuario llena), false (predefinido)
  | { type: "list"; ordered: boolean; items: string[] }
  | { type: "table"; rows: string[][] };
  
export function DocumentRenderer({ doc, setDoc }: { doc: DocElement[]; setDoc: (d: DocElement[]) => void }) {
  const updateElement = (index: number, newEl: DocElement) => {
    const updated = [...doc];
    updated[index] = newEl;
    setDoc(updated);
  };

  return (
    <div className="space-y-4">
      {doc.map((el, i) => {
        switch (el.type) {
          case "section":
            return (
              <div key={i} className="border p-4 rounded-lg bg-blue-50">
                <input
                  type="text"
                  value={el.title}
                  onChange={(e) => updateElement(i, { ...el, title: e.target.value })}
                  className="text-xl font-bold w-full mb-2"
                />
                <DocumentRenderer doc={el.children} setDoc={(children) => updateElement(i, { ...el, children })} />
              </div>
            );
          case "text":
            return (
              <textarea
                key={i}
                value={el.content}
                onChange={(e) => updateElement(i, { ...el, content: e.target.value })}
                disabled={!el.editable}
                className="w-full border rounded-md p-2"
              />
            );
          case "list":
            return (
              <div key={i} className="border p-3 rounded-md">
                <p className="font-semibold">{el.ordered ? "Enumerate" : "Itemize"}</p>
                {el.items.map((item, idx) => (
                  <input
                    key={idx}
                    type="text"
                    value={item}
                    onChange={(e) => {
                      const newItems = [...el.items];
                      newItems[idx] = e.target.value;
                      updateElement(i, { ...el, items: newItems });
                    }}
                    className="w-full border rounded p-1 my-1"
                  />
                ))}
                <button
                  onClick={() => updateElement(i, { ...el, items: [...el.items, ""] })}
                  className="text-sm text-blue-600 mt-2"
                >
                  + Agregar item
                </button>
              </div>
            );
          case "table":
            return (
              <table key={i} className="border-collapse border border-gray-400 w-full">
                <tbody>
                  {el.rows.map((row, rIdx) => (
                    <tr key={rIdx}>
                      {row.map((cell, cIdx) => (
                        <td key={cIdx} className="border border-gray-400 p-1">
                          <input
                            type="text"
                            value={cell}
                            onChange={(e) => {
                              const newRows = [...el.rows];
                              newRows[rIdx][cIdx] = e.target.value;
                              updateElement(i, { ...el, rows: newRows });
                            }}
                            className="w-full"
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            );
        }
      })}
    </div>
  );
}
