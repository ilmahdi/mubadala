// /**
//  * Search component tests
//  *
//  * Tests for:
//  * - Mode switching
//  * - URL state management
//  * - Debounced input
//  * - Keyboard shortcuts
//  * - Accessibility
//  * - localStorage persistence
//  */

// import React from 'react';
// import { render, screen, fireEvent } from '@testing-library/react';
// import userEvent from '@testing-library/user-event';
// import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
// import Search from '../Search';

// // Mock nuqs
// vi.mock('nuqs', () => ({
//   useQueryState: vi.fn(() => {
//     const [value, setValue] = React.useState('');
//     return [value, setValue];
//   }),
//   parseAsString: {
//     withDefault: (defaultValue: string) => ({
//       withOptions: () => ({ defaultValue }),
//     }),
//   },
// }));

// // Mock debounce hook
// vi.mock('@/src/hooks/use-debounced-callback', () => ({
//   useDebouncedCallback: <T extends (...args: unknown[]) => unknown>(fn: T) =>
//     fn,
// }));

// describe('Search Component', () => {
//   beforeEach(() => {
//     // Clear localStorage before each test
//     localStorage.clear();
//     vi.clearAllMocks();
//   });

//   afterEach(() => {
//     vi.restoreAllMocks();
//   });

//   describe('Rendering', () => {
//     it('should render with default HS Code mode', () => {
//       render(<Search />);

//       expect(screen.getByRole('search')).toBeInTheDocument();
//       expect(
//         screen.getByLabelText(/HS Code search input/i),
//       ).toBeInTheDocument();
//       expect(
//         screen.getByPlaceholderText(/Search by HS Code/i),
//       ).toBeInTheDocument();
//     });

//     it('should render all search mode buttons', () => {
//       render(<Search />);

//       expect(
//         screen.getByRole('button', { name: /Search by HS Code/i }),
//       ).toBeInTheDocument();
//       expect(
//         screen.getByRole('button', { name: /Search by Product/i }),
//       ).toBeInTheDocument();
//       expect(
//         screen.getByRole('button', { name: /Search by Category/i }),
//       ).toBeInTheDocument();
//       expect(
//         screen.getByRole('button', { name: /Search by Country/i }),
//       ).toBeInTheDocument();
//     });

//     it('should mark active mode button with aria-pressed', () => {
//       render(<Search />);

//       const hsCodeButton = screen.getByRole('button', {
//         name: /Search by HS Code/i,
//       });
//       expect(hsCodeButton).toHaveAttribute('aria-pressed', 'true');
//     });
//   });

//   describe('Mode Switching', () => {
//     it('should switch to Product mode when clicked', async () => {
//       const user = userEvent.setup();
//       render(<Search />);

//       const productButton = screen.getByRole('button', {
//         name: /Search by Product/i,
//       });
//       await user.click(productButton);

//       expect(
//         screen.getByPlaceholderText(/Search by product name/i),
//       ).toBeInTheDocument();
//       expect(productButton).toHaveAttribute('aria-pressed', 'true');
//     });

//     it('should clear search text when mode changes', async () => {
//       const user = userEvent.setup();
//       render(<Search />);

//       const input = screen.getByRole('textbox');
//       await user.type(input, '123456');

//       const productButton = screen.getByRole('button', {
//         name: /Search by Product/i,
//       });
//       await user.click(productButton);

//       expect(input).toHaveValue('');
//     });

//     it('should persist mode to localStorage', async () => {
//       const user = userEvent.setup();
//       render(<Search />);

//       const productButton = screen.getByRole('button', {
//         name: /Search by Product/i,
//       });
//       await user.click(productButton);

//       expect(localStorage.getItem('jadwa_search_mode')).toBe('product');
//     });
//   });

//   describe('Search Input', () => {
//     it('should update search text on input', async () => {
//       const user = userEvent.setup();
//       render(<Search />);

//       const input = screen.getByRole('textbox');
//       await user.type(input, '123456');

//       expect(input).toHaveValue('123456');
//     });

