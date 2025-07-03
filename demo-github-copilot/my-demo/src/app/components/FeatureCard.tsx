interface FeatureCardProps {
  title: string;
  items: string[];
  type?: 'ordered' | 'unordered';
}

export default function FeatureCard({ title, items, type = 'unordered' }: FeatureCardProps) {
  const ListComponent = type === 'ordered' ? 'ol' : 'ul';
  const listClass = type === 'ordered' 
    ? 'list-decimal list-inside space-y-2 text-sm'
    : 'list-disc list-inside space-y-2 text-sm';

  return (
    <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg">
      <h2 className="text-xl font-semibold mb-2">{title}</h2>
      <ListComponent className={listClass}>
        {items.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ListComponent>
    </div>
  );
}
