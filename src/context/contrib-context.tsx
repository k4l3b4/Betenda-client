import { createContext, useContext, useState, useEffect } from 'react';
import { getLanguages } from '@/api/requests/contributions/requests';
import { LanguageType } from '@/types/contributions';
import { DataType } from '@/types/global';
import { useQuery } from '@tanstack/react-query';

interface ContributionContextValue {
  sourceLanguages: LanguageType[],
  targetLanguages: LanguageType[],
  sourceLabelValuePairs: DataType[],
  targetLabelValuePairs: DataType[],
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
  const [sourceLabelValuePairs, setSourceLabelValuePairs] = useState<DataType[]>([]);
  const [targetLabelValuePairs, setTargetLabelValuePairs] = useState<DataType[]>([]);
  const [sourceLanguages, setSourceLanguages] = useState<LanguageType[] | []>([]);
  const [targetLanguages, setTargetLanguages] = useState<LanguageType[] | []>([]);


  // Transforming the array into label-value pairs on component mount for the select component
  useEffect(() => {
    if (languages) {
      const sourceLanguages = languages.filter((lang) => lang.language_type === "SOURCE");
      const targetLanguages = languages.filter((lang) => lang.language_type === "TARGET");

      const sourceTransformedPairs = sourceLanguages.map((languageType) => ({
        label: languageType.language,
        value: languageType.id,
      }));
      setSourceLanguages(sourceLanguages);
      setSourceLabelValuePairs(sourceTransformedPairs);

      const targetTransformedPairs = targetLanguages.map((languageType) => ({
        label: languageType.language,
        value: languageType.id,
      }));
      setTargetLanguages(targetLanguages);
      setTargetLabelValuePairs(targetTransformedPairs);
    }
  }, [languages]);


  const contextValue: ContributionContextValue = {
    sourceLanguages: sourceLanguages,
    targetLanguages: targetLanguages,
    sourceLabelValuePairs: sourceLabelValuePairs,
    targetLabelValuePairs: targetLabelValuePairs,
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
