interface PageFooterProps {
  text: string;
}

export default function PageFooter({ text }: PageFooterProps) {
  return (
    <footer className="text-center mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
      <p className="text-sm text-gray-500">
        {text}
      </p>
    </footer>
  );
}
