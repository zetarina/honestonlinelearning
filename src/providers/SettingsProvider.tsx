"use client";
import { SettingsInterface, SETTINGS_KEYS } from "@/config/settingKeys";
import {
  DESIGN_SCHEMA_SETTINGS_KEYS,
  defaultColorSchema,
  generateColors,
} from "@/config/settings/DESIGN_SCHEMA_KEYS";
import { SettingsContext, XColorType } from "@/contexts/SettingsContext";
import { lighten } from "polished";
import { ReactNode, useMemo } from "react";

export const SettingsProvider: React.FC<{
  settings: Partial<SettingsInterface>;
  children: ReactNode;
}> = ({ settings, children }) => {
  const siteSettings = settings?.[SETTINGS_KEYS.SITE_SETTINGS] as
    | SettingsInterface[typeof SETTINGS_KEYS.SITE_SETTINGS]
    | undefined;

  const isSetupRequired =
    !siteSettings?.siteName?.trim() || !siteSettings?.siteUrl?.trim();
  const colors = useMemo(() => {
    const colorSchema =
      settings[DESIGN_SCHEMA_SETTINGS_KEYS.COLOR_SCHEMA] || defaultColorSchema;
    return generateColors(colorSchema);
  }, [settings]);
  const xcolor: XColorType = useMemo(
    () => ({
      interface: {
        background: {
          default: colors.uiBackground.default,
          hovered: colors.uiBackground.hovered,
          selected: colors.uiBackground.active,
        },
        darkBackground: {
          default: colors.uiDarkBackground.default,
          hovered: colors.uiDarkBackground.hovered,
          selected: colors.uiDarkBackground.active,
        },
        text: {
          default: colors.uiText.default,
          hovered: colors.uiText.hovered,
          selected: colors.uiText.selected,
        },
        trigger: {
          background: {
            default: colors.uiBackground.default,
            hovered: colors.uiBackground.hovered,
            selected: colors.uiBackground.active,
          },
          text: {
            default: colors.uiText.default,
            hovered: colors.uiText.hovered,
            selected: colors.uiText.selected,
          },
        },
        colorSplit: colors.border.split,
        backgroundMask: colors.uiBackground.mask,
      },
      primary: {
        default: colors.primary.default,
        hover: colors.primary.hover,
        active: colors.primary.active,
        selected: colors.primary.selected,
      },
      secondary: {
        default: colors.secondary.default,
        hover: colors.secondary.hover,
        active: colors.secondary.active,
      },
      body: {
        background: colors.background.default,
        text: colors.text.default,
      },
      container: {
        background: {
          default: colors.card.default,
          hovered: colors.card.hovered,
          selected: colors.card.active,
        },
        text: {
          default: colors.text.default,
          hovered: colors.text.hovered,
          selected: colors.text.selected,
          muted: colors.text.muted,
        },
        border: {
          default: colors.border.default,
          secondary: colors.border.split,
          hovered: colors.border.hover,
          selected: colors.border.active,
        },
        trigger: {
          background: {
            default: colors.uiBackground.default,
            hovered: colors.uiBackground.hovered,
            selected: colors.uiBackground.active,
          },
          text: {
            default: colors.text.default,
            hovered: colors.text.hovered,
            selected: colors.text.selected,
          },
        },
        colorSplit: colors.border.split,
        backgroundMask: colors.uiBackground.mask,
      },
      table: {
        row: {
          default: colors.card.active,
          selected: colors.card.selected,
          hovered: colors.card.hovered,
          expanded: colors.card.active,
          selectedHover: colors.card.active,
        },
        text: {
          default: colors.text.default,
          hovered: colors.text.hovered,
          selected: colors.text.selected,
          description: colors.text.muted,
          disabled: colors.text.disabled,
          heading: colors.text.heading,
        },
        section: {
          background: colors.uiBackground.default,
          color: colors.uiText.default,
          hover: colors.uiBackground.hovered,
          active: colors.uiBackground.active,
          split: colors.border.split,
        },
        scrollbar: {
          stickyBg: colors.uiBackground.mask,
        },
      },
      input: {
        info: {
          base: colors.status.info.base,
          text: colors.status.info.text,
          background: colors.status.info.background,
          hoverBackground: lighten(0.1, colors.status.info.background),
          borderHover: colors.status.info.border,
        },
        success: {
          base: colors.status.success.base,
          text: colors.status.success.text,
          background: colors.status.success.background,
          hoverBackground: lighten(0.1, colors.status.success.background),
          borderHover: colors.status.success.border,
        },
        warning: {
          base: colors.status.warning.base,
          text: colors.status.warning.text,
          background: colors.status.warning.background,
          hoverBackground: lighten(0.1, colors.status.warning.background),
          borderHover: colors.status.warning.border,
        },
        error: {
          base: colors.status.error.base,
          text: colors.status.error.text,
          background: colors.status.error.background,
          hoverBackground: lighten(0.1, colors.status.error.background),
          borderHover: colors.status.error.border,
        },
        primary: {
          hover: colors.primary.hover,
          active: colors.primary.active,
        },
        text: {
          default: colors.text.default,
          placeholder: colors.text.placeholder,
          disabled: colors.text.disabled,
          description: colors.text.muted,
          hovered: colors.text.hovered,
        },
        fill: {
          tertiary: colors.card.disabled,
          secondary: colors.card.border,
        },
        addon: {
          background: colors.card.hovered,
        },
        hover: {
          background: colors.card.hovered,
          borderColor: colors.border.hover,
        },
        active: {
          background: colors.card.active,
          borderColor: colors.border.active,
        },
        multiple: {
          item: {
            background: colors.card.hovered,
            border: "transparent",
            borderDisabled: "transparent",
            colorDisabled: colors.text.disabled,
          },
          selector: {
            backgroundDisabled: colors.uiBackground.disabled,
          },
        },
        option: {
          activeBackground: colors.uiBackground.hovered,
          selectedBackground: colors.primary.hover,
          selectedColor: colors.text.default,
        },
      },
    }),
    [colors]
  );
  return (
    <SettingsContext.Provider
      value={{ settings, colors, xcolor, isSetupRequired }}
    >
      {children}
    </SettingsContext.Provider>
  );
};
