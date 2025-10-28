import { create } from "zustand";

// interface Routes {
//   lat: number;
//   lng: number;
// }

// interface nearbyState {
//   start?: Routes;
//   end?: Routes;
//   polyline?: Routes[];
//   routeName: string;
//   //   radiusMeters: number;
//   //   categoryIds: number[];
//   //   startName: string;
//   startJibunAddress: string;
//   //   startBuildingName: string;
//   //   endName: string;
//   endJibunAddress: string;
//   //   endBuildingName: string;
//   setTemp: (field: Partial<nearbyState>) => void;
//   reset: () => void;
// }

// export const useNearbyUiState = create<nearbyState>((set) => ({
//   start: undefined,
//   end: undefined,
//   polyline: undefined,
//   routeName: "",
//   //   startName: "",
//   //   radiusMeters: 0,
//   //   categoryIds: [],
//   startJibunAddress: "",
//   //   startBuildingName: "",
//   //   endName: "",
//   endJibunAddress: "",
//   //   endBuildingName: "",
//   setTemp: (field) => set((state) => ({ ...state, ...field })),
//   reset: () =>
//     set({
//       //   startName: "",
//       //   radiusMeters: 0,
//       //   categoryIds: [],
//       //   startBuildingName: "",
//       //   endName: "",
//       startJibunAddress: "",
//       endJibunAddress: "",
//       start: undefined,
//       end: undefined,
//       polyline: undefined,
//       routeName: "",
//     }),
// }));

// useNearbyUiState.ts
type LatLng = { lat: number; lng: number };
type UiRouteDraft = {
  routeName?: string;
  start?: LatLng;
  end?: LatLng;
  startJibunAddress?: string;
  endJibunAddress?: string;
};

interface NearbyUiState {
  editedByRoute: Record<number, UiRouteDraft>;
  setDraft: (routeId: number, patch: Partial<UiRouteDraft>) => void;
  resetDraft: (routeId: number) => void;
  resetAll: () => void;
}

export const useNearbyUiState = create<NearbyUiState>((set) => ({
  editedByRoute: {},
  setDraft: (routeId, patch) =>
    set((s) => ({
      editedByRoute: {
        ...s.editedByRoute,
        [routeId]: { ...(s.editedByRoute[routeId] ?? {}), ...patch },
      },
    })),
  resetDraft: (routeId) =>
    set((s) => {
      const next = { ...s.editedByRoute };
      delete next[routeId];
      return { editedByRoute: next };
    }),
  resetAll: () => set({ editedByRoute: {} }),
}));
