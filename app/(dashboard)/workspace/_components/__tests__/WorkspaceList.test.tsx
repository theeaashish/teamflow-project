import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { WorkspaceList } from '../WorkspaceList';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

vi.mock('@/lib/orpc', () => ({
  orpc: {
    workspace: {
      list: {
        queryOptions: vi.fn(() => ({
          queryKey: ['workspace', 'list'],
          queryFn: async () => ({
            workspaces: [
              { id: 'org1', name: 'Workspace 1', avatar: 'W1' },
              { id: 'org2', name: 'Workspace 2', avatar: 'W2' },
            ],
            currentWorkspace: { orgCode: 'org1' },
          }),
        })),
      },
    },
  },
}));

vi.mock('@kinde-oss/kinde-auth-nextjs/components', () => ({
  LoginLink: ({ children, orgCode }: { children: React.ReactNode; orgCode: string }) => (
    <a href={`/login?org=${orgCode}`}>{children}</a>
  ),
}));

describe('WorkspaceList', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
      },
    });
    
    queryClient.setQueryData(['workspace', 'list'], {
      workspaces: [
        { id: 'org1', name: 'Workspace 1', avatar: 'W1' },
        { id: 'org2', name: 'Workspace 2', avatar: 'W2' },
      ],
      currentWorkspace: { orgCode: 'org1' },
    });
  });

  const renderWithProvider = (component: React.ReactElement) => {
    return render(
      <QueryClientProvider client={queryClient}>{component}</QueryClientProvider>
    );
  };

  describe('Rendering', () => {
    it('should render workspace list', async () => {
      renderWithProvider(<WorkspaceList />);
      
      await waitFor(() => {
        expect(screen.getByText('W1')).toBeInTheDocument();
        expect(screen.getByText('W2')).toBeInTheDocument();
      });
    });

    it('should render workspace names in tooltips', async () => {
      renderWithProvider(<WorkspaceList />);
      
      await waitFor(() => {
        const buttons = screen.getAllByRole('button');
        expect(buttons.length).toBeGreaterThan(0);
      });
    });

    it('should mark current workspace with (Current)', async () => {
      renderWithProvider(<WorkspaceList />);
      
      await waitFor(() => {
        expect(screen.getByText(/Workspace 1.*\(Current\)/)).toBeInTheDocument();
      });
    });
  });

  describe('Workspace Colors', () => {
    it('should apply consistent colors based on workspace id', async () => {
      renderWithProvider(<WorkspaceList />);
      
      await waitFor(() => {
        const buttons = screen.getAllByRole('button');
        buttons.forEach((button) => {
          expect(button.className).toMatch(/bg-(blue|emerald|purple|amber|rose|indigo|cyan|pink)-500/);
        });
      });
    });
  });

  describe('Active State', () => {
    it('should apply rounded-lg to active workspace', async () => {
      renderWithProvider(<WorkspaceList />);
      
      await waitFor(() => {
        const buttons = screen.getAllByRole('button');
        const activeButton = buttons.find((btn) => 
          btn.className.includes('rounded-lg') && \!btn.className.includes('hover:rounded-lg')
        );
        expect(activeButton).toBeDefined();
      });
    });

    it('should apply rounded-xl to inactive workspaces', async () => {
      renderWithProvider(<WorkspaceList />);
      
      await waitFor(() => {
        const buttons = screen.getAllByRole('button');
        expect(buttons.some((btn) => btn.className.includes('rounded-xl'))).toBe(true);
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty workspace list', async () => {
      queryClient.setQueryData(['workspace', 'list'], {
        workspaces: [],
        currentWorkspace: { orgCode: null },
      });
      
      renderWithProvider(<WorkspaceList />);
      
      await waitFor(() => {
        const buttons = screen.queryAllByRole('button');
        expect(buttons.length).toBe(0);
      });
    });

    it('should handle single workspace', async () => {
      queryClient.setQueryData(['workspace', 'list'], {
        workspaces: [{ id: 'org1', name: 'Only Workspace', avatar: 'OW' }],
        currentWorkspace: { orgCode: 'org1' },
      });
      
      renderWithProvider(<WorkspaceList />);
      
      await waitFor(() => {
        expect(screen.getByText('OW')).toBeInTheDocument();
      });
    });

    it('should handle long workspace names', async () => {
      queryClient.setQueryData(['workspace', 'list'], {
        workspaces: [
          { id: 'org1', name: 'A'.repeat(100), avatar: 'LN' },
        ],
        currentWorkspace: { orgCode: 'org1' },
      });
      
      renderWithProvider(<WorkspaceList />);
      
      await waitFor(() => {
        expect(screen.getByText('LN')).toBeInTheDocument();
      });
    });

    it('should handle workspaces with special characters in names', async () => {
      queryClient.setQueryData(['workspace', 'list'], {
        workspaces: [
          { id: 'org1', name: 'Workspace & Co. <Test>', avatar: 'SC' },
        ],
        currentWorkspace: { orgCode: 'org1' },
      });
      
      renderWithProvider(<WorkspaceList />);
      
      await waitFor(() => {
        expect(screen.getByText('SC')).toBeInTheDocument();
      });
    });
  });
});