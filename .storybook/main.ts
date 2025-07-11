import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  "stories": ["../src/**/__docs__/*.stories.tsx", "../src/**/__docs__/*.mdx"],
  "addons": [],
  "framework": {
    "name": "@storybook/react-vite",
    "options": {}
  }
};
export default config;