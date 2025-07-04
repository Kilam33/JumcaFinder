import React from 'react';
import { AlertCircle } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
}

export function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center">
      <AlertCircle className="h-5 w-5 text-red-500 mr-3 flex-shrink-0" />
      <p className="text-red-700">{message}</p>
    </div>
  );
}