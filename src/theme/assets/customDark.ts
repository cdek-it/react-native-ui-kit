import type { customLight } from './customLight'

/**
 * Объект для указания кастомных токенов для темной темы
 */
export const customDark: typeof customLight = {
  surfaceSectionOverSurfaceGround: '#2A2930',
  inputSwitch: {
    inputSwitchSliderOffDisabledBg: '#535259',
    inputSwitchSliderOnDisabledBg: '#75737A',
  },
  rating: {
    ratingStarIconOnDisabledColor: '#7B7B82',
    ratingStarIconOffDisabledColor: '#89888B',
    ratingCancelIconDisabledColor: '#89888B',
  },
}
