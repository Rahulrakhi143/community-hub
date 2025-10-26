import { FaWhatsapp, FaInstagram, FaTwitter, FaLinkedin, FaDiscord, FaEnvelope } from 'react-icons/fa';

// TIP: Replace all 'your-username' with your actual links
const links = [
  { 
    name: 'WhatsApp', 
    icon: FaWhatsapp, 
    url: 'https://wa.me/your-phone-number', // e.g., https://wa.me/15551234567
    color: 'text-green-500' 
  },
  { 
    name: 'Instagram', 
    icon: FaInstagram, 
    url: 'https://instagram.com/your-username', 
    color: 'text-pink-600' 
  },
  { 
    name: 'Twitter', 
    icon: FaTwitter, 
    url: 'https://twitter.com/your-username', 
    color: 'text-blue-400' 
  },
  { 
    name: 'LinkedIn', 
    icon: FaLinkedin, 
    url: 'https://linkedin.com/in/your-profile', 
    color: 'text-blue-700' 
  },
  { 
    name: 'Discord', 
    icon: FaDiscord, 
    url: 'https://discord.gg/your-invite-code', 
    color: 'text-indigo-500' 
  },
  { 
    name: 'Gmail', 
    icon: FaEnvelope, 
    url: 'mailto:your-email@gmail.com', 
    color: 'text-red-600' 
  },
];

export function SocialLinks() {
  return (
    <div className="flex flex-wrap gap-4">
      {links.map((link) => (
        <a
          key={link.name}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className={`flex items-center gap-3 bg-white p-3 px-4 rounded-lg shadow-md border border-gray-200 hover:border-gray-400 hover:shadow-lg transition-all transform hover:-translate-y-0.5`}
        >
          <link.icon className={`text-2xl ${link.color}`} />
          <span className="font-medium text-gray-800">{link.name}</span>
        </a>
      ))}
    </div>
  );
}