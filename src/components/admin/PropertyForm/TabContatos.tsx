import { Badge, leadStatusBadge, leadStatusLabel } from '@/components/ui/Badge'
import { formatDate } from '@/lib/formatters'

interface Lead {
  id: string
  name: string
  email?: string | null
  phone?: string | null
  message?: string | null
  source: string
  status: string
  createdAt: string
}

const sourceLabel: Record<string, string> = {
  SITE: 'Site',
  WHATSAPP: 'WhatsApp',
  PORTAL: 'Portal',
  REFERRAL: 'Indicação',
  MANUAL: 'Manual',
}

export function TabContatos({ leads }: { leads: Lead[] }) {
  if (leads.length === 0) {
    return (
      <div className="py-12 text-center text-gray-400 text-sm">
        Nenhum contato recebido para este imóvel ainda.
      </div>
    )
  }

  return (
    <div className="py-4 overflow-x-auto">
      <table className="w-full text-sm" aria-label="Contatos do imóvel">
        <thead className="bg-gray-50">
          <tr>
            {['Nome', 'E-mail', 'Telefone', 'Mensagem', 'Origem', 'Status', 'Data'].map(h => (
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
          {leads.map(lead => (
            <tr key={lead.id} className="hover:bg-gray-50">
              <td className="px-4 py-3 font-medium text-gray-700">{lead.name}</td>
              <td className="px-4 py-3 text-gray-500 text-xs">{lead.email ?? '—'}</td>
              <td className="px-4 py-3 text-gray-600">{lead.phone ?? '—'}</td>
              <td className="px-4 py-3 text-gray-500 max-w-xs truncate">{lead.message ?? '—'}</td>
              <td className="px-4 py-3 text-gray-500">{sourceLabel[lead.source] ?? lead.source}</td>
              <td className="px-4 py-3">
                <Badge variant={leadStatusBadge[lead.status] ?? 'gray'}>
                  {leadStatusLabel[lead.status] ?? lead.status}
                </Badge>
              </td>
              <td className="px-4 py-3 text-gray-400">{formatDate(lead.createdAt)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
