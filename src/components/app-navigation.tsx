"use client";
import React, { useEffect, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { Button } from "./ui/button";
import { HiOutlineBars3 } from "react-icons/hi2";
import NavBar from "./NavBar";
import { NavItemsListT } from "@/api/action.type";
import { getNavItems } from "@/api/action";
import { usePathname } from "next/navigation";

const AppNavigation = () => {
  const [navList, setNavList] = useState<NavItemsListT>([]);
  const pathname = usePathname();
  const [isNavigationOpen, setIsNavigationOpen] = useState(false);
  const activeItem = navList
    .reduce<NavItemsListT>(
      (prev, item) => [...prev, item, ...(item.children ?? [])],
      []
    )
    .find((item) => item?.target === pathname);

  const getNav = async () => {
    const res = await getNavItems();
    setNavList(res.data);
  };

  useEffect(() => {
    getNav();
  }, []);

  return (
    <>
      <div className="h-12 w-full bg-gray-300 md:hidden grid grid-cols-3 items-center px-2">
        <h4 className="col-span-1 col-start-2">{activeItem?.title}</h4>

        <Sheet
          open={isNavigationOpen}
          onOpenChange={() => setIsNavigationOpen(!isNavigationOpen)}
        >
          <SheetTrigger
            asChild
            className="col-span-1 col-start-3 justify-self-end"
            onClick={() => setIsNavigationOpen(true)}
          >
            <Button size="icon">
              <HiOutlineBars3 className="w-5 h-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[calc(100vh-4rem)] p-5">
            <SheetHeader className="sr-only">
              <SheetTitle>Navigation</SheetTitle>
            </SheetHeader>
            <NavBar
              className="md:hidden w-full"
              navList={navList}
              setNavList={setNavList}
              onCloseNavigation={() => setIsNavigationOpen(false)}
            />
          </SheetContent>
        </Sheet>
      </div>
      <NavBar
        className="hidden md:block"
        navList={navList}
        setNavList={setNavList}
      />
    </>
  );
};

export default AppNavigation;
