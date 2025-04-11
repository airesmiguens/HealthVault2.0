import { useState } from 'react';
import { HealthData, HealthItem } from '@/types/health';
import {
  BeakerIcon,
  CalendarIcon,
  ClockIcon,
  HeartIcon,
  ShieldCheckIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';

interface HealthDataDisplayProps {
  data: HealthData;
}

export default function HealthDataDisplay({ data }: HealthDataDisplayProps) {
  const [activeTab, setActiveTab] = useState<keyof HealthData>('conditions');

  const tabs: Array<{ key: keyof HealthData; label: string; icon: React.ElementType }> = [
    { key: 'conditions', label: 'Conditions', icon: HeartIcon },
    { key: 'medications', label: 'Medications', icon: BeakerIcon },
    { key: 'vaccines', label: 'Vaccines', icon: ShieldCheckIcon },
    { key: 'dates', label: 'Dates', icon: CalendarIcon },
    { key: 'allergies', label: 'Allergies', icon: ExclamationTriangleIcon },
    { key: 'vitals', label: 'Vitals', icon: ClockIcon },
  ];

  const renderHealthItem = (item: HealthItem) => (
    <div
      key={item.name}
      className="flex items-center gap-2 bg-white rounded-lg p-2 shadow-sm"
    >
      <div className="flex-1">
        <p className="font-medium text-gray-900">{item.name}</p>
        {item.details && (
          <p className="text-sm text-gray-500">{item.details}</p>
        )}
        {item.date && (
          <p className="text-xs text-gray-400">{item.date}</p>
        )}
      </div>
      <div className="text-xs font-medium px-2 py-1 rounded-full bg-blue-100 text-blue-800">
        {Math.round(item.confidence * 100)}%
      </div>
    </div>
  );

  const renderDateItem = (item: HealthData['dates'][0]) => (
    <div
      key={item.date + item.context}
      className="flex items-center gap-2 bg-white rounded-lg p-2 shadow-sm"
    >
      <CalendarIcon className="h-5 w-5 text-gray-400" />
      <div className="flex-1">
        <p className="font-medium text-gray-900">{item.date}</p>
        <p className="text-sm text-gray-500">{item.context}</p>
        <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
          {item.type}
        </span>
      </div>
    </div>
  );

  const renderVitalItem = (item: HealthData['vitals'][0]) => (
    <div
      key={`${item.type}-${item.value}-${item.date}`}
      className="flex items-center gap-2 bg-white rounded-lg p-2 shadow-sm"
    >
      <ClockIcon className="h-5 w-5 text-gray-400" />
      <div className="flex-1">
        <p className="font-medium text-gray-900 capitalize">
          {item.type.replace('_', ' ')}
        </p>
        <p className="text-sm text-gray-500">
          {item.value} {item.unit}
        </p>
        {item.date && (
          <p className="text-xs text-gray-400">{item.date}</p>
        )}
      </div>
    </div>
  );

  const renderContent = () => {
    const items = data[activeTab];
    if (!items?.length) {
      return (
        <p className="text-gray-500 text-center py-4">
          No {activeTab} found in this document
        </p>
      );
    }

    return (
      <div className="space-y-2">
        {activeTab === 'dates' && items.map(item => renderDateItem(item as any))}
        {activeTab === 'vitals' && items.map(item => renderVitalItem(item as any))}
        {(activeTab === 'conditions' || activeTab === 'medications' || 
          activeTab === 'vaccines' || activeTab === 'allergies') && 
          items.map(item => renderHealthItem(item as HealthItem))}
      </div>
    );
  };

  return (
    <div className="bg-gray-50 rounded-xl p-4">
      <div className="flex gap-2 overflow-x-auto pb-2 mb-4">
        {tabs.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap
              ${activeTab === key
                ? 'bg-blue-100 text-blue-800'
                : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
          >
            <Icon className="h-4 w-4" />
            {label}
          </button>
        ))}
      </div>

      {renderContent()}
    </div>
  );
} 