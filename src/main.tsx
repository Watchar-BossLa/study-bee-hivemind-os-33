
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from './components/theme/ThemeProvider.tsx'

// Create a client
const queryClient = new QueryClient()

createRoot(document.getElementById("root")!).render(
  <ThemeProvider defaultTheme="system">
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </ThemeProvider>
);
