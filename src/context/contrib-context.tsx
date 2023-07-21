import { getLanguages } from '@/api/requests/contributions/requests';
import { LanguageType } from '@/types/contributions';
import { useQuery } from '@tanstack/react-query';
import React, { createContext, useContext, useState } from 'react';



interface ContributionContextValue {
  sourceLanguages: LanguageType[],
  targetLanguages: LanguageType[],
  isLoading: boolean,
  isError: boolean,
  refetch: () => void,
}

const ContributionContext = createContext<ContributionContextValue | undefined>(undefined);

export const useContributionContext = (): ContributionContextValue => {
  const context = useContext(ContributionContext);
  if (!context) {
    throw new Error('useContributionContext must be used within a ContributionProvider');
  }
  return context;
};

export const ContributionProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {

  const { data, isLoading, isError, refetch } = useQuery({ queryKey: ['languages'], queryFn: getLanguages })
  const languages = data?.data as LanguageType[]
  const sourceLanguages = languages?.filter((lang) => lang.language_type === "SOURCE")
  const targetLanguages = languages?.filter((lang) => lang.language_type === "TARGET")



  const contextValue: ContributionContextValue = {
    sourceLanguages: sourceLanguages,
    targetLanguages: targetLanguages,
    isLoading: isLoading,
    isError: isError,
    refetch: refetch,
  };

  return (
    <ContributionContext.Provider value={contextValue}>
      {children}
    </ContributionContext.Provider>
  );
};
