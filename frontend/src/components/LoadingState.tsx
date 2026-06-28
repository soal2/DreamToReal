import { motion } from 'framer-motion';

export function LoadingState({ text }: { text: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-[8px] border border-[var(--border)] bg-[var(--surface-strong)] p-6 text-center">
      <motion.div
        className="h-10 w-10 rounded-full border-4 border-[var(--surface-muted)] border-t-[var(--accent)]"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      />
      <p className="mt-4 text-sm font-medium text-[var(--text)]">{text}</p>
    </div>
  );
}
