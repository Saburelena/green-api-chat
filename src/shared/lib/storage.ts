import { createJSONStorage } from 'zustand/middleware';
export const sessionJSONStorage = createJSONStorage(() => sessionStorage);
export const localJSONStorage = createJSONStorage(() => localStorage);
