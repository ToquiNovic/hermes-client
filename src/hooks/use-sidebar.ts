// @/hooks/use-sidebar.ts
import { useDispatch, useSelector } from "react-redux";
import {
  toggleOpen,
  setIsOpen,
  setIsHover,
  setSettings,
  selectSidebarOpenState,
} from "@/redux/states/sidebarSlice";
import { RootState } from "@/redux/store";

export const useSidebar = () => {
  const dispatch = useDispatch();
  
  const sidebarState = useSelector((state: RootState) => state.sidebar);
  const isOpen = useSelector(selectSidebarOpenState);

  return {
    ...sidebarState,
    isOpen,
    toggleOpen: () => dispatch(toggleOpen()),
    setIsOpen: (isOpen: boolean) => dispatch(setIsOpen(isOpen)),
    setIsHover: (isHover: boolean) => dispatch(setIsHover(isHover)),
    setSettings: (settings: Partial<typeof sidebarState.settings>) =>
      dispatch(setSettings(settings)),
  };
};
