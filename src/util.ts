import { MailIcon, Github, Linkedin } from "lucide-react";

export const AudioLinks = [
  "https://stream.nightride.fm/chillsynth.mp3",
  "https://stream.nightride.fm/darksynth.mp3",
  "https://stream.nightride.fm/datawave.mp3",
  "https://stream.nightride.fm/horrorsynth.mp3",
];

export type connection = {
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  href: string;
};

export const connections: connection[] = [
  {
    icon: MailIcon,
    href: "mailto:milanprajapati366@gmail.com",
  },
  {
    icon: Github,
    href: "https://github.com/milan-git-in",
  },
  {
    icon: Linkedin,
    href: "https://www.linkedin.com/in/milan-prajapati-366/",
  },
];
