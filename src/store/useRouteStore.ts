import { create } from "zustand";

interface Routes {
  lat: number;
  lng: number;
}

interface nearbyState {
  start?: Routes;
  end?: Routes;
  polyline?: Routes;
  routeName: string;
  radiusMeters: number;
  categoryIds: number[];
  startName: string;
  startJibunAddress: string;
  startBuildingName: string;
  endName: string;
  endJibunAddress: string;
  endBuildingName: string;
  setTemp: (field: Partial<nearbyState>) => void;
  reset: () => void;
}

export const useNearbyState = create<nearbyState>((set) => ({
  start: undefined,
  end: undefined,
  polyline: undefined,
  routeName: "",
  startName: "",
  radiusMeters: 0,
  categoryIds: [],
  startJibunAddress: "",
  startBuildingName: "",
  endName: "",
  endJibunAddress: "",
  endBuildingName: "",
  setTemp: (field) => set((state) => ({ ...state, ...field })),
  reset: () =>
    set({
      startName: "",
      radiusMeters: 0,
      categoryIds: [],
      startBuildingName: "",
      endName: "",
      startJibunAddress: "",
      endJibunAddress: "",
      start: undefined,
      end: undefined,
      polyline: undefined,
      routeName: "",
    }),
}));
