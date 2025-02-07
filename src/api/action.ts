import { http } from "@/lib/axios";
import { NavItemsListT, TrackNavItemsData } from "./action.type";
import { AxiosResponse } from "axios";

export const getNavItems = (
): Promise<AxiosResponse<NavItemsListT>> => {
  return http({
    url: '/nav',
    method: "GET",
  });
};

export const updateNavItems = (
  data: NavItemsListT
): Promise<AxiosResponse<{ status: number }>> => {
  return http({
    url: '/nav',
    method: "POST",
    data,
  });
};

export const trackNavItems = (
  data: TrackNavItemsData
): Promise<AxiosResponse<{ status: number }>> => {
  return http({
    method: "POST",
    url: '/track',
    data,
  });
};
