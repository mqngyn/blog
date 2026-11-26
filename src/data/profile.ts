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

// ⚠️ MOCK DATA (lấy từ mockup) — chỉ để kiểm tra UI. Thay bằng thông tin thật trước khi deploy.
export const profile: Profile = {
  name: 'Minh Anh',
  role: 'CS Student · Security & Cryptography Enthusiast',
  bio: "Year 4 Computer Science student at HCMUT. I'm interested in security (especially web security and applied cryptography), competitive CTF, and building useful things. This blog is where I write my notes, learning materials, and CTF write-ups.",

  // Để trống -> dùng hình minh hoạ mặc định. Ví dụ: '/avatar.jpg' (đặt file trong public/)
  avatar: '',
  avatarAlt: 'Illustration of green mountains and trees',

  socials: [
    { kind: 'github', url: 'https://github.com/username' },
    { kind: 'linkedin', url: 'https://www.linkedin.com/in/username' },
    { kind: 'youtube', url: 'https://www.youtube.com/@username' },
    { kind: 'email', url: 'mailto:you@example.com' },
    { kind: 'website', url: 'https://example.com' },
  ],

  interests: ['Web Security', 'Cryptography', 'CTF', 'Linux', 'Networking', 'Cloud (AWS)'],

  currently: [
    { label: 'Learning', text: 'HTB Web Penetration Tester path' },
    { label: 'Practicing', text: 'CTF regularly with BKISC' },
    { label: 'Building', text: 'blog with my notes and write-ups' },
  ],

  about: [
    { icon: 'GraduationCap', text: 'Computer Science @ HCMUT' },
    { icon: 'Users', text: 'Member of BKISC (Crypto ban)' },
  ],

  cvUrl: 'https://example.com/cv.pdf',

  quote: 'Learn, build, break, and share what I learn.',
};
