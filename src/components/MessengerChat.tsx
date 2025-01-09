import React, { useEffect } from "react";
import { useSettings } from "@/contexts/SettingsContext";
import { SETTINGS_KEYS } from "@/config/settingKeys";

const MessengerChat: React.FC = () => {
  const { settings } = useSettings();
  const pageId = settings[SETTINGS_KEYS.FACEBOOK]?.pageId;

  useEffect(() => {
    if (!pageId) return;

    // Function to load the Facebook SDK script
    const loadFacebookSDK = () => {
      const script = document.createElement("script");
      script.src = "https://connect.facebook.net/en_US/sdk/xfbml.customerchat.js";
      script.async = true;
      script.defer = true;
      script.id = "facebook-sdk-script";
      document.body.appendChild(script);

      (window as any).fbAsyncInit = () => {
        (window as any).FB.init({
          xfbml: true,
          version: "v13.0",
        });
      };
    };

    // Check if script already exists to prevent duplicates
    if (!document.getElementById("facebook-sdk-script")) {
      loadFacebookSDK();
    } else {
      // Reinitialize if script already exists
      (window as any).FB?.XFBML.parse();
    }

    // Cleanup function
    return () => {
      const script = document.getElementById("facebook-sdk-script");
      if (script) {
        document.body.removeChild(script);
      }
    };
  }, [pageId]);

  return pageId ? (
    <div>
      <div id="fb-root"></div>
      <div
        className="fb-customerchat"
        data-attribution="setup_tool"
        data-page_id={pageId}
        data-theme_color="#0084ff"
        data-logged_in_greeting="Hi! How can we help you?"
        data-logged_out_greeting="Hi! Please log in to chat with us."
      ></div>
    </div>
  ) : null;
};

export default MessengerChat;
s