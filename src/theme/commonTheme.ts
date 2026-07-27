/**
 * commonTheme — scheme-инвариантные неймспейсы темы (метрики + палитры),
 * привязанные к единой базе токенов (tokens.resolved.{light,dark}.json).
 *
 * Метрики (spacing/border.Radius+Width/sizing/typography.Size) взяты из resolved
 * (semantic.dimension / primitive.fonts) — старая шкала 3.5·N заменена на
 * resolved-шкалу (spacing/sizing — по ближайшему значению, typography.Size — по
 * индексу). Цветовые под-неймспейсы (typography.Color / border.Color / global /
 * background) — scheme-инвариантны, сохранены как есть.
 *
 * Только используемые ключи; legacy-JSON примитивов удалены.
 */
export const commonTheme = {
  spacing: {
    Gap: { 'gap-0': 0, 'gap-1': 4, 'gap-2': 8, 'gap-3': 10, 'gap-4': 14 },
    Padding: {
      'p-0': 0,
      'p-1': 4,
      'p-2': 8,
      'p-3': 10,
      'p-4': 14,
      'p-5': 18,
      'p-6': 20,
      'p-7': 24,
    },
  },
  sizing: {
    Height: { 'h-1': 14, 'h-2': 28, 'h-3': 40 },
    Width: { 'w-1': 14, 'w-2': 28, 'w-3': 40 },
  },
  border: {
    Radius: { 'rounded-lg': 8, 'rounded-xl': 10, 'rounded-full': 1600 },
    Width: { border: 1, 'border-2': 2, 'border-3': 4 },
    Color: {
      Service: {
        'border-success': {
          50: '#fafffb',
          100: '#f0fff3',
          200: '#d4fedc',
          300: '#aafbb7',
          400: '#77f48a',
          500: '#44e858',
          600: '#1dc831',
          700: '#168322',
          800: '#12611b',
          900: '#0e4514',
          1000: '#0c3b11',
        },
      },
    },
  },
  typography: {
    Size: {
      'text-xs': 12,
      'text-sm': 14,
      'text-base': 16,
      'text-lg': 18,
      'text-xl': 20,
      'text-2xl': 24,
      'text-3xl': 30,
      'text-4xl': 36,
      'text-5xl': 48,
    },
    Color: {
      Common: {
        'text-primary': '#1dc831',
        'text-color-primary': '#000000',
        'text-color': '#181a1f',
        'text-color-secondary': '#85888e',
        'text-white': '#ffffff',
      },
      Surface: {
        'text-surface-0': '#181a1f',
        'text-surface-50': '#fafafa',
        'text-surface-100': '#f0f0f1',
        'text-surface-200': '#e2e2e4',
        'text-surface-300': '#cecfd2',
        'text-surface-400': '#a2a5a9',
        'text-surface-500': '#85888e',
        'text-surface-600': '#6d7076',
        'text-surface-700': '#56595f',
        'text-surface-800': '#404348',
        'text-surface-900': '#2b2e33',
      },
      Service: {
        'text-help': '#9457ea',
        'text-info': '#1e76cd',
        'text-success': '#168322',
        'text-warning': '#dc9710',
        'text-danger': '#db3424',
      },
    },
  },
  global: {
    Neutrals: {
      White: {
        'white-100': '#ffffff',
        'white-90': 'rgba(255, 255, 255, 0.9000)',
        'white-80': 'rgba(255, 255, 255, 0.8000)',
        'white-70': 'rgba(255, 255, 255, 0.7000)',
        'white-60': 'rgba(255, 255, 255, 0.6000)',
        'white-50': 'rgba(255, 255, 255, 0.5000)',
        'white-40': 'rgba(255, 255, 255, 0.4000)',
        'white-30': 'rgba(255, 255, 255, 0.3000)',
        'white-20': 'rgba(255, 255, 255, 0.2000)',
        'white-10': 'rgba(255, 255, 255, 0.1000)',
      },
    },
  },
  background: {
    Common: {
      'bg-surface-ground': '#f0f0f1',
      'bg-surface-overlay': 'rgba(0, 0, 0, 0.8000)',
      'bg-surface-section': '#ffffff',
      'bg-surface-ground-hover': '#e2e2e4',
      'bg-surface-section-hover': '#fafafa',
      'bg-surface-card-on-ground': '#ffffff',
      'bg-surface-card-on-ground-hover': '#fafafa',
      'bg-surface-card-on-section': '#f0f0f1',
      'bg-surface-card-on-section-hover': '#e2e2e4',
    },
  },
}
