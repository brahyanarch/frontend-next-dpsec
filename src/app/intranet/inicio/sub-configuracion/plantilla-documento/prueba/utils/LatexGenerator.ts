// utils/latexGenerator.ts
import { DocumentElement, TableData, ImageData } from '../types/latex';

/**
 * Generates complete LaTeX document code from visual editor elements
 */
export const generateLatexCode = (elements: DocumentElement[]): string => {
  // Document preamble with essential packages
  let latex = `\\documentclass{article}
\\usepackage[utf8]{inputenc}
\\usepackage{graphicx}
\\usepackage{amsmath}
\\usepackage{amsfonts}
\\usepackage{amssymb}
\\usepackage{hyperref}
\\usepackage{booktabs}
\\usepackage{xcolor}
\\begin{document}

`;

  // Process each element and generate corresponding LaTeX
  elements.forEach(element => {
    latex += generateElementLatex(element) + '\n\n';
  });

  // Close the document
  latex += '\\end{document}';
  
  return latex;
};

/**
 * Generates LaTeX code for a single document element
 */
const generateElementLatex = (element: DocumentElement): string => {
  switch (element.type) {
    case 'section':
      return `\\section{${escapeLatex(element.content)}}`;
    
    case 'subsection':
      return `\\subsection{${escapeLatex(element.content)}}`;
    
    case 'subsubsection':
      return `\\subsubsection{${escapeLatex(element.content)}}`;
    
    case 'paragraph':
      return generateParagraphLatex(element.content);
    
    case 'bold':
      return `\\textbf{${escapeLatex(element.content)}}`;
    
    case 'italic':
      return `\\textit{${escapeLatex(element.content)}}`;
    
    case 'math':
      return `\\(${element.content}\\)`;
    
    case 'link':
      return generateLinkLatex(element.content);
    
    case 'crossref':
      return `\\ref{${element.content}}`;
    
    case 'cite':
      return `\\cite{${element.content}}`;
    
    case 'table':
      return generateTableLatex(element.content);
    
    case 'image':
      return generateImageLatex(element.content);
    
    case 'bulletList':
      return generateListLatex(element.content, 'itemize');
    
    case 'numberList':
      return generateListLatex(element.content, 'enumerate');
    
    default:
      return `% Unknown element type: ${element.type}`;
  }
};

/**
 * Generates LaTeX for paragraphs with formatted text
 * Processes bold, italic, and math expressions within text
 */
const generateParagraphLatex = (content: string): string => {
  // Simple processing for formatted text segments
  // In a real implementation, you'd parse the content more carefully
  let processedContent = content;
  
  // Convert simple formatting markers (you might want more sophisticated parsing)
  processedContent = processedContent.replace(/\*\*(.*?)\*\*/g, '\\textbf{$1}');
  processedContent = processedContent.replace(/\*(.*?)\*/g, '\\textit{$1}');
  processedContent = processedContent.replace(/\$(.*?)\$/g, '\\($1\\)');
  
  return escapeLatex(processedContent);
};

/**
 * Generates LaTeX for hyperlinks
 */
const generateLinkLatex = (content: any): string => {
  if (typeof content === 'string') {
    return `\\href{${content}}{${content}}`;
  }
  
  if (content.url && content.text) {
    return `\\href{${content.url}}{${escapeLatex(content.text)}}`;
  }
  
  return `\\href{${content.url}}{${escapeLatex(content.url)}}`;
};

/**
 * Generates LaTeX code for tables
 */
