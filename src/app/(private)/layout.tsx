export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <div>
        <p>Private</p>
        {children}
      </div>
    </>
  );
}
