/**
 * Visual regression test for Search component
 *
 * This file can be used with tools like Storybook or Playwright
 * to ensure the component renders correctly across different states.
 */

import type { Meta, StoryObj } from '@storybook/react';
import Search from './Search';

const meta: Meta<typeof Search> = {
  title: 'Components/Search',
  component: Search,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Search>;

/**
 * Default state - HS Code mode
 */
export const Default: Story = {
  args: {},
};

/**
 * With localStorage preset to Product mode
 */
export const ProductMode: Story = {
  args: {},
  beforeEach: () => {
    localStorage.setItem('jadwa_search_mode', 'product');
  },
};

/**
 * With localStorage preset to Category mode
 */
export const CategoryMode: Story = {
  args: {},
  beforeEach: () => {
    localStorage.setItem('jadwa_search_mode', 'category');
  },
};

/**
 * With localStorage preset to Country mode
 */
export const CountryMode: Story = {
  args: {},
  beforeEach: () => {
    localStorage.setItem('jadwa_search_mode', 'country');
  },
};

/**
 * Interactive example showing all modes
 */
export const Interactive: Story = {
  args: {},
  play: async () => {
    // Could add interaction tests here
    // e.g., click mode buttons, type in input, etc.
  },
};

/**
 * Mobile view
 */
export const Mobile: Story = {
  args: {},
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};

/**
 * Tablet view
 */
export const Tablet: Story = {
  args: {},
  parameters: {
    viewport: {
      defaultViewport: 'tablet',
    },
  },
};

/**
 * Dark mode (if implemented)
 */
export const DarkMode: Story = {
  args: {},
  parameters: {
    backgrounds: {
      default: 'dark',
    },
  },
  decorators: [
    (Story: React.ComponentType) => (
      <div className="dark">
        <Story />
      </div>
    ),
  ],
};
