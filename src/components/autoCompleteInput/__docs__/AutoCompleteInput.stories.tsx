import type { Meta, StoryObj } from "@storybook/react";
import AutoCompleteInput from "../AutoCompleteInput";
import { JSX } from "react";

type Country = { name: string };

const Component = AutoCompleteInput as unknown as (props: any) => JSX.Element;

const fetchCountries = async () => {
    const response = await fetch('https://countriesnow.space/api/v0.1/countries/positions');
    if(!response.ok) throw Error('Error fetching countries');
    return response.json();
};

const meta: Meta<typeof Component> = {
  title: "Components/AutoCompleteInput",
  component: Component,
};

export default meta;

type Story = StoryObj<typeof Component>;

export const Default: Story = {
  args: {
    fetchSuggestions: fetchCountries,
    getSuggestionValue: (item: Country) => item.name,
    placeholder: "Search a country...",
    onSelect: (item: Country) => console.log("Selected:", item.name),
  },
};

export const CustomRender: Story = {
  args: {
    fetchSuggestions: fetchCountries,
    getSuggestionValue: (item: Country) => item.name,
    renderSuggestion: (item: Country) => (
      <div style={{ fontStyle: "italic", color: "darkblue" }}>
        🌍 {item.name}
      </div>
    ),
    placeholder: "Search a country...",
  },
};

export const WithInitialValue: Story = {
  args: {
    fetchSuggestions: fetchCountries,
    getSuggestionValue: (item: Country) => item.name,
    value: "France",
    onChange: (val: string) => console.log("Input changed:", val),
  },
};

export const WithError: Story = {
  args: {
    fetchSuggestions: fetchCountries,
    getSuggestionValue: (item: Country) => item.name,
    error: "Unable to fetch suggestions.",
  },
};
