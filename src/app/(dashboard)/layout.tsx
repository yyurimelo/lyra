import AppearanceUserSettings from "@lyra/_components/dynaminc-primary-color";
import { Header } from "@lyra/_components/header";

export default function PrivateLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <AppearanceUserSettings />
      <div className="flex min-h-screen flex-col">
        <Header />
        <div className="flex flex-1 flex-col gap-4 p-8 pt-6">{children}</div>
      </div>
    </>
  );
}
