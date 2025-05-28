import { 
  LayoutDashboard,
  Package,
  ListTree,
  ShoppingCart,
  Users,
  BarChart2,
  Settings,
  LogOut
} from 'lucide-react';

export const SIDE_MENU_DATA = [
  {
    id: "01",
    label: "Dashboard",
    icon: LayoutDashboard,
    path: "/dashboard",
  },
  {
    id: "02",
    label: "Products",
    icon: Package,
    path: "/products",
  },
  {
    id: "03",
    label: "Categories",
    icon: ListTree,
    path: "/categories",
  },
  {
    id: "04",
    label: "Orders",
    icon: ShoppingCart,
    path: "/orders",
  },
  {
    id: "05",
    label: "Users",
    icon: Users,
    path: "/users",
  },
  {
    id: "06",
    label: "Reports",
    icon: BarChart2,
    path: "/reports",
  },
  {
    id: "07",
    label: "Settings",
    icon: Settings,
    path: "/settings",
  },
  {
    id: "08",
    label: "Logout",
    icon: LogOut,
    path: "/logout",
  },
];