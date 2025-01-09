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
import { SettingsInterface } from "@/config/settingKeys";

interface SocialLinksProps {
  settings: SettingsInterface;
}

const SocialLinks: React.FC<SocialLinksProps> = ({ settings }) => {
  const socialLinks = [
    {
      key: SETTINGS_KEYS.FACEBOOK,
      url: settings[SETTINGS_KEYS.FACEBOOK]?.url,
      icon: <FacebookOutlined />,
    },
    {
      key: SETTINGS_KEYS.TWITTER,
      url: settings[SETTINGS_KEYS.TWITTER]?.url,
      icon: <TwitterOutlined />,
    },
    {
      key: SETTINGS_KEYS.INSTAGRAM,
      url: settings[SETTINGS_KEYS.INSTAGRAM]?.url,
      icon: <InstagramOutlined />,
    },
    {
      key: SETTINGS_KEYS.LINKEDIN,
      url: settings[SETTINGS_KEYS.LINKEDIN]?.url,
      icon: <LinkedinOutlined />,
    },
    {
      key: SETTINGS_KEYS.GITHUB,
      url: settings[SETTINGS_KEYS.GITHUB]?.url,
      icon: <GithubOutlined />,
    },
  ];

  return (
    <>
      {socialLinks.map(
        (link) =>
          link.url && (
            <SocialLink key={link.key} url={link.url} icon={link.icon} />
          )
      )}
    </>
  );
};

export default SocialLinks;
