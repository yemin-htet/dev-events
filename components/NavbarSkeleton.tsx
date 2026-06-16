const NavbarSkeleton = () => {
  return (
    <header>
      <nav>
        {/* Logo placeholder */}
        <div className="logo">
          <div className="size-6 rounded bg-gray-700 animate-pulse" />
          <div className="h-4 w-20 rounded bg-gray-700 animate-pulse" />
        </div>
        {/* Nav links placeholder */}
        <ul className="flex gap-6">
          <div className="h-4 w-12 rounded bg-gray-700 animate-pulse" />
          <div className="h-4 w-10 rounded bg-gray-700 animate-pulse" />
          <div className="h-4 w-14 rounded bg-gray-700 animate-pulse" />
        </ul>
      </nav>
    </header>
  );
};

export default NavbarSkeleton;
