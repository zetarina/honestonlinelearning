// components/SocialLinks.tsx
import { SETTINGS_KEYS } from "@/config/settingKeys";
import SocialLink from "./SocialLink";
import {
  FacebookOutlined,
  TwitterOutlined,
  InstagramOutlined,
  LinkedinOutlined,
  GithubOutlined,
} from "@ant-design/icons";

interface SocialLinksProps {
  settings: {
    [SETTINGS_KEYS.FACEBOOK_URL]?: string;
    [SETTINGS_KEYS.TWITTER_URL]?: string;
    [SETTINGS_KEYS.INSTAGRAM_URL]?: string;
    [SETTINGS_KEYS.LINKEDIN_URL]?: string;
    [SETTINGS_KEYS.GITHUB_URL]?: string;
  };
}

const SocialLinks: React.FC<SocialLinksProps> = ({ settings }) => {
  return (
    <>
      {settings[SETTINGS_KEYS.FACEBOOK_URL] && (
        <SocialLink
          url={settings[SETTINGS_KEYS.FACEBOOK_URL]}
          icon={<FacebookOutlined />}
        />
      )}
      {settings[SETTINGS_KEYS.TWITTER_URL] && (
        <SocialLink
          url={settings[SETTINGS_KEYS.TWITTER_URL]}
          icon={<TwitterOutlined />}
        />
      )}
      {settings[SETTINGS_KEYS.INSTAGRAM_URL] && (
        <SocialLink
          url={settings[SETTINGS_KEYS.INSTAGRAM_URL]}
          icon={<InstagramOutlined />}
        />
      )}
      {settings[SETTINGS_KEYS.LINKEDIN_URL] && (
        <SocialLink
          url={settings[SETTINGS_KEYS.LINKEDIN_URL]}
          icon={<LinkedinOutlined />}
        />
      )}
      {settings[SETTINGS_KEYS.GITHUB_URL] && (
        <SocialLink
          url={settings[SETTINGS_KEYS.GITHUB_URL]}
          icon={<GithubOutlined />}
        />
      )}
    </>
  );
};

export default SocialLinks;
