import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import RootRouter from './routes/RootRouter';

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RootRouter />
    </QueryClientProvider>
  );
}
