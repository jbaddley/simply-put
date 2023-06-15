import { Metadata, ResolvingMetadata } from "next";
import { headers } from "next/headers";

type Props = {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata({ params, searchParams }: Props, parent?: ResolvingMetadata): Promise<Metadata> {
  const headersList = headers();
  const url = new URL(headersList.get("host"));
  console.log({ url });
  return {
    title: `TITLE: ${url.href}`,
  };
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en'>
      <body>{children}</body>
    </html>
  );
}
