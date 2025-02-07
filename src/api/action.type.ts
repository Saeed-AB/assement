export type TrackNavItemsData = {
  id: number;
  from: number;
  to: number;
};

export type NavItemT = {
  id: number;
  title: string;
  target: string;
  children: NavItemT[];
}

export type NavItemsListT = NavItemT[];
