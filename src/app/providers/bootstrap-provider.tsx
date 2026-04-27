import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { useCharacterStore } from '@/entities/character/model/store/character-store';

interface BootstrapProviderProps {
  children: ReactNode;
}

export const BootstrapProvider = ({ children }: BootstrapProviderProps) => {
  useEffect(() => {
    void useCharacterStore.getState().loadCatalog();
  }, []);

  return <>{children}</>;
};
