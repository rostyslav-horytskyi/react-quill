import { useState, Children, type ReactNode } from 'react';

export interface Tab {
  id: string;
  label: ReactNode;
  ariaLabel?: string;
}

interface TabsProps {
  tabs: Tab[];
  children: ReactNode;
  defaultTab?: string;
}

export default function Tabs({ tabs, children, defaultTab }: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab ?? tabs[0]?.id);
  const childrenArray = Children.toArray(children);

  return (
    <div className="w-full">
      <div role="tablist" className="flex gap-1 p-1 bg-gray-100 dark:bg-gray-700 rounded-lg">
        {tabs.map(tab => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            id={`tab-${tab.id}`}
            aria-selected={activeTab === tab.id}
            aria-controls={`panel-${tab.id}`}
            aria-label={tab.ariaLabel}
            onClick={() => setActiveTab(tab.id)}
            className={`
              flex flex-1 justify-center px-4 py-2 text-sm font-medium rounded-md transition-all duration-150
              ${
                activeTab === tab.id
                  ? 'bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }
            `}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="mt-4">
        {tabs.map((tab, index) => (
          <div
            key={tab.id}
            role="tabpanel"
            id={`panel-${tab.id}`}
            aria-labelledby={`tab-${tab.id}`}
            hidden={activeTab !== tab.id}
          >
            {activeTab === tab.id && childrenArray[index]}
          </div>
        ))}
      </div>
    </div>
  );
}