const generateTableLatex = (tableData: TableData): string => {
  const { rows, cols, data, alignments, borders, caption, label } = tableData;
  
  let tableCode = '\\begin{table}[htbp]\n';
  tableCode += '\\centering\n';
  
  // Generate tabular environment with alignments
  const alignmentString = alignments.map(align => {
    switch (align) {
      case 'left': return 'l';
      case 'center': return 'c';
      case 'right': return 'r';
      default: return 'l';
    }
  }).join(' ');

  if (borders === 'booktabs') {
    tableCode += `\\begin{tabular}{${alignmentString}}\n`;
    tableCode += '\\toprule\n';
  } else if (borders === 'all') {
    tableCode += `\\begin{tabular}{|${alignmentString.split('').join('|')}|}\n`;
    tableCode += '\\hline\n';
  } else {
    tableCode += `\\begin{tabular}{${alignmentString}}\n`;
  }

  // Generate table rows
  for (let i = 0; i < rows; i++) {
    const rowData = [];
    for (let j = 0; j < cols; j++) {
      rowData.push(escapeLatex(data[i]?.[j] || ''));
    }
    
    tableCode += rowData.join(' & ');
    
    if (borders === 'booktabs') {
      tableCode += ' \\\\\n';
      if (i === 0) tableCode += '\\midrule\n';
      else if (i === rows - 1) tableCode += '\\bottomrule\n';
    } else if (borders === 'all') {
      tableCode += ' \\\\ \\hline\n';
    } else {
      tableCode += ' \\\\\n';
    }
  }

  tableCode += '\\end{tabular}\n';
  
  // Add caption and label if provided
  if (caption) {
    tableCode += `\\caption{${escapeLatex(caption)}}\n`;
  }
  
  if (label) {
    tableCode += `\\label{${label}}\n`;
  }
  
  tableCode += '\\end{table}';
  
  return tableCode;
};

/**
 * Generates LaTeX code for images
 */
const generateImageLatex = (imageData: ImageData): string => {
  let imageCode = '\\begin{figure}[htbp]\n';
  imageCode += '\\centering\n';
  
  // Use the filename if URL is a local path, otherwise use the full URL
  const imagePath = imageData.url.startsWith('http') 
    ? imageData.url 
    : imageData.url.split('/').pop() || imageData.url;
  
  imageCode += `\\includegraphics[width=0.8\\textwidth]{${imagePath}}\n`;
  
  if (imageData.caption) {
    imageCode += `\\caption{${escapeLatex(imageData.caption)}}\n`;
  }
  
  if (imageData.label) {
    imageCode += `\\label{${imageData.label}}\n`;
  }
  
  imageCode += '\\end{figure}';
  
  return imageCode;
};

/**
 * Generates LaTeX code for lists (bullet or numbered)
 */
const generateListLatex = (items: string[], listType: 'itemize' | 'enumerate'): string => {
  let listCode = `\\begin{${listType}}\n`;
  
  items.forEach(item => {
    listCode += `\\item ${escapeLatex(item)}\n`;
  });
  
  listCode += `\\end{${listType}}`;
  
  return listCode;
};

/**
 * Escapes LaTeX special characters
 * Essential to prevent compilation errors from user input :cite[8]
 */
const escapeLatex = (text: string): string => {
  if (!text) return '';
  
  const escapeMap: { [key: string]: string } = {
    '&': '\\&',
    '%': '\\%',
    '$': '\\$',
    '#': '\\#',
    '_': '\\_',
    '{': '\\{',
    '}': '\\}',
    '~': '\\textasciitilde{}',
    '^': '\\textasciicircum{}',
    '\\': '\\textbackslash{}'
  };
  
  return text.replace(/[&%$#_{}~^\\]/g, match => escapeMap[match]);
};

/**
 * Utility function to generate LaTeX for mathematical expressions
 * Can be extended to support more complex mathematical formatting :cite[1]
 */
export const generateMathLatex = (expression: string, isDisplayMode: boolean = false): string => {
  const delimiter = isDisplayMode ? '\\[' : '\\(';
  const endDelimiter = isDisplayMode ? '\\]' : '\\)';
  return `${delimiter}${expression}${endDelimiter}`;
};

/**
 * Validates generated LaTeX code for common syntax issues
 */
export const validateLatex = (latexCode: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  // Check for unmatched braces
  const openBraces = (latexCode.match(/{/g) || []).length;
  const closeBraces = (latexCode.match(/}/g) || []).length;
  if (openBraces !== closeBraces) {
    errors.push(`Unmatched braces: ${openBraces} opening vs ${closeBraces} closing`);
  }
  
  // Check for common LaTeX syntax issues
  const invalidPatterns = [
    { pattern: /\\[a-zA-Z]*{.*?[^}]$/m, message: 'Unclosed command brace' },
    { pattern: /\\begin{([^}]+)}(.*?)\\end{\1}/, message: 'Mismatched environment' },
  ];
  
  invalidPatterns.forEach(({ pattern, message }) => {
    if (pattern.test(latexCode)) {
      errors.push(message);
    }
  });
  
  return {
    isValid: errors.length === 0,
    errors
  };
};