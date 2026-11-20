import type { StorybookConfig } from "@storybook/react-vite";
import { mergeConfig } from "vite";
import tailwindcss from 'tailwindcss';
import pkg from "../package.json";

const config: StorybookConfig = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: [
    "@storybook/addon-essentials",
    "@chromatic-com/storybook",
    "@storybook/addon-interactions",
  ],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  env: (config) => ({
    ...config,
    STORYBOOK_FINCH_VERSION: pkg.version,
  }),
  staticDirs: ['../public'],
  typescript: {
    // The default (react-docgen) can't resolve mapped types like
    // `Omit<OtherProps, 'device'> & { pv: string }`, so components that build
    // their props that way only showed their inline-declared props in autodocs.
    reactDocgen: 'react-docgen-typescript',
    reactDocgenTypescriptOptions: {
      shouldExtractLiteralValuesFromEnum: true,
      shouldRemoveUndefinedFromOptional: true,
      propFilter: (prop) => !prop.parent?.fileName.includes('node_modules'),
    },
  },
  async viteFinal(config, { configType }) {
    // Production builds are published under /finch/storybook/ in the combined docs site
    // (see scripts/build-site.mjs). STORYBOOK_BASE overrides it, e.g. '/finch/' for the
    // legacy gh-pages deployment that serves Storybook at the site root.
    const productionBase = process.env.STORYBOOK_BASE || '/finch/storybook/';
    return mergeConfig(config, {
      base: configType === 'PRODUCTION' ? productionBase : '/',
      css: {
        postcss: {
          plugins: [tailwindcss()],
        },
      },
    });
  },
};
export default config;
