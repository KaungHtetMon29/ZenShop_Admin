import Link from 'next/link';
import {
  CheckCheck,
  Home,
  LineChart,
  Package,
  Package2,
  PanelLeft,
  Settings,
  ShieldCheck,
  ShoppingCart,
  Truck,
  User2,
  Users2,
  Wrench
} from 'lucide-react';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip';
import { Analytics } from '@vercel/analytics/react';
import { User } from './user';
import { VercelLogo } from '@/components/icons';
import Providers from './providers';
import { NavItem } from './nav-item';
import { SearchInput } from './search';
import { Dialog } from '@radix-ui/react-dialog';

export default function DashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <Providers>
      <main className="flex min-h-screen w-full flex-col bg-muted/40">
        <DesktopNav />
        <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-52">
          <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
            {/* <MobileNav /> */}
            {/* <DashboardBreadcrumb /> */}
            <div className="flex flex-1 items-center justify-between gap-4">
              <SearchInput />
              <User />
            </div>
          </header>
          <main className="grid flex-1 items-start gap-2 p-4 sm:px-6 sm:py-0 md:gap-4 bg-muted/40">
            {children}
          </main>
        </div>
        <Analytics />
      </main>
    </Providers>
  );
}

function DesktopNav() {
  return (
    <aside className="fixed inset-y-0 left-0 z-10 hidden w-52 flex-col border-r bg-background sm:flex">
      <nav className="flex flex-col gap-6 px-4 sm:py-5">
        <NavItem href="#" label="Dashboard">
          <Home className="h-5 w-5 mr-3" />
          <span>Dashboard</span>
        </NavItem>

        <NavItem href="/orders" label="Orders">
          <ShoppingCart className="h-5 w-5 mr-3" />
          <span>Orders</span>
        </NavItem>

        <NavItem href="/products" label="Products">
          <Package className="h-5 w-5 mr-3" />
          <span>Products</span>
        </NavItem>

        <NavItem href="/brands" label="Brands">
          <CheckCheck className="h-5 w-5 mr-3" />
          <span>Brands</span>
        </NavItem>

        <NavItem href="/delivery" label="Delivery">
          <Truck className="h-5 w-5 mr-3" />
          <span>Delivery</span>
        </NavItem>

        <NavItem href="/repairs" label="Repair">
          <Wrench className="h-5 w-5 mr-3" />
          <span>Repair</span>
        </NavItem>

        <NavItem href="/admins" label="Admin">
          <ShieldCheck className="h-5 w-5 mr-3" />
          <span>Admin</span>
        </NavItem>

        <NavItem href="/users" label="User">
          <User2 className="h-5 w-5 mr-3" />
          <span>User</span>
        </NavItem>

        {/* <NavItem href="#" label="Analytics">
          <LineChart className="h-5 w-5 mr-3" />
          <span>Analytics</span>
        </NavItem> */}
      </nav>
      <nav className="mt-auto flex flex-col px-4 sm:py-5">
        <Link
          href="#"
          className="flex items-center rounded-lg px-3 py-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        >
          <Settings className="h-5 w-5 mr-3" />
          <span>Settings</span>
        </Link>
      </nav>
    </aside>
  );
}

function MobileNav() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button size="icon" variant="outline" className="sm:hidden">
          <PanelLeft className="h-5 w-5" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="sm:max-w-xs">
        <nav className="grid gap-6 text-lg font-medium">
          <Link
            href="#"
            className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base"
          >
            <Package2 className="h-5 w-5 transition-all group-hover:scale-110" />
            <span className="sr-only">Vercel</span>
          </Link>
          <Link
            href="#"
            className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
          >
            <Home className="h-5 w-5" />
            Dashboard
          </Link>
          <Link
            href="#"
            className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
          >
            <ShoppingCart className="h-5 w-5" />
            Orders
          </Link>
          <Link
            href="#"
            className="flex items-center gap-4 px-2.5 text-foreground"
          >
            <Package className="h-5 w-5" />
            Products
          </Link>
          <Link
            href="#"
            className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
          >
            <Users2 className="h-5 w-5" />
            Customers
          </Link>
          <Link
            href="#"
            className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
          >
            <LineChart className="h-5 w-5" />
            Settings
          </Link>
        </nav>
      </SheetContent>
    </Sheet>
  );
}

function DashboardBreadcrumb() {
  return (
    <Breadcrumb className="hidden md:flex">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="#">Dashboard</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="#">Products</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>All Products</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
