import styled, { css } from 'styled-components';

export const Container = styled.div<{ width: string }>`
  position: relative;
  width: ${({ width }) => width};
  max-width: 600px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
`;

export const InputContainer = styled.div.withConfig({
  shouldForwardProp: (prop) => !['isFocused', 'hasError'].includes(prop),
})<{ isFocused: boolean; hasError: boolean }>`
  position: relative;
  display: flex;
  align-items: center;
  border: 1px solid #ddd;
  border-radius: 6px;
  background-color: #fff;
  transition: all 0.2s ease;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);

  ${({ isFocused }) =>
    isFocused &&
    css`
      border-color: #4361ee;
      box-shadow: 0 0 0 3px rgba(67, 97, 238, 0.1);
    `}

  ${({ hasError }) =>
    hasError &&
    css`
      border-color: #ef233c;
    `}
`;

export const Input = styled.input`
  flex: 1;
  padding: 12px 16px;
  font-size: 14px;
  line-height: 1.5;
  color: #333;
  background: transparent;
  border: none;
  outline: none;
  height: 29px;

  &:disabled {
    cursor: not-allowed;
    opacity: 0.7;
  }

  &::placeholder {
    color: #888;
  }
`;

export const ClearButton = styled.button`
  margin-right: 12px;
  padding: 2px 6px;
  background: none;
  border: none;
  color: #888;
  cursor: pointer;
  border-radius: 4px;
  font-size: 16px;
  font-weight: bold;
  transition: all 0.2s;

  &:hover {
    color: #333;
    background: #f0f0f0;
  }
`;

export const Spinner = styled.div`
  margin-right: 12px;
  width: 16px;
  height: 16px;
  border: 2px solid #f0f0f0;
  border-top: 2px solid #4361ee;
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;

export const SuggestionsList = styled.ul`
  position: absolute;
  width: 100%;
  max-height: 300px;
  overflow-y: auto;
  margin-top: 8px;
  padding: 8px 0;
  list-style: none;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 6px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 1000;
`;

export const SuggestionItem = styled.li.withConfig({
  shouldForwardProp: (prop) => prop !== 'isActive',
})<{ isActive: boolean }>`
  padding: 10px 16px;
  cursor: pointer;
  background-color: ${({ isActive }) => (isActive ? '#f5f5f5' : 'transparent')};
  transition: background-color 0.2s;

  &:hover {
    background-color: #f5f5f5;
  }

  &:not(:last-child) {
    border-bottom: 1px solid #eee;
  }
`;

export const SuggestionContent = styled.div`
  display: flex;
  flex-direction: column;
`;

export const CountryName = styled.span`
  font-weight: 500;
  color: #333;
`;

export const CountryDetails = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 4px;
  font-size: 12px;
  color: #666;

  span:first-child {
    background: #f0f0f0;
    padding: 2px 6px;
    border-radius: 4px;
    font-family: monospace;
  }
`;

export const ErrorMessage = styled.div`
  margin-top: 8px;
  font-size: 13px;
  color: #ef233c;
`;
