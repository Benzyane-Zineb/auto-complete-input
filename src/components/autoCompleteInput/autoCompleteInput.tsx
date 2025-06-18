import React, { useState, useEffect, useRef, KeyboardEvent, useCallback } from 'react';
import {
  Container,
  InputContainer,
  Input,
  ClearButton,
  Spinner,
  SuggestionsList,
  SuggestionItem,
  ErrorMessage,
} from './autoCompleteInput.styles';
import {useDebounce} from '../../utils/hooks';
import { useOnClickOutside } from '../../utils/hooks';

interface ApiResponse<T> {
  data: T[];
  error?: boolean;
  msg?: string;
}

interface AutocompleteProps<T> {
  fetchSuggestions: () => Promise<ApiResponse<T>>;
  getSuggestionValue: (suggestion: T) => string;
  renderSuggestion?: (suggestion: T) => React.ReactNode;
  onSelect?: (suggestion: T) => void;
  placeholder?: string;
  minChars?: number;
  className?: string;
  width?: string;
  debounceDelay?: number;
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
}

const AutoCompleteInput = <T,>({
  fetchSuggestions,
  getSuggestionValue,
  renderSuggestion,
  onSelect,
  placeholder = 'Search...',
  minChars = 1,
  className,
  width = '100%',
  debounceDelay = 300,
  value,
  onChange,
  error,
}: AutocompleteProps<T>) => {
  const [internalValue, setInternalValue] = useState('');
  const inputValue = value !== undefined ? value : internalValue;
  const debouncedInputValue = useDebounce(inputValue, debounceDelay);
  const [allItems, setAllItems] = useState<T[]>([]);
  const [filteredItems, setFilteredItems] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [isOpen, setIsOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useOnClickOutside(containerRef, () => setIsOpen(false), isOpen);

  const loadSuggestions = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetchSuggestions();
      if (response.error || !response.data) {
        throw new Error(response.msg || 'Failed to load suggestions');
      }
      setAllItems(response.data);
    } catch (err) {
      console.error("Error fetching data", err)
    } finally {
      setIsLoading(false);
    }
  }, [fetchSuggestions]);

  useEffect(() => {
    loadSuggestions();
  }, [loadSuggestions]);

  useEffect(() => {
    if (debouncedInputValue.length >= minChars) {
      const tokens = debouncedInputValue.toLowerCase().split(' ').filter(Boolean);
      const filtered = allItems.filter(item => {
        const itemValue = getSuggestionValue(item).toLowerCase();
        let currentIndex = 0;
        for (const token of tokens) {
          if (!itemValue.startsWith(token, currentIndex)) return false;
          currentIndex += token.length;
        }
        return true;
      });
      setFilteredItems(filtered);
      setIsOpen(filtered.length > 0);
    } else {
      setFilteredItems([]);
      setIsOpen(false);
    }
    setActiveIndex(-1);
  }, [debouncedInputValue, minChars, allItems, getSuggestionValue]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    if (onChange) {
      onChange(newValue);
    } else {
      setInternalValue(newValue);
    }
  }, [onChange]);

  const handleSelect = useCallback((item: T) => {
    const value = getSuggestionValue(item);
    if (onChange) {
      onChange(value);
    } else {
      setInternalValue(value);
    }
    setFilteredItems([]);
    setIsOpen(false);
    onSelect?.(item);
    inputRef.current?.focus();
  }, [getSuggestionValue, onChange, onSelect]);

  const handleKeyDown = useCallback((e: KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen) return;
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setActiveIndex(prev => (prev < filteredItems.length - 1 ? prev + 1 : 0));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setActiveIndex(prev => (prev > 0 ? prev - 1 : filteredItems.length - 1));
        break;
      case 'Enter':
        if (activeIndex >= 0 && activeIndex < filteredItems.length) {
          handleSelect(filteredItems[activeIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        break;
    }
  }, [isOpen, activeIndex, filteredItems, handleSelect]);

  const clearInput = useCallback(() => {
    if (onChange) {
      onChange('');
    } else {
      setInternalValue('');
    }
    setFilteredItems([]);
    setIsOpen(false);
    inputRef.current?.focus();
  }, [onChange]);

  const defaultRenderSuggestion = (item: T) => (
    <span>{getSuggestionValue(item)}</span>
  );

  const renderer = renderSuggestion || defaultRenderSuggestion;

  return (
    <Container ref={containerRef} className={className} width={width}>
      <InputContainer isFocused={isFocused} hasError={!!error}>
        <Input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          ref={inputRef}
          aria-autocomplete="list"
          aria-expanded={isOpen}
          aria-controls="suggestions-list"
          disabled={isLoading}
        />
        {inputValue && <ClearButton onClick={clearInput}>×</ClearButton>}
        {isLoading && <Spinner />}
      </InputContainer>

      {error && <ErrorMessage>{error}</ErrorMessage>}

      {isOpen && filteredItems.length > 0 && (
        <SuggestionsList id="suggestions-list">
          {filteredItems.map((item, index) => (
            <SuggestionItem
              key={index}
              onClick={() => handleSelect(item)}
              isActive={index === activeIndex}
              aria-selected={index === activeIndex}
            >
              {renderer(item)}
            </SuggestionItem>
          ))}
        </SuggestionsList>
      )}
    </Container>
  );
};

export default AutoCompleteInput;
