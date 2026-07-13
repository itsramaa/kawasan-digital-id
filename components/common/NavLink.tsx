'use client';
// Compat shim: replaced react-router-dom NavLink with Next.js Link
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { forwardRef } from 'react';
import { cn } from '@/src/lib/utils';

interface NavLinkCompatProps extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
  to: string;
  className?: string;
  activeClassName?: string;
  pendingClassName?: string;
}

const NavLink = forwardRef<HTMLAnchorElement, NavLinkCompatProps>(
  ({ to, className, activeClassName, pendingClassName, ...props }, ref) => {
    const pathname = usePathname();
    const isActive = pathname === to || (to !== '/' && pathname.startsWith(to));
    return (
      <Link
        ref={ref}
        href={to}
        className={cn(className, isActive && activeClassName)}
        {...props}
      />
    );
  }
);

NavLink.displayName = 'NavLink';
export default NavLink;
export { NavLink };
