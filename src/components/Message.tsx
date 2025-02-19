import { memo } from 'react';
import { Bot, User } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { motion } from 'framer-motion';

interface MessageProps {
  role: 'assistant' | 'user';
  content: string;
}

const Message = memo(({ role, content }: MessageProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className={`flex ${role === 'assistant' ? 'justify-start' : 'justify-end'} mb-4`}
    >
      <div
        className={`flex gap-2 max-w-[90%] sm:max-w-[85%] ${
          role === 'assistant'
            ? 'bg-gradient-to-br from-white to-blue-50 shadow-md'
            : 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white'
        } p-3 sm:p-4 rounded-lg ${
          role === 'assistant' ? 'rounded-tl-none' : 'rounded-tr-none'
        }`}
      >
        {role === 'assistant' && (
          <Bot className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 mt-1" />
        )}
        <div className="text-sm sm:text-base prose prose-sm max-w-none">
          <ReactMarkdown>{content}</ReactMarkdown>
        </div>
        {role === 'user' && (
          <User className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 mt-1" />
        )}
      </div>
    </motion.div>
  );
});

Message.displayName = 'Message';

export default Message;
