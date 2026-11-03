import NavBar from "./_components/Navbar";

export default function LandingPageLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="w-full h-auto">
      <NavBar />
      {children}
    </div>
  );
}
