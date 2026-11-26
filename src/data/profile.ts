// Dữ liệu trang "Me". Chỉnh sửa file này để cập nhật trang cá nhân.
// Mỗi mục để trống ('' hoặc []) sẽ tự động bị ẩn khỏi trang.

export type SocialKind = 'github' | 'linkedin' | 'youtube' | 'x' | 'facebook' | 'email' | 'website';

export interface Social {
  kind: SocialKind;
  url: string; // email: dùng 'mailto:you@example.com'
  label?: string; // aria-label, mặc định theo kind
}

export interface CurrentItem {
  label: string; // 'Learning' | 'Practicing' | 'Building' ...
  text: string;
}

export interface AboutItem {
  icon: 'GraduationCap' | 'Users' | 'Code';
  text: string;
}

export interface Profile {
  name: string;
  role: string;
  bio: string;
  avatar: string; // URL/đường dẫn ảnh (trong /public). Để trống -> dùng hình minh hoạ mặc định.
  avatarAlt: string;
  socials: Social[];
  interests: string[];
  currently: CurrentItem[];
  about: AboutItem[];
  cvUrl: string;
  quote: string;
}

export const profile: Profile = {
  name: 'mq',
  role: 'Computer Science · Security & Cryptography',
  bio: 'This blog is where I write my notes, learning materials, and CTF write-ups on computer science, web security, applied cryptography, and the math behind them.',

  // TODO: điền thông tin của bạn — ví dụ: '/avatar.jpg' (đặt file trong thư mục public/)
  avatar: '',
  avatarAlt: 'Illustration of green mountains and trees',

  // TODO: điền thông tin của bạn
  // Ví dụ:
  // { kind: 'github', url: 'https://github.com/username' },
  // { kind: 'linkedin', url: 'https://www.linkedin.com/in/username' },
  // { kind: 'youtube', url: 'https://www.youtube.com/@username' },
  // { kind: 'email', url: 'mailto:you@example.com' },
  // { kind: 'website', url: 'https://example.com' },
  socials: [],

  interests: ['Cryptography', 'Web Security', 'CTF', 'Binary Exploitation', 'Linux', 'Networking'],

  // TODO: điền thông tin của bạn
  // Ví dụ:
  // { label: 'Learning', text: 'lattice-based cryptography' },
  // { label: 'Practicing', text: 'CTF regularly' },
  // { label: 'Building', text: 'this blog with my notes and write-ups' },
  currently: [],

  // TODO: điền thông tin của bạn
  // Ví dụ:
  // { icon: 'GraduationCap', text: 'Computer Science @ Your University' },
  // { icon: 'Users', text: 'Member of Your Community' },
  about: [],

  // TODO: điền thông tin của bạn — ví dụ: 'https://example.com/cv.pdf'
  cvUrl: '',

  quote: 'Learn, build, break, and share what I learn.',
};
