'use client'

interface Props {
  content: string
}

// Renderizador de Markdown simples (sem dependência externa)
function markdownToHtml(md: string): string {
  return md
    // Títulos
    .replace(/^### (.+)$/gm, '<h3 class="text-xl font-bold text-[#0D2F5E] mt-8 mb-3">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 class="text-2xl font-bold text-[#0D2F5E] mt-10 mb-4">$1</h2>')
    .replace(/^# (.+)$/gm, '<h1 class="text-3xl font-bold text-[#0D2F5E] mt-10 mb-4">$1</h1>')
    // Negrito e itálico
    .replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold text-gray-900">$1</strong>')
    .replace(/\*(.+?)\*/g, '<em class="italic">$1</em>')
    // Links
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" class="text-[#2E86DE] hover:underline" target="_blank" rel="noopener noreferrer">$1</a>')
    // Listas não ordenadas
    .replace(/^- (.+)$/gm, '<li class="ml-4 list-disc text-gray-700">$1</li>')
    .replace(/(<li[^>]*>[\s\S]*?<\/li>\n?)+/g, '<ul class="my-4 space-y-1 pl-2">$&</ul>')
    // Listas ordenadas
    .replace(/^\d+\. (.+)$/gm, '<li class="ml-4 list-decimal text-gray-700">$1</li>')
    // Citações (blockquote)
    .replace(/^> (.+)$/gm, '<blockquote class="border-l-4 border-[#2E86DE] pl-4 italic text-gray-600 my-4">$1</blockquote>')
    // Código inline
    .replace(/`(.+?)`/g, '<code class="bg-gray-100 px-1.5 py-0.5 rounded text-sm font-mono text-[#0D2F5E]">$1</code>')
    // Linha horizontal
    .replace(/^---$/gm, '<hr class="my-8 border-gray-200" />')
    // Imagens
    .replace(/!\[(.+?)\]\((.+?)\)/g, '<img src="$2" alt="$1" class="w-full rounded-xl my-6 object-cover" />')
    // Parágrafos: linhas que não são tags HTML
    .replace(/^(?!<[a-z]).+$/gm, (line) => line.trim() ? `<p class="text-base leading-7 text-gray-700 my-4">${line}</p>` : '')
    // Limpar linhas em branco duplas
    .replace(/\n{3,}/g, '\n\n')
}

export function BlogContent({ content }: Props) {
  const html = markdownToHtml(content)

  return (
    <div
      className="prose-custom max-w-none"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
