"use client";
import { SettingsInterface, SETTINGS_KEYS } from "@/config/settingKeys";
import {
  DESIGN_SCHEMA_SETTINGS_KEYS,
  defaultColorSchema,
  generateColors,
} from "@/config/settings/DESIGN_SCHEMA_KEYS";
import { SettingsContext, XColorType } from "@/contexts/SettingsContext";
import { lighten } from "polished";
import { ReactNode, useEffect, useMemo } from "react";

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

  useEffect(() => {
    // Set CSS variables for dynamic theming
    document.documentElement.style.setProperty(
      "--editor-bg",
      xcolor.input.active.background
    );
    document.documentElement.style.setProperty(
      "--editor-text",
      xcolor.input.text.default
    );
    document.documentElement.style.setProperty(
      "--editor-placeholder",
      xcolor.input.text.placeholder
    );

    document.documentElement.style.setProperty(
      "--toolbar-bg",
      xcolor.input.addon.background
    );
    document.documentElement.style.setProperty(
      "--toolbar-border",
      xcolor.input.addon.background
    );
    document.documentElement.style.setProperty(
      "--toolbar-text",
      xcolor.input.text.default
    );

    document.documentElement.style.setProperty(
      "--picker-bg",
      xcolor.input.option.selectedBackground
    );
    document.documentElement.style.setProperty(
      "--picker-text",
      xcolor.input.option.selectedColor
    );
    document.documentElement.style.setProperty(
      "--picker-hover-bg",
      xcolor.input.option.activeBackground
    );

    document.documentElement.style.setProperty(
      "--hover-bg",
      xcolor.input.hover.background
    );
    document.documentElement.style.setProperty(
      "--hover-border",
      xcolor.input.hover.borderColor
    );
    document.documentElement.style.setProperty(
      "--hover-text",
      xcolor.input.text.hovered
    );

    document.documentElement.style.setProperty(
      "--selected-bg",
      xcolor.input.active.background
    );
    document.documentElement.style.setProperty(
      "--selected-border",
      xcolor.input.active.borderColor
    );
    document.documentElement.style.setProperty(
      "--selected-text",
      xcolor.input.text.default
    );

    document.documentElement.style.setProperty(
      "--error-bg",
      xcolor.input.error.background
    );
    document.documentElement.style.setProperty(
      "--error-text",
      xcolor.input.error.text
    );
    document.documentElement.style.setProperty(
      "--error-border",
      xcolor.input.error.borderHover
    );

    document.documentElement.style.setProperty(
      "--success-bg",
      xcolor.input.success.background
    );
    document.documentElement.style.setProperty(
      "--success-text",
      xcolor.input.success.text
    );
    document.documentElement.style.setProperty(
      "--success-border",
      xcolor.input.success.borderHover
    );

    document.documentElement.style.setProperty(
      "--warning-bg",
      xcolor.input.warning.background
    );
    document.documentElement.style.setProperty(
      "--warning-text",
      xcolor.input.warning.text
    );
    document.documentElement.style.setProperty(
      "--warning-border",
      xcolor.input.warning.borderHover
    );

    document.documentElement.style.setProperty(
      "--info-bg",
      xcolor.input.info.background
    );
    document.documentElement.style.setProperty(
      "--info-text",
      xcolor.input.info.text
    );
    document.documentElement.style.setProperty(
      "--info-border",
      xcolor.input.info.borderHover
    );
  }, [xcolor]);

  return (
    <SettingsContext.Provider
      value={{ settings, colors, xcolor, isSetupRequired }}
    >
      {children}
    </SettingsContext.Provider>
  );
};
