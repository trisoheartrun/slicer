import React, { useCallback, useMemo } from 'react';
import { Select } from '@grafana/ui';
import { SelectableValue } from '@grafana/data';

import { Field } from '../Field';
import { findOption } from '../../utils/common';
import { AzureQueryEditorFieldProps, AzureMonitorOption } from '../../types';

interface AggregationFieldProps extends AzureQueryEditorFieldProps {
  aggregationOptions: AzureMonitorOption[];
}

const AggregationField: React.FC<AggregationFieldProps> = ({
  query,
  variableOptionGroup,
  onQueryChange,
  aggregationOptions,
}) => {
  const handleChange = useCallback(
    (change: SelectableValue<string>) => {
      if (!change.value) {
        return;
      }

      onQueryChange({
        ...query,
        azureMonitor: {
          ...query.azureMonitor,
          aggregation: change.value,
        },
      });
    },
    [query]
  );

  const options = useMemo(() => [...aggregationOptions, variableOptionGroup], [
    aggregationOptions,
    variableOptionGroup,
  ]);

  return (
    <Field label="Aggregation">
      <Select
        inputId="azure-monitor-metrics-aggregation-field"
        value={findOption(aggregationOptions, query.azureMonitor.aggregation)}
        onChange={handleChange}
        options={options}
        width={38}
      />
    </Field>
  );
};

export default AggregationField;
