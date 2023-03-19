import { useState, useCallback, memo, ReactElement, useRef } from 'react';
import { useTranslation } from 'react-i18next';

import { AutocompleteInput, LoadingRow, NoResultsRow, SearchIcon, SuggestionRow, SuggestionsWrapper, Wrapper } from './index.styled';
import SearchIconSVG from 'assets/images/search-icon.svg';

export interface IAutocompleteSuggestion {
  id: string | number | Date;
}

interface Props {
  placeholder?: string;
  onSuggestionSelected: (suggestion: IAutocompleteSuggestion) => void;
  suggestionTemplate?: (suggestion: IAutocompleteSuggestion) => ReactElement<any>;
  reversedTheme?: boolean;
  name?: string;
  suggestionsSource: (searchQuery: string) => Promise<IAutocompleteSuggestion[]>;
}

const MIN_SEARCH_LENGTH = 3;
const SEARCH_DELAY_MS = 300;

const Autocomplete = ({
  onSuggestionSelected,
  suggestionTemplate,
  reversedTheme,
  placeholder,
  name = 'autocomplete',
  suggestionsSource
}: Props) => {
  const { t } = useTranslation('common');
  const [suggestions, setSuggestions] = useState<IAutocompleteSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [value, setValue] = useState<string>('');
  const [isSuggestionsOpened, setIsSuggestionsOpened] = useState<boolean>(false);
  const searchTimer = useRef<any>();

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

    if (searchTimer.current) {
      clearTimeout(searchTimer.current);
    }

    searchTimer.current = setTimeout(() => {
      setIsLoading(true);

      suggestionsSource(v).then(data => {
        setSuggestions(data);
        setIsLoading(false);
      }, () => {
        setIsLoading(false);
      });
    }, SEARCH_DELAY_MS);
  }, [suggestionsSource, setSuggestions, setValue, setIsLoading, searchTimer]);

  const handleSuggestionSelected = (suggestion: IAutocompleteSuggestion) => {
    onSuggestionSelected(suggestion);
  };

  return (
    <Wrapper fullWidth>
      <AutocompleteInput
        placeholder={placeholder}
        value={value}
        name={name}
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