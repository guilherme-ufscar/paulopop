import { formatDate } from '@/lib/formatters'

interface ChangeRecord {
  id: string
  createdAt: string
  user?: { name: string }
  description: string
}

export function TabHistorico({ activities }: { activities: ChangeRecord[] }) {
  const changes = activities.filter(
    a => a.description.includes('→') || a.description.includes('alterado')
  )

  if (changes.length === 0) {
    return (
      <div className="py-12 text-center text-gray-400 text-sm">
        Nenhuma alteração registrada ainda.
      </div>
    )
  }

  return (
    <div className="py-4 overflow-x-auto">
      <table className="w-full text-sm" aria-label="Histórico de alterações">
        <thead className="bg-gray-50">
          <tr>
            {['Data/Hora', 'Usuário', 'Descrição'].map(h => (
              <th
                key={h}
                className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {changes.map(c => (
            <tr key={c.id} className="hover:bg-gray-50">
              <td className="px-4 py-3 text-gray-400 font-mono text-xs">{formatDate(c.createdAt)}</td>
              <td className="px-4 py-3 text-gray-600">{c.user?.name ?? '—'}</td>
              <td className="px-4 py-3 text-gray-700">{c.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
