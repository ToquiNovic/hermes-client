// src/components/app/sidebar/menu.tsx
import {
  UtilityPole,
  LucideIcon,
  LayoutGrid,
  UsersRound,
  SlidersVertical,
  CircleUser,
  Users,
  Layers2,
} from "lucide-react";

type Submenu = {
  href: string;
  label: string;
  active?: boolean;
};

type Menu = {
  href: string;
  label: string;
  active?: boolean;
  icon: LucideIcon;
  submenus?: Submenu[];
  admin?: boolean;
};

type Group = {
  groupLabel: string;
  menus: Menu[];
};

export function getMenuList(pathname: string): Group[] {
  return [
    {
      groupLabel: "",
      menus: [
        {
          href: "/dashboard",
          label: "Dashboard",
          icon: LayoutGrid,
          submenus: [],
          admin: false,
        },
      ],
    },
    {
      groupLabel: "Gestión",
      menus: [
        {
          label: "Panel",
          href: "/sensors-panel",
          icon: Layers2,
          submenus: [],
          admin: true,
        },
        {
          label: "Sensores",
          href: "/sensors",
          icon: UtilityPole,
          submenus: [],
          admin: false,
        },
      ],
    },
    {
      groupLabel: "Configuracion",
      menus: [
        {
          label: "Usuarios",
          href: "/users",
          icon: UsersRound,
          active: pathname === "/users",
          admin: true,
        },
        {
          label: "Roles",
          href: "/rol",
          icon: SlidersVertical,
          active: pathname === "/rol",
          admin: true,
        },
        {
          label: "Equipos",
          href: "/teams",
          icon: Users,
          active: pathname === "/teams",
          admin: true,
        },
        {
          label: "Cuenta",
          href: "/account",
          icon: CircleUser,
          active: pathname === "/account",
          admin: false,
        },
      ],
    },
  ];
}
