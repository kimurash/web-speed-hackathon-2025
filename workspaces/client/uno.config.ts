import type { IconifyJSON } from '@iconify/types';
import presetWind3 from '@unocss/preset-wind3';
import { defineConfig, presetIcons } from 'unocss';

// eslint-disable-next-line @typescript-eslint/no-unsafe-call
export default defineConfig({
  layers: {
    default: 1,
    icons: 0,
    preflights: 0,
    reset: -1,
  },
  preflights: [
    {
      getCSS: () => /* css */ `
      @view-transition {
        navigation: auto;
      }
      html,
      :host {
        font-family: 'Noto Sans JP', sans-serif !important;
      }
      video {
        max-height: 100%;
        max-width: 100%;
      }
    `,
    },
    {
      getCSS: () => /* css */ `
      @keyframes fade-in {
        from {
          opacity: 0;
        }
        to {
          opacity: 1;
        }
      }
    `,
    },
  ],
  presets: [
    presetWind3(),
    presetIcons({
      collections: {
        bi: () => import('@iconify/json/json/bi.json').then((m): IconifyJSON => m.default as IconifyJSON),
        bx: () => import('@iconify/json/json/bx.json').then((m): IconifyJSON => m.default as IconifyJSON),
        'fa-regular': () =>
          import('@iconify/json/json/fa-regular.json').then((m): IconifyJSON => m.default as IconifyJSON),
        'fa-solid': () => import('@iconify/json/json/fa-solid.json').then((m): IconifyJSON => m.default as IconifyJSON),
        fluent: () => import('@iconify/json/json/fluent.json').then((m): IconifyJSON => m.default as IconifyJSON),
        'line-md': () => import('@iconify/json/json/line-md.json').then((m): IconifyJSON => m.default as IconifyJSON),
        'material-symbols': () =>
          import('@iconify/json/json/material-symbols.json').then((m): IconifyJSON => m.default as IconifyJSON),
      },
    }),
  ],
});
