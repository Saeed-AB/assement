"use client";
import { useCallback, useState } from "react";
import { trackNavItems, updateNavItems } from "@/api/action";
import { NavItemT, NavItemsListT } from "@/api/action.type";
import { cn } from "@/lib/utils";
import { Check, ChevronDownIcon, PenIcon, Settings } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { DraggableCard } from "./DraggableCard";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import update from "immutability-helper";
import { PiDotsSixBold } from "react-icons/pi";

const NavItem = ({
  item,
  isEditMode,
  showDrag,
  ...props
}: {
  item: NavItemT;
  isEditMode: boolean;
  showDrag?: boolean;
  onUpdateNav: (newItem: NavItemT) => Promise<void>;
  handleClickLink?: () => void;
}) => {
  const [showSubNav, setShowSubNav] = useState(false);
  const [isEditableCell, setIsEditableCell] = useState(false);
  const [inputVal, setInputVal] = useState("");

  const handleShow = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    e.stopPropagation();
    setShowSubNav(!showSubNav);
  };

  const handleEdit = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsEditableCell(true);
    setInputVal(item.title);
  };

  return (
    <div key={item.id}>
      <Link
        href={item.target ? item.target : {}}
        className="flex justify-between items-center bg-gray-300 h-10 p-4"
        {...(!isEditableCell &&
          item.target && { onClick: props.handleClickLink })}
      >
        <div className="flex items-center gap-2">
          {isEditMode && showDrag && (
            <PiDotsSixBold className="w-5 h-5 rotate-90 shrink-0" />
          )}

          {isEditableCell && isEditMode ? (
            <div className="flex gap-2 w-full">
              <Input
                defaultValue={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
              />
              <Button
                disabled={!inputVal}
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.preventDefault();
                  setIsEditableCell(false);
                  setInputVal("");
                  props.onUpdateNav({ ...item, title: inputVal });
                }}
              >
                <Check />
              </Button>
            </div>
          ) : (
            <h4>{item.title}</h4>
          )}
        </div>

        {!isEditableCell && isEditMode && (
          <Button size="icon" variant="ghost" onClick={handleEdit}>
            <PenIcon />
          </Button>
        )}

        {item.children?.length > 0 && !isEditMode && (
          <Button size="icon" variant="ghost" onClick={handleShow}>
            <ChevronDownIcon
              className={cn(
                "transition-all ease-linear duration-300",
                showSubNav && "rotate-180"
              )}
            />
          </Button>
        )}
      </Link>

      <div
        className={cn(
          "space-y-2 ms-4 mt-2 hidden transition-all duration-300 ease-linear",
          showSubNav && "block"
        )}
      >
        {item.children?.map((child) => (
          <NavItem
            key={child.id}
            item={child}
            isEditMode={isEditMode}
            handleClickLink={props.handleClickLink}
            onUpdateNav={(d) =>
              props.onUpdateNav({
                ...item,
                children: item.children.map((c) => (c.id === d.id ? d : c)),
              })
            }
          />
        ))}
      </div>
    </div>
  );
};

type NavBarProps = {
  className?: string;
  navList: NavItemsListT;
  setNavList: React.Dispatch<React.SetStateAction<NavItemsListT>>;
  onCloseNavigation?: () => void;
};

const NavBar = ({ className, navList, ...props }: NavBarProps) => {
  const [isEditMode, setIsEditMode] = useState(false);

  const enableEditMode = () => {
    setIsEditMode((prev) => !prev);
  };

  const moveCard = useCallback((dragIndex: number, hoverIndex: number) => {
    props.setNavList((prev) =>
      update(prev, {
        $splice: [
          [dragIndex, 1],
          [hoverIndex, 0, prev[dragIndex]],
        ],
      })
    );
  }, []);

  const onUpdateNav = async (newItem: NavItemT) => {
    const newList = navList.map((item) =>
      item.id === newItem.id ? newItem : item
    );

    await updateNavItems(newList);
    props.setNavList(newList);
  };

  const onDragEnd = async (val: { id: number; from: number; to: number }) => {
    await trackNavItems(val);
    await updateNavItems(navList);
  };

  return (
    <div className={cn("w-1/3", className)}>
      <Button
        size="icon"
        variant="ghost"
        className="mb-4"
        onClick={enableEditMode}
      >
        <Settings className="w-7 h-7" />
      </Button>
      <DndProvider backend={HTML5Backend}>
        <nav className="bg-white p-4 space-y-2">
          {navList.map((item, i) => (
            <DraggableCard
              moveCard={moveCard}
              onDragEnd={onDragEnd}
              id={item.id}
              index={i}
              key={item.id}
              canDrag={isEditMode}
            >
              <NavItem
                showDrag
                isEditMode={isEditMode}
                item={item}
                onUpdateNav={onUpdateNav}
                handleClickLink={props.onCloseNavigation}
              />
            </DraggableCard>
          ))}
        </nav>
      </DndProvider>
    </div>
  );
};

export default NavBar;
