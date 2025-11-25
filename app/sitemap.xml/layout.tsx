export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children; // 아무 wrapper도 넣지 않음 (script 삽입 방지)
}

export const metadata = {};
