export default function PrivateLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <h1>Private Layout</h1>
      <div>{children}</div>
    </>
  );
}
