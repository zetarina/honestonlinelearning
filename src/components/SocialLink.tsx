// components/SocialLink.tsx
import { Button } from "antd";
import Link from "next/link";
import { ReactNode } from "react";

interface SocialLinkProps {
  url: string;
  icon: ReactNode;
  type?: "link" | "primary" | "default" | "dashed" | "text";
}

const SocialLink: React.FC<SocialLinkProps> = ({
  url,
  icon,
  type = "link",
}) => {
  if (!url) return null;

  return (
    <Link href={url} target="_blank" rel="noopener noreferrer">
      <Button icon={icon} type={type} />
    </Link>
  );
};

export default SocialLink;
