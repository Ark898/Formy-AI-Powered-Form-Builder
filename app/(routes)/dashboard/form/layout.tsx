import SideMenu from "../_components/_common/SideMenu";

export default async function FormLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-[calc(100vh_-_64px)] w-full flex-row">
      <div className="relative flex w-16 shrink-0">
        <SideMenu />
      </div>
      <main className="w-full flex-1">{children}</main>
    </div>
  );
}
