// types/latex.ts
export type ElementType = 
  | 'paragraph' 
  | 'section' 
  | 'subsection' 
  | 'subsubsection' 
  | 'bold' 
  | 'italic' 
  | 'math' 
  | 'link' 
  | 'crossref' 
  | 'cite' 
  | 'table' 
  | 'image' 
  | 'bulletList' 
  | 'numberList';

export interface DocumentElement {
  id: string;
  type: ElementType;
  content: any;
  metadata?: Record<string, any>;
}

export interface TextSegment {
  text: string;
  formats: string[];
  isMath?: boolean;
  link?: string;
}

export interface TableData {
  rows: number;
  cols: number;
  data: string[][];
  alignments: ('left' | 'center' | 'right')[];
  borders: 'all' | 'none' | 'booktabs';
  caption: string;
  label: string;
}

export interface ImageData {
  url: string;
  caption: string;
  label: string;
  file?: File;
}

export interface Reference {
  id: string;
  type: 'table' | 'figure' | 'section';
  label: string;
  caption: string;
}

export interface Citation {
  key: string;
  title: string;
  author: string;
}

export interface SelectedText {
  elementId: string | null;
  start: number;
  end: number;
}

export interface FormatMenuPosition {
  x: number;
  y: number;
}