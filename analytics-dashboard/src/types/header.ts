export interface SelectProps {
  options: string[];
  value: string;
  onChange: (selectedValue: string) => void;
  placeholder?: string;
  id?: string;
}
