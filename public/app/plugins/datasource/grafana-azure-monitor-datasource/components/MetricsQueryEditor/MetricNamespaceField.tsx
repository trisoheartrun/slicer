import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Select } from '@grafana/ui';
import { SelectableValue } from '@grafana/data';

import { Field } from '../Field';
import { findOption, toOption } from '../../utils/common';
import { AzureQueryEditorFieldProps, AzureMonitorOption } from '../../types';

const ERROR_SOURCE = 'metrics-metricnamespace';
const MetricNamespaceField: React.FC<AzureQueryEditorFieldProps> = ({
  query,
  datasource,
  subscriptionId,
  variableOptionGroup,
  onQueryChange,
  setError,
}) => {
  const [metricNamespaces, setMetricNamespaces] = useState<AzureMonitorOption[]>([]);

  useEffect(() => {
    const { resourceGroup, metricDefinition, resourceName } = query.azureMonitor;

    if (!(subscriptionId && resourceGroup && metricDefinition && resourceName)) {
      metricNamespaces.length > 0 && setMetricNamespaces([]);
      return;
    }

    datasource
      .getMetricNamespaces(subscriptionId, resourceGroup, metricDefinition, resourceName)
      .then((results) => {
        if (results.length === 1) {
          onQueryChange({
            ...query,
            azureMonitor: {
              ...query.azureMonitor,
              metricNamespace: results[0].value,
            },
          });
        }
        setMetricNamespaces(results.map(toOption));
      })
      .catch((err) => setError(ERROR_SOURCE, err));
  }, [
    subscriptionId,
    query.azureMonitor.resourceGroup,
    query.azureMonitor.metricDefinition,
    query.azureMonitor.resourceName,
  ]);

  const handleChange = useCallback(
    (change: SelectableValue<string>) => {
      if (!change.value) {
        return;
      }

      onQueryChange({
        ...query,
        azureMonitor: {
          ...query.azureMonitor,
          metricNamespace: change.value,

          metricName: undefined,
          dimensionFilters: [],
        },
      });
    },
    [query]
  );

  const options = useMemo(() => [...metricNamespaces, variableOptionGroup], [metricNamespaces, variableOptionGroup]);

  return (
    <Field label="Metric Namespace">
      <Select
        inputId="azure-monitor-metrics-metric-namespace-field"
        value={findOption(metricNamespaces, query.azureMonitor.metricNamespace)}
        onChange={handleChange}
        options={options}
        width={38}
      />
    </Field>
  );
};

export default MetricNamespaceField;
