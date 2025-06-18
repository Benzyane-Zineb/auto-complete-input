import { render, fireEvent, waitFor, screen } from "@testing-library/react";
import AutocompleteInput from "../autoCompleteInput";

interface Country {
  name: string;
}

const mockData = [
  { name: "Morocco" },
  { name: "France" },
  { name: "Finland" },
  { name: "Germany" },
];

const mockFetchSuggestions = jest.fn(async () => ({
  data: mockData,
}));

const getSuggestionValue = (item: Country) => item.name;

describe("AutocompleteInput", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("matches snapshot", async () => {
    const { asFragment } = render(
      <AutocompleteInput<Country>
        fetchSuggestions={mockFetchSuggestions}
        getSuggestionValue={getSuggestionValue}
      />
    );
    await waitFor(() => expect(mockFetchSuggestions).toHaveBeenCalled());
    expect(asFragment()).toMatchSnapshot();
  });

  it("renders input and shows suggestions on input", async () => {
    render(
      <AutocompleteInput<Country>
        fetchSuggestions={mockFetchSuggestions}
        getSuggestionValue={getSuggestionValue}
        placeholder="Search for country"
      />
    );

    const input = screen.getByPlaceholderText(/search for country/i);
    fireEvent.change(input, { target: { value: "F" } });

    await waitFor(() => {
      expect(screen.getByText("France")).toBeInTheDocument();
      expect(screen.getByText("Finland")).toBeInTheDocument();
    });
  });

  it("clears the input when clear button is clicked", async () => {
    const handleChange = jest.fn();

    render(
      <AutocompleteInput<Country>
        fetchSuggestions={mockFetchSuggestions}
        getSuggestionValue={getSuggestionValue}
        onChange={handleChange}
        value="France"
      />
    );

    expect(screen.getByDisplayValue("France")).toBeInTheDocument();

    const clearButton = screen.getByText("×");
    fireEvent.click(clearButton);

    expect(handleChange).toHaveBeenCalledWith("");
  });

  it("displays error message when passed", () => {
    render(
      <AutocompleteInput<Country>
        fetchSuggestions={mockFetchSuggestions}
        getSuggestionValue={getSuggestionValue}
        error="This field is required"
      />
    );

    expect(screen.getByText(/this field is required/i)).toBeInTheDocument();
  });

  // it("calls onChange and onSelect correctly", async () => {
  //   const handleChange = jest.fn();
  //   const handleSelect = jest.fn();

  //   render(
  //     <AutocompleteInput<Country>
  //       fetchSuggestions={mockFetchSuggestions}
  //       getSuggestionValue={getSuggestionValue}
  //       onChange={handleChange}
  //       onSelect={handleSelect}
  //     />
  //   );

  //   const input = screen.getByRole("textbox");

  //   fireEvent.change(input, { target: { value: "Ger" } });

  //   // Wait for the item to appear
  //   const germanyOption = await screen.findByText("Germany");
  //   fireEvent.click(germanyOption);

  //   expect(handleChange).toHaveBeenCalledWith("Germany");
  //   expect(handleSelect).toHaveBeenCalledWith({ name: "Germany" });
  // });
});
