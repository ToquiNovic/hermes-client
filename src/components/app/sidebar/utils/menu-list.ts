import {
    UtilityPole ,
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
          },
          {
            label: "Sensores",
            href: "/sensors",
            icon: UtilityPole ,
            submenus: [],
          },
        ],
      },
      {
        groupLabel: "Configuracion",
        menus: [
          {label: "Usuarios", href: "/users", icon: UsersRound, active: pathname === "/users"},
          {label: "Roles", href: "/rol", icon: SlidersVertical, active: pathname === "/rol"},
          {label: "Equipos", href: "/teams", icon: Users , active: pathname === "/teams"},
          {label: "Cuenta", href: "/account", icon: CircleUser , active: pathname === "/account"},
        ],
      },
    ];
  }
  