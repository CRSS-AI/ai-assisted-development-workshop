import { Metadata } from 'next';
import TodoUploader from './TodoUploader';
import PageHeader from './components/PageHeader';
import FeatureCard from './components/FeatureCard';
import PageFooter from './components/PageFooter';

export const metadata: Metadata = {
  title: 'AI Todo Extractor | Extract Tasks from Documents',
  description: 'Use AI to automatically extract actionable todo lists from your documents with Azure OpenAI integration.',
};

export default function HomePage() {
  const features = [
    {
      title: 'How it works',
      items: [
        'Upload or paste your document text',
        'AI analyzes the content for actionable tasks',
        'Get a clean JSON array of todo items'
      ],
      type: 'ordered' as const
    },
    {
      title: 'Supported Formats',
      items: [
        'Plain text (.txt)',
        'Markdown (.md)',
        'Direct text input'
      ]
    },
    {
      title: 'AI Technology',
      items: [
        'Azure OpenAI GPT-4.1-mini',
        'LangChain integration',
        'Robust error handling'
      ]
    }
  ];

  return (
    <div className="min-h-screen p-8 pb-20 sm:p-20">
      <div className="max-w-6xl mx-auto">
        <PageHeader 
          title="AI Todo Extractor"
          description="Extract actionable todo lists from your documents using Azure OpenAI"
        />
        
        <section className="grid gap-8 lg:grid-cols-3 mb-12" aria-label="Features">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              title={feature.title}
              items={feature.items}
              type={feature.type}
            />
          ))}
        </section>
        
        <main>
          <TodoUploader />
        </main>
        
        <PageFooter text="Powered by Azure OpenAI and Next.js" />
      </div>
    </div>
  );
}
