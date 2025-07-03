import AppearanceUserSettings from "@lyra/app/_components/dynaminc-primary-color";
import Header from "../_components/header/page";

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
