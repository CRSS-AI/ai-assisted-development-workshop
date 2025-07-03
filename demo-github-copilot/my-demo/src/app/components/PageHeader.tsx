interface PageHeaderProps {
  title: string;
  description: string;
}

export default function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <header className="text-center mb-12">
      <h1 className="text-4xl font-bold mb-4">{title}</h1>
      <p className="text-lg text-gray-600 dark:text-gray-400">
        {description}
      </p>
    </header>
  );
}
