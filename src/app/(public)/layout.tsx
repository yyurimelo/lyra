import { ModeToggle } from "@lyra/components/mode-toggle";

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <div className="fixed top-4 right-4 z-50 flex items-center gap-2">
        <ModeToggle />
      </div>
      <div>{children}</div>
    </>
  );
}
