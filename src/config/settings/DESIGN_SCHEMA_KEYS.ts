import { lighten, darken, transparentize } from "polished";
import { FormType, GeneralConfig, NestedFieldType } from ".";

export const DESIGN_SCHEMA_SETTINGS_KEYS = {
  COLOR_SCHEMA: "colorSchema",
} as const;

export const DESIGN_SCHEMA_SETTINGS: GeneralConfig<
  typeof DESIGN_SCHEMA_SETTINGS_KEYS
> = {
  [DESIGN_SCHEMA_SETTINGS_KEYS.COLOR_SCHEMA]: {
    label: "Color Schema",
    type: NestedFieldType.JSON,
    visibility: "public",
    fields: {
      primaryColor: {
        label: "Primary Color",
        guide: "The primary color for your site's theme.",
        formType: FormType.COLOR,
      },
      secondaryColor: {
        label: "Secondary Color",
        guide: "The secondary color for your site's theme.",
        formType: FormType.COLOR,
      },
      backgroundColor: {
        label: "Background Color",
        guide: "The overall background color for the site.",
        formType: FormType.COLOR,
      },
      textColor: {
        label: "Text Color",
        guide: "The default text color for the site.",
        formType: FormType.COLOR,
      },
      buttonColor: {
        label: "Button Color",
        guide: "The background color for buttons.",
        formType: FormType.COLOR,
      },
      linkColor: {
        label: "Link Color",
        guide: "The color of links on the site.",
        formType: FormType.COLOR,
      },
      uiBackgroundColor: {
        label: "UI Background Color",
        guide:
          "The background color for UI elements like the sidebar and header.",
        formType: FormType.COLOR,
      },
      uiTextColor: {
        label: "UI Text Color",
        guide:
          "The default text color for UI elements like the sidebar and header.",
        formType: FormType.COLOR,
      },
      cardBackgroundColor: {
        label: "Card Background Color",
        guide: "The background color for cards and similar components.",
        formType: FormType.COLOR,
      },
    },
  },
};
export type ColorSchema = {
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  textColor: string;
  buttonColor: string;
  linkColor: string;
  uiBackgroundColor: string;
  uiTextColor: string;
  cardBackgroundColor: string;
};
export type DESIGN_SCHEMA_SETTINGS_TYPES = {
  [DESIGN_SCHEMA_SETTINGS_KEYS.COLOR_SCHEMA]: ColorSchema;
};
export const defaultColorSchema: ColorSchema = {
  primaryColor: "#1d3557",
  secondaryColor: "#457b9d",
  backgroundColor: "#f8f9fa",
  textColor: "#212529",
  buttonColor: "#1d3557",
  linkColor: "#2a9d8f",
  uiBackgroundColor: "#ffffff",
  uiTextColor: "#212529",
  cardBackgroundColor: "#e9ecef",
};

