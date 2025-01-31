"use client";

import React, { createContext, useContext, ReactNode, useMemo } from "react";
import { SETTINGS_KEYS, SettingsInterface } from "@/config/settingKeys";
import {
  defaultColorSchema,
  DESIGN_SCHEMA_SETTINGS_KEYS,
  generateColors,
} from "@/config/settings/DESIGN_SCHEMA_KEYS";
import { lighten } from "polished";

interface SettingsContextProps {
  settings: Partial<SettingsInterface>;
  colors: ReturnType<typeof generateColors>;
  xcolor: XColorType;
  isSetupRequired: boolean;
}

const SettingsContext = createContext<SettingsContextProps | undefined>(
  undefined
);
type XColorType = {
  interface: {
    background: {
      default: string;
      hovered: string;
      selected: string;
    };
    darkBackground: {
      default: string;
      hovered: string;
      selected: string;
    };
    text: {
      default: string;
      hovered: string;
      selected: string;
    };
    trigger: {
      background: {
        default: string;
        hovered: string;
        selected: string;
      };
      text: {
        default: string;
        hovered: string;
        selected: string;
      };
    };
    colorSplit: string;
    backgroundMask: string;
  };
  primary: {
    default: string;
    hover: string;
    active: string;
    selected: string;
  };
  secondary: {
    default: string;
    hover: string;
    active: string;
  };
  body: {
    background: string;
    text: string;
  };
  container: {
    background: {
      default: string;
      hovered: string;
      selected: string;
    };
    text: {
      default: string;
      hovered: string;
      selected: string;
      muted: string;
    };
    border: {
      default: string;
      secondary: string;
      hovered: string;
      selected: string;
    };
    trigger: {
      background: {
        default: string;
        hovered: string;
        selected: string;
      };
      text: {
        default: string;
        hovered: string;
        selected: string;
      };
    };
    colorSplit: string;
    backgroundMask: string;
  };
  table: {
    row: {
      default: string;
      selected: string;
      hovered: string;
      expanded: string;
      selectedHover: string;
    };
    text: {
      default: string;
      hovered: string;
      selected: string;
      description: string;
      disabled: string;
      heading: string;
    };
    section: {
      background: string;
      color: string;
      hover: string;
      active: string;
      split: string;
    };
    scrollbar: {
      stickyBg: string;
    };
  };
  input: {
    warning: {
      text: string;
      background: string;
      hoverBackground: string;
      borderHover: string;
    };
    error: {
      text: string;
      background: string;
      hoverBackground: string;
      borderHover: string;
    };
    primary: {
      hover: string;
      active: string;
    };
    text: {
      default: string;
      placeholder: string;
      disabled: string;
      description: string;
      hovered: string;
    };
    fill: {
      tertiary: string;
      secondary: string;
    };
    addon: {
      background: string;
    };
    hover: {
      background: string;
      borderColor: string;
    };
    active: {
      background: string;
      borderColor: string;
    };
    multiple: {
      item: {
        background: string;
        border: string;
        borderDisabled: string;
        colorDisabled: string;
      };
      selector: {
        backgroundDisabled: string;
      };
    };
    option: {
      activeBackground: string;
      selectedBackground: string;
      selectedColor: string;
    };
  };
};

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
          selectedHover:colors.card.active,
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
          color: colors.text.default,
          hover: colors.uiBackground.hovered,
          active: colors.uiBackground.active,
          split: colors.border.split,
        },
        scrollbar: {
          stickyBg: colors.uiBackground.mask,
        },
      },
      input: {
        warning: {
          text: colors.status.warning.text,
          background: colors.status.warning.background,
          hoverBackground: lighten(0.1, colors.status.warning.background),
          borderHover: colors.status.warning.border,
        },
        error: {
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

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
};
