"use client";

import { createContext, useContext } from "react";
import { SettingsInterface } from "@/config/settingKeys";
import { generateColors } from "@/config/settings/DESIGN_SCHEMA_KEYS";

interface SettingsContextProps {
  settings: Partial<SettingsInterface>;
  colors: ReturnType<typeof generateColors>;
  xcolor: XColorType;
  isSetupRequired: boolean;
}
export interface XColorType {
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
    info: {
      base: string;
      text: string;
      background: string;
      hoverBackground: string;
      borderHover: string;
    };
    success: {
      base: string;
      text: string;
      background: string;
      hoverBackground: string;
      borderHover: string;
    };
    warning: {
      base: string;
      text: string;
      background: string;
      hoverBackground: string;
      borderHover: string;
    };
    error: {
      base: string;
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
}

export const SettingsContext = createContext<SettingsContextProps | undefined>(
  undefined
);