//     it('should show clear button when text is entered', async () => {
//       const user = userEvent.setup();
//       render(<Search />);

//       const input = screen.getByRole('textbox');
//       await user.type(input, 'test');

//       expect(
//         screen.getByRole('button', { name: /Clear search/i }),
//       ).toBeInTheDocument();
//     });

//     it('should clear text when clear button is clicked', async () => {
//       const user = userEvent.setup();
//       render(<Search />);

//       const input = screen.getByRole('textbox');
//       await user.type(input, 'test');

//       const clearButton = screen.getByRole('button', { name: /Clear search/i });
//       await user.click(clearButton);

//       expect(input).toHaveValue('');
//     });

//     it('should show character count when below minimum', async () => {
//       const user = userEvent.setup();
//       render(<Search />);

//       const input = screen.getByRole('textbox');
//       await user.type(input, '1'); // HS Code requires 2 chars

//       expect(screen.getByText(/1 more char/i)).toBeInTheDocument();
//     });
//   });

//   describe('Keyboard Shortcuts', () => {
//     it('should clear input on Escape key', async () => {
//       const user = userEvent.setup();
//       render(<Search />);

//       const input = screen.getByRole('textbox');
//       await user.type(input, 'test');
//       await user.keyboard('{Escape}');

//       expect(input).toHaveValue('');
//     });

//     it('should focus input on Ctrl+K', () => {
//       render(<Search />);

//       const input = screen.getByRole('textbox');
//       fireEvent.keyDown(window, { key: 'k', ctrlKey: true });

//       expect(input).toHaveFocus();
//     });

//     it('should focus input on Cmd+K (Mac)', () => {
//       render(<Search />);

//       const input = screen.getByRole('textbox');
//       fireEvent.keyDown(window, { key: 'k', metaKey: true });

//       expect(input).toHaveFocus();
//     });
//   });

//   describe('Accessibility', () => {
//     it('should have proper ARIA labels', () => {
//       render(<Search />);

//       expect(screen.getByRole('search')).toHaveAttribute(
//         'aria-label',
//         'Trade data search',
//       );
//       expect(screen.getByRole('textbox')).toHaveAttribute('aria-label');
//       expect(screen.getByRole('textbox')).toHaveAttribute(
//         'aria-describedby',
//         'search-hint',
//       );
//     });

//     it('should have focus indicators', async () => {
//       const user = userEvent.setup();
//       render(<Search />);

//       await user.tab();

//       // First tab should focus first mode button
//       expect(
//         screen.getByRole('button', { name: /Search by HS Code/i }),
//       ).toHaveFocus();
//     });

//     it('should have screen reader hint', () => {
//       render(<Search />);

//       expect(
//         screen.getByText(/Minimum .* characters required/i),
//       ).toBeInTheDocument();
//     });
//   });

//   describe('localStorage Integration', () => {
//     it('should load saved mode from localStorage', () => {
//       localStorage.setItem('jadwa_search_mode', 'country');

//       render(<Search />);

//       expect(
//         screen.getByPlaceholderText(/Search by country name/i),
//       ).toBeInTheDocument();
//     });

//     it('should handle invalid localStorage value gracefully', () => {
//       localStorage.setItem('jadwa_search_mode', 'invalid');

//       render(<Search />);

//       // Should fallback to default (HS Code)
//       expect(
//         screen.getByPlaceholderText(/Search by HS Code/i),
//       ).toBeInTheDocument();
//     });

//     it('should handle localStorage errors gracefully', () => {
//       // Mock localStorage to throw error
//       const originalSetItem = localStorage.setItem;
//       localStorage.setItem = vi.fn(() => {
//         throw new Error('Storage full');
//       });

//       const consoleSpy = vi.spyOn(console, 'warn').mockImplementation();

//       render(<Search />);

//       // Component should still render
//       expect(screen.getByRole('search')).toBeInTheDocument();

//       localStorage.setItem = originalSetItem;
//       consoleSpy.mockRestore();
//     });
//   });
// });
