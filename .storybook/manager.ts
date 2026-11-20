import { addons } from '@storybook/addons';
import { create } from '@storybook/theming';

// Relative to the Storybook root, so it works in local dev (/) and wherever the build is
// published (/finch/storybook/ on the docs site, /finch/ on the legacy gh-pages deployment).
const basePath = '.';

//switch themes based on user preference
const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;

const brandImageUrl = prefersDarkMode
  ? basePath + '/images/finchBannerSmallDarkmode.png'
  : basePath + '/images/finchBannerSmall.png'; 

const customTheme = create({
  base: prefersDarkMode ? 'dark' : 'light',
  brandTitle: 'Finch UI',
  brandUrl: 'https://github.com/bluesky/finch',
  brandImage: brandImageUrl, 
});

addons.setConfig({
  theme: customTheme,
});