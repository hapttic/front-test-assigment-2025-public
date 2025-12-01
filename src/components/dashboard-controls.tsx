import {
  AGGREGATION_OPTIONS,
  CAMPAIGNS_OPTIONS,
  type AggregationMode,
} from "@/lib/constants";
import { Select } from "./ui/select";

type Props = {
  aggregation: {
    value: AggregationMode;
    onChange: (value: AggregationMode) => void;
  };

  campaigns: {
    value: string;
    onChange: (value: string) => void;
  };
};

export const DashboardControls = ({ aggregation, campaigns }: Props) => {
  return (
    <header className="w-full flex md:flex-row flex-col md:items-center items-start border-b border-gray-200 pb-4 gap-4">
      <Select
        options={AGGREGATION_OPTIONS}
        label="Aggregation"
        placeholder="Select aggregation"
        defaultValue={aggregation.value || AGGREGATION_OPTIONS[0].value}
        containerClassName="md:w-auto w-full"
        value={aggregation.value}
        onChange={(e) =>
          aggregation.onChange(e.target.value as AggregationMode)
        }
      />

      <Select
        options={CAMPAIGNS_OPTIONS}
        label="Campaigns"
        placeholder="Select campaigns"
        defaultValue={campaigns.value || CAMPAIGNS_OPTIONS[0].value}
        containerClassName="md:w-auto w-full"
        value={campaigns.value}
        onChange={(e) => campaigns.onChange(e.target.value)}
      />
    </header>
  );
};
