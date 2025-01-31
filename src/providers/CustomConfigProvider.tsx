"use client";
import React, { useEffect, useState } from "react";
import { ConfigProvider, Spin } from "antd";
import { lighten, transparentize } from "polished";
import { useSettings } from "@/contexts/SettingsContext";

interface CustomConfigProviderProps {
  children: React.ReactNode;
}
const CustomConfigProvider: React.FC<CustomConfigProviderProps> = ({
  children,
}) => {
  const { xcolor } = useSettings();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [xcolor]);

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          backgroundColor: xcolor.body.background,
        }}
      >
        <Spin size="large" />
      </div>
    );
  }

  return (
    <ConfigProvider
      theme={{
        components: {
          Menu: {
            itemBg: xcolor.interface.darkBackground.default,
            subMenuItemBg: xcolor.interface.background.default,

            popupBg: xcolor.interface.background.default,
            colorBgElevated: xcolor.interface.background.default,

            colorText: xcolor.interface.text.default,
            itemColor: xcolor.interface.text.default,

            // horizontalItemSelectedColor: xcolor.interface.text.selected,
            // horizontalItemSelectedBg: xcolor.interface.background.selected,
            // horizontalItemHoverBg: xcolor.interface.background.hovered,
            // horizontalItemHoverColor: xcolor.interface.text.hovered,

            // itemSelectedColor: xcolor.interface.text.selected,
            // itemSelectedBg: xcolor.interface.background.selected,
            // itemHoverBg: xcolor.interface.background.hovered,
            // itemHoverColor: xcolor.interface.text.hovered,

            horizontalItemSelectedColor: xcolor.interface.text.selected,
            horizontalItemHoverColor: xcolor.interface.text.hovered,
            itemSelectedColor: xcolor.interface.text.selected,
            itemHoverColor: xcolor.interface.text.hovered,

            horizontalItemSelectedBg: xcolor.primary.selected,
            horizontalItemHoverBg: xcolor.primary.hover,
            itemSelectedBg: xcolor.primary.selected,
            itemHoverBg: xcolor.primary.hover,

            colorSplit: xcolor.interface.darkBackground.default,
          },
          Layout: {
            headerColor: xcolor.interface.text.default,

            headerBg: xcolor.interface.background.default,
            siderBg: xcolor.interface.darkBackground.default,
            footerBg: xcolor.interface.background.default,

            bodyBg: xcolor.body.background,

            lightSiderBg: xcolor.interface.trigger.background.default,
            triggerBg: xcolor.interface.trigger.background.default,
            lightTriggerBg: xcolor.interface.trigger.background.default,
            triggerColor: xcolor.interface.trigger.text.default,
            lightTriggerColor: xcolor.interface.trigger.text.default,

            colorText: xcolor.body.text,

            colorSplit: xcolor.interface.background.default,
          },
          Typography: {
            colorText: xcolor.body.text,
            colorTextDescription: xcolor.body.text,
            colorTextDisabled: xcolor.container.text.muted,
            colorTextHeading: xcolor.body.text,
          },
          Drawer: {
            colorBgMask: xcolor.interface.backgroundMask,
            colorIcon: xcolor.interface.text.default,
            colorIconHover: xcolor.interface.text.hovered,
            colorText: xcolor.interface.text.default,
            colorBgElevated: xcolor.interface.background.default,
            colorSplit: xcolor.interface.colorSplit,
          },
          Card: {
            colorBgContainer: xcolor.container.background.default,
            headerBg: xcolor.container.trigger.background.default,
            actionsBg: xcolor.container.trigger.background.default,
            colorPrimary: xcolor.container.border.hovered,
            colorBorderSecondary: xcolor.container.border.default,
            colorText: xcolor.container.text.default,
            colorTextHeading: xcolor.container.trigger.text.default,
            colorTextDescription: xcolor.container.text.default,
          },

          Table: {
            bodySortBg: xcolor.table.section.active,
            borderColor: xcolor.table.section.split,
            expandIconBg: xcolor.table.text.default,

            filterDropdownBg: xcolor.table.section.background,
            filterDropdownMenuBg: xcolor.table.section.background,
            fixedHeaderSortActiveBg: xcolor.table.section.active,

            footerBg: xcolor.table.section.background,
            footerColor: xcolor.table.section.color,
            headerBg: xcolor.table.section.background,
            headerColor: xcolor.table.section.color,

            headerFilterHoverBg: xcolor.table.section.hover,
            headerSortActiveBg: xcolor.table.section.active,
            headerSortHoverBg: xcolor.table.section.hover,

            colorBgContainer: xcolor.table.row.default,
            rowExpandedBg: xcolor.table.row.expanded,
            rowHoverBg: xcolor.table.row.hovered,
            rowSelectedBg: xcolor.table.row.selected,
            rowSelectedHoverBg: xcolor.table.row.selectedHover,

            stickyScrollBarBg: xcolor.table.section.split,

            colorLink: xcolor.table.row.default,
            colorLinkActive: xcolor.table.row.default,
            colorLinkHover: xcolor.table.row.default,

            colorPrimary: xcolor.table.row.default,
            colorPrimaryBorder: xcolor.table.section.split,

            colorSplit: xcolor.table.section.split,
            headerSplitColor: xcolor.table.section.split,

            colorText: xcolor.table.text.default,
            colorTextDescription: xcolor.table.text.description,
            colorTextDisabled: xcolor.table.text.disabled,
            colorTextHeading: xcolor.table.text.heading,
            controlItemBgActive: xcolor.table.section.active,
            controlItemBgHover: xcolor.table.section.hover,
          },

          Input: {
            activeBorderColor: xcolor.input.active.borderColor,
            colorBgContainerDisabled:
              xcolor.input.multiple.selector.backgroundDisabled,
            colorBgContainer: xcolor.input.active.background,
            colorBorder: xcolor.input.addon.background,
            colorFillSecondary: xcolor.input.fill.secondary,
            colorFillTertiary: xcolor.input.fill.tertiary,
            colorText: xcolor.input.text.default,
            colorTextDescription: xcolor.input.text.description,
            colorTextDisabled: xcolor.input.text.disabled,
            colorTextPlaceholder: xcolor.input.text.placeholder,
            colorTextQuaternary: transparentize(
              0.75,
              xcolor.input.text.default
            ),
            colorTextTertiary: xcolor.input.text.description,
            colorIcon: xcolor.input.text.default,
            colorIconHover: xcolor.input.text.hovered,
            colorErrorText: xcolor.input.error.text,
            colorErrorBorderHover: xcolor.input.error.borderHover,
            colorErrorBgHover: xcolor.input.error.hoverBackground,
            colorErrorBg: xcolor.input.error.background,
            colorError: xcolor.input.error.background,
            colorWarningText: xcolor.input.warning.text,
            colorWarningBorderHover: xcolor.input.warning.borderHover,
            colorWarningBgHover: xcolor.input.warning.hoverBackground,
            colorWarningBg: xcolor.input.warning.background,
            colorWarning: xcolor.input.warning.text,
            colorSplit: xcolor.interface.colorSplit,
            colorPrimary: xcolor.input.primary.hover,
            colorPrimaryHover: xcolor.input.primary.hover,
            colorPrimaryActive: xcolor.input.primary.active,
            hoverBorderColor: xcolor.input.hover.borderColor,

            activeBg: xcolor.input.active.background,
            addonBg: xcolor.input.addon.background,
            hoverBg: xcolor.input.hover.background,
          },

          InputNumber: {
            activeBorderColor: xcolor.input.active.borderColor,
            colorBgContainerDisabled:
              xcolor.input.multiple.selector.backgroundDisabled,
            colorBgContainer: xcolor.input.active.background,
            colorBorder: xcolor.input.addon.background,
            colorFillSecondary: xcolor.input.fill.secondary,
            colorFillTertiary: xcolor.input.fill.tertiary,
            colorText: xcolor.input.text.default,
            colorTextDescription: xcolor.input.text.description,
            colorTextDisabled: xcolor.input.text.disabled,
            colorTextPlaceholder: xcolor.input.text.placeholder,
            colorTextQuaternary: transparentize(
              0.75,
              xcolor.input.text.default
            ),
            colorTextTertiary: xcolor.input.text.description,
            colorIcon: xcolor.input.text.default,
            colorIconHover: xcolor.input.text.hovered,
            colorErrorText: xcolor.input.error.text,
            colorErrorBorderHover: xcolor.input.error.borderHover,
            colorErrorBgHover: xcolor.input.error.hoverBackground,
            colorErrorBg: xcolor.input.error.background,
            colorError: xcolor.input.error.background,
            colorWarningText: xcolor.input.warning.text,
            colorWarningBorderHover: xcolor.input.warning.borderHover,
            colorWarningBgHover: xcolor.input.warning.hoverBackground,
            colorWarningBg: xcolor.input.warning.background,
            colorWarning: xcolor.input.warning.text,
            colorSplit: xcolor.interface.colorSplit,
            colorPrimary: xcolor.input.primary.hover,
            colorPrimaryHover: xcolor.input.primary.hover,
            colorPrimaryActive: xcolor.input.primary.active,
            hoverBorderColor: xcolor.input.hover.borderColor,

            activeBg: xcolor.input.active.background,
            addonBg: xcolor.input.addon.background,
            hoverBg: xcolor.input.hover.background,

            filledHandleBg: xcolor.input.active.background,
            handleActiveBg: xcolor.input.addon.background,
            handleBg: xcolor.input.active.background,
            handleBorderColor: xcolor.input.hover.borderColor,
            handleHoverColor: xcolor.input.hover.borderColor,
          },
          Select: {
            activeBorderColor: xcolor.input.active.borderColor,
            colorBgContainerDisabled:
              xcolor.input.multiple.selector.backgroundDisabled,
            colorBgContainer: xcolor.input.active.background,
            colorBorder: xcolor.input.addon.background,
            colorFillSecondary: xcolor.input.fill.secondary,
            colorFillTertiary: xcolor.input.fill.tertiary,
            colorText: xcolor.input.text.default,
            colorTextDescription: xcolor.input.text.description,
            colorTextDisabled: xcolor.input.text.disabled,
            colorTextPlaceholder: xcolor.input.text.placeholder,
            colorTextQuaternary: transparentize(
              0.75,
              xcolor.input.text.default
            ),
            colorTextTertiary: xcolor.input.text.description,
            colorIcon: xcolor.input.text.default,
            colorIconHover: xcolor.input.text.hovered,
            colorErrorText: xcolor.input.error.text,
            colorErrorBorderHover: xcolor.input.error.borderHover,
            colorErrorBgHover: xcolor.input.error.hoverBackground,
            colorErrorBg: xcolor.input.error.background,
            colorError: xcolor.input.error.background,
            colorWarningText: xcolor.input.warning.text,
            colorWarningBorderHover: xcolor.input.warning.borderHover,
            colorWarningBgHover: xcolor.input.warning.hoverBackground,
            colorWarningBg: xcolor.input.warning.background,
            colorWarning: xcolor.input.warning.text,
            colorSplit: xcolor.interface.colorSplit,
            colorPrimary: xcolor.input.primary.hover,
            colorPrimaryHover: xcolor.input.primary.hover,
            colorPrimaryActive: xcolor.input.primary.active,
            hoverBorderColor: xcolor.input.hover.borderColor,

            activeOutlineColor: xcolor.input.active.borderColor,
            clearBg: xcolor.input.active.background,

            // multipleItemBg: xcolor.input.multiple.item.background,
            // multipleItemBorderColor: "transparent",
            // multipleItemBorderColorDisabled: "transparent",
            // multipleItemColorDisabled: xcolor.input.multiple.item.colorDisabled,
            // multipleSelectorBgDisabled:
            //   xcolor.input.multiple.selector.backgroundDisabled,

            optionActiveBg: xcolor.input.option.activeBackground,
            optionSelectedBg: xcolor.input.option.selectedBackground,
            optionSelectedColor: xcolor.input.option.selectedColor,
            selectorBg: xcolor.input.active.background,
            colorBgBase: xcolor.input.active.background,
            colorBgElevated: xcolor.input.active.background,
          },

          Radio: {
            colorPrimary: xcolor.input.primary.hover,
            colorPrimaryActive: xcolor.input.primary.active,
            colorText: xcolor.input.text.default,
          },

          Upload: {
            colorPrimary: xcolor.input.primary.hover,
            colorPrimaryBorder: xcolor.input.active.borderColor,
            colorPrimaryHover: xcolor.input.primary.hover,
            colorText: xcolor.input.text.default,
            colorTextDescription: xcolor.input.text.default,
            colorTextHeading: xcolor.input.text.default,
          },

          Button: {
            defaultBg: xcolor.primary.default,
            // defaultHoverBg: xcolor.primary.hover,

            colorPrimary: xcolor.primary.default,
            colorPrimaryHover: xcolor.primary.hover,
            colorPrimaryActive: xcolor.primary.active,

            // colorPrimaryBg: xcolor.primary.default,
            // colorPrimaryBgHover: xcolor.primary.hover,

            textTextColor: xcolor.container.text.default,
            colorText: xcolor.container.text.default,
            colorTextDisabled: xcolor.container.text.muted,
          },
          Form: {
            labelColor: xcolor.input.text.default,
          },
          Tabs: {
            algorithm: true,
            itemColor: xcolor.input.text.default,
            itemHoverColor: xcolor.secondary.hover,
            itemActiveColor: xcolor.primary.default,
            inkBarColor: xcolor.primary.default,
            cardBg: xcolor.container.background.default,
            itemSelectedColor: xcolor.primary.default,
          },

          Modal: {
            headerBg: xcolor.container.background.default,
            colorText: xcolor.container.text.default,
            colorSplit: xcolor.interface.colorSplit,
            titleColor: xcolor.container.text.default,

            colorPrimaryBorder: xcolor.primary.default,
            colorIconHover: xcolor.input.text.hovered,
            colorIcon: xcolor.input.text.default,
            // colorBgTextHover: "rgba(161,80,80,0.06)",
            // colorBgTextActive: "rgba(233,65,65,0.15)",
            // colorBgMask: "rgba(209,89,89,0.45)",
            footerBg: xcolor.container.background.default,
            contentBg: xcolor.container.background.default,
          },
          Dropdown: {
            colorBgElevated: xcolor.interface.background.default,
            colorText: xcolor.interface.text.default,
            colorTextDescription: xcolor.interface.text.default,
            colorTextDisabled: xcolor.input.text.disabled,
            controlItemBgHover: xcolor.interface.background.hovered,
          },

          Descriptions: {
            extraColor: xcolor.primary.active,
            labelBg: xcolor.container.background.default,
            titleColor: xcolor.primary.active,
            colorText: xcolor.input.text.default,
            colorTextSecondary: xcolor.input.text.default,
            contentColor: xcolor.input.text.default,
          },
          Divider: {
            colorSplit: xcolor.interface.colorSplit,
            colorText: xcolor.input.text.default,
            colorTextHeading: xcolor.input.text.default,
          },
        },
      }}
    >
      {children}
    </ConfigProvider>
  );
};

export default CustomConfigProvider;
