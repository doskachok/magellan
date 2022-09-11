import {
  useState,
  useCallback,
  memo,
  ReactElement
} from 'react';
import { useTranslation } from 'react-i18next';

import { AutocompleteInput, LoadingRow, NoResultsRow, SearchIcon, SuggestionRow, SuggestionsWrapper, Wrapper } from './index.styled';
import { IAutocompleteSuggestion } from './types';
import SearchIconSVG from '../../assets/images/search-icon.svg';

interface Props {
  placeholder?: string;
  onSuggestionSelected: (suggestion: any) => void;
  suggestionTemplate?: (suggestion: any) => ReactElement<any>;
  reversedTheme?: boolean;
  suggestionsSource: (searchQuery: string) => Promise<IAutocompleteSuggestion[]>;
}

const MIN_SEARCH_LENGTH = 3;
const SEARCH_DELAY_MS = 300;

const Autocomplete = ({
  onSuggestionSelected,
  suggestionTemplate,
  reversedTheme,
  placeholder,
  suggestionsSource
}: Props) => {
  const { t } = useTranslation('common');
  const [suggestions, setSuggestions] = useState<IAutocompleteSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [value, setValue] = useState<string>('');
  const [isSuggestionsOpened, setIsSuggestionsOpened] = useState<boolean>(false);
  const [searchTimer, setSearchTimer] = useState<any>();

  const handleInputFocus = useCallback(() => {
    setIsSuggestionsOpened(true);
  }, [setIsSuggestionsOpened]);

  const handleInputBlur = useCallback(() => {
    //Set timeout need to handle click event before blur
    setTimeout(() => {
      setIsSuggestionsOpened(false);
    });
  }, [setIsSuggestionsOpened]);

  const handleTextChange = useCallback((n: string, v: string) => {
    setValue(v);

    if (!v || v.length < MIN_SEARCH_LENGTH) {
      setSuggestions([]);
      return;
    }

    if (searchTimer) {
      clearTimeout(searchTimer);
    }

    const timer = setTimeout(() => {
      setIsLoading(true);

      suggestionsSource(v).then(data => {
        setSuggestions(data);
        setIsLoading(false);
      }, () => {
        setIsLoading(false);
      });
    }, SEARCH_DELAY_MS);

    setSearchTimer(timer);
  }, [suggestionsSource, setSuggestions, setValue, setIsLoading, searchTimer, setSearchTimer]);

  const handleSuggestionSelected = (suggestion: any) => {
    onSuggestionSelected(suggestion);
  };

  return (
    <Wrapper fullWidth>
      <AutocompleteInput
        placeholder={placeholder}
        value={value}
        name='autocomplete'
        onTextChange={handleTextChange}
        reversedTheme={reversedTheme}
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
      />

      <SearchIcon src={SearchIconSVG} />

      {
        isSuggestionsOpened &&
        <SuggestionsWrapper>
          {suggestions.map(s => {
            return suggestionTemplate ?
              <div key={s.id.toString()} onClick={(e) => handleSuggestionSelected(s)}>{suggestionTemplate(s)}</div> :
              <SuggestionRow key={s.id.toString()} onClick={(e) => handleSuggestionSelected(s)}>
                {s.toString()}
              </SuggestionRow>
          })
          }

          {suggestions.length === 0 && !isLoading && <NoResultsRow>{t('noResults')}</NoResultsRow>}

          {isLoading && <LoadingRow>{t('loading')}</LoadingRow>}
        </SuggestionsWrapper>
      }
    </Wrapper>
  );
};

export default memo(Autocomplete);
