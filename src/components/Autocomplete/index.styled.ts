import styled from 'styled-components';
import { Column, Row } from '../Containers';
import Input from '../Input';

const radius = '10px';

export const Wrapper = styled(Column)`
  position: relative;
`;

export const AutocompleteInput = styled(Input)`
  margin-top: 0;
`;

export const SearchIcon = styled.img`
  position: absolute;
  right: 0.75rem;
  top: 0.9rem;
`;

export const SuggestionsWrapper = styled(Column)`
  background: ${props => props.theme.colors.primary};
  padding: 0.5rem;
  width: 100%;
  position: absolute;
  top: 100%;
  margin-top: 0.15rem;
  gap: 0.25rem;
  border-bottom-left-radius: ${radius};
  border-bottom-right-radius: ${radius};
  -webkit-box-shadow: 0px 29px 51px 2px rgba(0,0,0,0.33);
  -moz-box-shadow: 0px 29px 51px 2px rgba(0,0,0,0.33);
  box-shadow: 0px 29px 51px 2px rgba(0,0,0,0.33);
`;

export const SuggestionRow = styled(Row)`
  width: 100%;
  color: ${props => props.theme.colors.text.secondary};
`;

export const LoadingRow = styled(SuggestionRow)`
  justify-content: center;
`;

export const NoResultsRow = styled(SuggestionRow)`
  justify-content: center;
`;