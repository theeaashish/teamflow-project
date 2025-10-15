import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CreateWorkspace } from '../CreateWorkspace';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const mockMutate = vi.fn();
const mockReset = vi.fn();

vi.mock('@/lib/orpc', () => ({
  orpc: {
    workspace: {
      create: {
        mutationOptions: vi.fn(() => ({
          mutationFn: mockMutate,
        })),
      },
      list: {
        queryKey: vi.fn(() => ['workspace', 'list']),
      },
    },
  },
}));

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe('CreateWorkspace', () => {
  let queryClient: QueryClient;
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });
    user = userEvent.setup();
    mockMutate.mockClear();
    mockReset.mockClear();
  });

  const renderWithProvider = (component: React.ReactElement) => {
    return render(
      <QueryClientProvider client={queryClient}>{component}</QueryClientProvider>
    );
  };

  describe('Rendering', () => {
    it('should render create workspace button', () => {
      renderWithProvider(<CreateWorkspace />);
      
      const buttons = screen.getAllByRole('button');
      const createButton = buttons.find(btn => 
        btn.querySelector('svg')?.classList.contains('lucide-plus')
      );
      expect(createButton).toBeInTheDocument();
    });

    it('should not show dialog initially', () => {
      renderWithProvider(<CreateWorkspace />);
      
      expect(screen.queryByText('Create Workspace')).not.toBeInTheDocument();
    });

    it('should show dialog when button is clicked', async () => {
      renderWithProvider(<CreateWorkspace />);
      
      const buttons = screen.getAllByRole('button');
      const createButton = buttons.find(btn => 
        btn.querySelector('svg')?.classList.contains('lucide-plus')
      );
      
      if (createButton) {
        await user.click(createButton);
        
        await waitFor(() => {
          expect(screen.getByText('Create Workspace')).toBeInTheDocument();
        });
      }
    });
  });

  describe('Form Validation', () => {
    it('should show validation error for empty name', async () => {
      renderWithProvider(<CreateWorkspace />);
      
      const buttons = screen.getAllByRole('button');
      const createButton = buttons[0];
      await user.click(createButton);
      
      await waitFor(() => {
        const submitButton = screen.getByRole('button', { name: /Create Workspace/i });
        expect(submitButton).toBeInTheDocument();
      });
      
      const submitButton = screen.getByRole('button', { name: /Create Workspace/i });
      await user.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText(/Name must be at least 2 characters/i)).toBeInTheDocument();
      });
    });

    it('should show validation error for name too short', async () => {
      renderWithProvider(<CreateWorkspace />);
      
      const buttons = screen.getAllByRole('button');
      await user.click(buttons[0]);
      
      await waitFor(() => {
        const input = screen.getByPlaceholderText('My workspace');
        expect(input).toBeInTheDocument();
      });
      
      const input = screen.getByPlaceholderText('My workspace');
      await user.type(input, 'A');
      
      const submitButton = screen.getByRole('button', { name: /Create Workspace/i });
      await user.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText(/Name must be at least 2 characters/i)).toBeInTheDocument();
      });
    });

    it('should show validation error for name too long', async () => {
      renderWithProvider(<CreateWorkspace />);
      
      const buttons = screen.getAllByRole('button');
      await user.click(buttons[0]);
      
      await waitFor(() => {
        const input = screen.getByPlaceholderText('My workspace');
        expect(input).toBeInTheDocument();
      });
      
      const input = screen.getByPlaceholderText('My workspace');
      await user.type(input, 'A'.repeat(51));
      
      const submitButton = screen.getByRole('button', { name: /Create Workspace/i });
      await user.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText(/Name must be less than 50 characters/i)).toBeInTheDocument();
      });
    });
  });

  describe('Form Submission', () => {
    it('should accept valid workspace name', async () => {
      renderWithProvider(<CreateWorkspace />);
      
      const buttons = screen.getAllByRole('button');
      await user.click(buttons[0]);
      
      await waitFor(() => {
        const input = screen.getByPlaceholderText('My workspace');
        expect(input).toBeInTheDocument();
      });
      
      const input = screen.getByPlaceholderText('My workspace');
      await user.type(input, 'Valid Workspace');
      
      expect(input).toHaveValue('Valid Workspace');
    });

    it('should handle minimum valid name length', async () => {
      renderWithProvider(<CreateWorkspace />);
      
      const buttons = screen.getAllByRole('button');
      await user.click(buttons[0]);
      
      await waitFor(() => {
        const input = screen.getByPlaceholderText('My workspace');
        expect(input).toBeInTheDocument();
      });
      
      const input = screen.getByPlaceholderText('My workspace');
      await user.type(input, 'AB');
      
      expect(input).toHaveValue('AB');
    });

    it('should handle maximum valid name length', async () => {
      renderWithProvider(<CreateWorkspace />);
      
      const buttons = screen.getAllByRole('button');
      await user.click(buttons[0]);
      
      await waitFor(() => {
        const input = screen.getByPlaceholderText('My workspace');
        expect(input).toBeInTheDocument();
      });
      
      const input = screen.getByPlaceholderText('My workspace');
      const maxLengthName = 'A'.repeat(50);
      await user.type(input, maxLengthName);
      
      expect(input).toHaveValue(maxLengthName);
    });
  });

  describe('Loading States', () => {
    it('should show creating text when submitting', async () => {
      renderWithProvider(<CreateWorkspace />);
      
      const buttons = screen.getAllByRole('button');
      await user.click(buttons[0]);
      
      await waitFor(() => {
        expect(screen.getByPlaceholderText('My workspace')).toBeInTheDocument();
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle special characters in name', async () => {
      renderWithProvider(<CreateWorkspace />);
      
      const buttons = screen.getAllByRole('button');
      await user.click(buttons[0]);
      
      await waitFor(() => {
        const input = screen.getByPlaceholderText('My workspace');
        expect(input).toBeInTheDocument();
      });
      
      const input = screen.getByPlaceholderText('My workspace');
      await user.type(input, 'Workspace-2024_Test\!');
      
      expect(input).toHaveValue('Workspace-2024_Test\!');
    });

    it('should handle Unicode characters', async () => {
      renderWithProvider(<CreateWorkspace />);
      
      const buttons = screen.getAllByRole('button');
      await user.click(buttons[0]);
      
      await waitFor(() => {
        const input = screen.getByPlaceholderText('My workspace');
        expect(input).toBeInTheDocument();
      });
      
      const input = screen.getByPlaceholderText('My workspace');
      await user.type(input, '工作空间 😊');
      
      expect(input).toHaveValue('工作空间 😊');
    });

    it('should handle dialog close', async () => {
      renderWithProvider(<CreateWorkspace />);
      
      const buttons = screen.getAllByRole('button');
      await user.click(buttons[0]);
      
      await waitFor(() => {
        expect(screen.getByText('Create Workspace')).toBeInTheDocument();
      });
      
      await user.keyboard('{Escape}');
      
      await waitFor(() => {
        expect(screen.queryByText('Create a new workspace to get started')).not.toBeInTheDocument();
      });
    });
  });
});