export const generateColors = (colorSchema: ColorSchema) => {
  const primaryColor =
    colorSchema?.primaryColor || defaultColorSchema.primaryColor;
  const secondaryColor =
    colorSchema?.secondaryColor || defaultColorSchema.secondaryColor;
  const textColor = colorSchema?.textColor || defaultColorSchema.textColor;
  const backgroundColor =
    colorSchema?.backgroundColor || defaultColorSchema.backgroundColor;
  const uiBackgroundColor =
    colorSchema?.uiBackgroundColor || defaultColorSchema.uiBackgroundColor;
  const uiTextColor =
    colorSchema?.uiTextColor || defaultColorSchema.uiTextColor;
  const cardBackgroundColor =
    colorSchema?.cardBackgroundColor || defaultColorSchema.cardBackgroundColor;

  return {
    primary: {
      default: primaryColor,
      hover: lighten(0.05, primaryColor),
      active: darken(0.06, primaryColor),
      selected: darken(0.05, primaryColor),
      disabled: transparentize(0.6, primaryColor),
    },
    secondary: {
      default: secondaryColor,
      hover: lighten(0.05, secondaryColor),
      active: darken(0.05, secondaryColor),
      disabled: transparentize(0.6, secondaryColor),
    },

    text: {
      default: textColor,
      muted: transparentize(0.5, textColor),
      placeholder: transparentize(0.6, textColor),
      heading: darken(0.2, textColor),
      hovered: lighten(0.1, textColor),
      disabled: transparentize(0.7, textColor),
      selected: darken(0.15, textColor),
    },
    uiText: {
      default: uiTextColor,
      muted: transparentize(0.5, uiTextColor),
      placeholder: transparentize(0.6, uiTextColor),
      heading: darken(0.2, uiTextColor),
      hovered: lighten(0.1, uiTextColor),
      disabled: transparentize(0.7, uiTextColor),
      selected: darken(0.15, uiTextColor),
    },
    background: {
      default: backgroundColor,
    },
    uiBackground: {
      default: uiBackgroundColor,
      hovered: lighten(0.05, uiBackgroundColor),
      active: darken(0.05, uiBackgroundColor),
      disabled: transparentize(0.9, uiBackgroundColor),
      mask: transparentize(0.8, uiBackgroundColor),
      selected: darken(0.06, uiBackgroundColor),
      selectedHovered: darken(0.08, uiBackgroundColor),
      expanded: darken(0.07, uiBackgroundColor),
      border: darken(0.1, uiBackgroundColor),
      shadow: transparentize(0.9, uiBackgroundColor),
    },
    uiDarkBackground: {
      default: darken(0.05, uiBackgroundColor),
      hovered: lighten(0.05, darken(0.05, uiBackgroundColor)),
      active: darken(0.1, uiBackgroundColor),
      disabled: transparentize(0.9, darken(0.05, uiBackgroundColor)),
      mask: transparentize(0.8, darken(0.05, uiBackgroundColor)),
      selected: darken(0.06, uiBackgroundColor),
      selectedHovered: darken(0.08, uiBackgroundColor),
      expanded: darken(0.07, uiBackgroundColor),
      border: darken(0.1, uiBackgroundColor),
      shadow: transparentize(0.9, uiBackgroundColor),
    },
    card: {
      default: cardBackgroundColor,
      hovered: lighten(0.05, cardBackgroundColor),
      active: darken(0.05, cardBackgroundColor),
      disabled: transparentize(0.9, cardBackgroundColor),
      mask: transparentize(0.8, cardBackgroundColor),
      selected: darken(0.06, cardBackgroundColor),
      selectedHovered: darken(0.08, cardBackgroundColor),
      expanded: darken(0.07, cardBackgroundColor),
      border: darken(0.1, cardBackgroundColor),
      shadow: transparentize(0.9, cardBackgroundColor),
    },

    link: {
      default: colorSchema?.linkColor || defaultColorSchema.linkColor,
      hover: lighten(
        0.1,
        colorSchema?.linkColor || defaultColorSchema.linkColor
      ),
      active: darken(
        0.1,
        colorSchema?.linkColor || defaultColorSchema.linkColor
      ),
      visited: darken(
        0.15,
        colorSchema?.linkColor || defaultColorSchema.linkColor
      ),
    },

    border: {
      default: darken(0.1, uiBackgroundColor),
      hover: darken(0.2, uiBackgroundColor),
      active: darken(0.2, uiBackgroundColor),
      disabled: transparentize(0.8, uiBackgroundColor),
      split: darken(0.15, uiBackgroundColor),
    },

    button: {
      default: colorSchema?.buttonColor || defaultColorSchema.buttonColor,
      hover: lighten(
        0.1,
        colorSchema?.buttonColor || defaultColorSchema.buttonColor
      ),
      active: darken(
        0.1,
        colorSchema?.buttonColor || defaultColorSchema.buttonColor
      ),
      text: textColor,
      border: darken(
        0.1,
        colorSchema?.buttonColor || defaultColorSchema.buttonColor
      ),
      disabled: transparentize(
        0.6,
        colorSchema?.buttonColor || defaultColorSchema.buttonColor
      ),
    },

    status: {
      success: {
        base: "#66bb6a",
        text: lighten(0.15, "#66bb6a"),
        background: transparentize(0.85, "#66bb6a"),
        border: darken(0.2, "#66bb6a"),
      },
      warning: {
        base: "#f39c12",
        text: lighten(0.1, "#f39c12"),
        background: transparentize(0.85, "#f39c12"),
        border: darken(0.2, "#f39c12"),
      },
      error: {
        base: "#e74c3c",
        text: lighten(0.1, "#e74c3c"),
        background: transparentize(0.85, "#e74c3c"),
        border: darken(0.2, "#e74c3c"),
      },
      info: {
        base: "#3498db",
        text: lighten(0.1, "#3498db"),
        background: transparentize(0.85, "#3498db"),
        border: darken(0.2, "#3498db"),
      },
    },

    icon: {
      default: uiTextColor,
      hover: lighten(0.1, uiTextColor),
      active: darken(0.1, uiTextColor),
      disabled: transparentize(0.7, uiTextColor),
    },

    divider: {
      default: transparentize(0.85, uiTextColor),
      bold: darken(0.1, uiTextColor),
    },

    miscellaneous: {
      shadowLight: transparentize(0.8, uiTextColor),
      shadowDark: transparentize(0.6, uiTextColor),
      disabledBackground: transparentize(0.9, uiBackgroundColor),
    },
  };
};
