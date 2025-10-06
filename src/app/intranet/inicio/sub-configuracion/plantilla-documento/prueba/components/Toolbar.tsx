// components/Toolbar.tsx
import React from 'react';
import { 
  Bold, Italic, Link, Image, Table, List, 
  Hash, Sigma, BookOpen, Quote 
} from 'lucide-react';
import { ElementType } from '@/types/latex';

interface ToolbarProps {
  onAddElement: (type: ElementType, initialContent?: any) => void;
}

interface ToolItem {
  icon: React.ComponentType<{ size: number }>;
  label: string;
  action: () => void;
}

interface ToolGroup {
  group: string;
  items: ToolItem[];
}

const Toolbar: React.FC<ToolbarProps> = ({ onAddElement }) => {
  const tools: ToolGroup[] = [
    { 
      group: 'Estructura', 
      items: [
        { icon: Hash, label: 'Sección', action: () => onAddElement('section') },
        { icon: Hash, label: 'Subsección', action: () => onAddElement('subsection') },
        { icon: Hash, label: 'Subsubsección', action: () => onAddElement('subsubsection') }
      ]
    },
    {
      group: 'Formato',
      items: [
        { icon: Bold, label: 'Negrita', action: () => onAddElement('bold') },
        { icon: Italic, label: 'Cursiva', action: () => onAddElement('italic') }
      ]
    },
    {
      group: 'Elementos',
      items: [
        { icon: Sigma, label: 'Fórmula', action: () => onAddElement('math') },
        { icon: Link, label: 'Enlace', action: () => onAddElement('link') },
        { icon: Image, label: 'Imagen', action: () => onAddElement('image') },
        { icon: Table, label: 'Tabla', action: () => onAddElement('table') },
        { icon: List, label: 'Lista con viñetas', action: () => onAddElement('bulletList') },
        { icon: List, label: 'Lista numerada', action: () => onAddElement('numberList') }
      ]
    },
    {
      group: 'Referencias',
      items: [
        { icon: BookOpen, label: 'Referencia cruzada', action: () => onAddElement('crossref') },
        { icon: Quote, label: 'Cita bibliográfica', action: () => onAddElement('cite') }
      ]
    }
  ];

  return (
    <div className="w-16 bg-white shadow-lg flex flex-col items-center py-4 space-y-6">
      {tools.map((group, groupIndex) => (
        <div key={groupIndex} className="flex flex-col items-center space-y-3">
          {group.items.map((tool, toolIndex) => {
            const IconComponent = tool.icon;
            return (
              <button
                key={toolIndex}
                onClick={tool.action}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors tooltip"
                data-tooltip={tool.label}
              >
                <IconComponent size={20} />
              </button>
            );
          })}
          {groupIndex < tools.length - 1 && <div className="w-8 border-t border-gray-200" />}
        </div>
      ))}
    </div>
  );
};

export default Toolbar;