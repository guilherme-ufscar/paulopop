// Layout do grupo público — passthrough (Header/Footer já injetados pelo root layout via PublicShell)
export default function PublicGroupLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
