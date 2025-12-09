export function formatMessage(content) {
  // Convert markdown-style formatting to HTML
  let formatted = content
    // Bold text
    .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>')
    // Numbered lists
    .replace(/^(\d+)\.\s+(.+)$/gm, '<div class="flex gap-2 my-2"><span class="text-purple-300 font-semibold min-w-[24px]">$1.</span><span>$2</span></div>')
    // Bullet points
    .replace(/^[-•]\s+(.+)$/gm, '<div class="flex gap-2 my-2"><span class="text-purple-300">•</span><span>$1</span></div>')
    // Paragraphs
    .split('\n\n')
    .map(para => para.trim() ? `<div class="mb-3">${para}</div>` : '')
    .join('');
  
  return formatted;
}
