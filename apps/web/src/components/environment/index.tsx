import EnvironmentProvider from './provider'

function Environment({ children }: { children: React.ReactNode }) {
  return <EnvironmentProvider>{children}</EnvironmentProvider>
}

export default Environment
