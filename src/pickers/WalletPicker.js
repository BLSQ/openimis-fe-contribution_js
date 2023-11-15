import React, { useState } from "react";
import {
  useTranslations,
  Autocomplete,
  useGraphqlQuery,
} from "@openimis/fe-core";

const WalletPicker = (props) => {
  const {
    onChange,
    readOnly,
    required,
    withLabel = true,
    withPlaceholder,
    value,
    label,
    filterOptions,
    filterSelectedOptions,
    placeholder,
    multiple,
  } = props;
  const [searchString, setSearchString] = useState(null);
  const { formatMessage } = useTranslations("contribution");

  const { isLoading, data, error } = useGraphqlQuery(
    `query {
      paymentServiceProvider{
        edges{
          node{
           name
            uuid,
            account
            pin
          }
        }
       }
    }`,
    { searchString, first: 20 },
    { skip: true }
  );

  return (
    <Autocomplete
      multiple={multiple}
      required={required}
      placeholder={placeholder ?? ""}
      label={label ?? ""}
      error={error}
      withLabel={withLabel}
      withPlaceholder={withPlaceholder}
      readOnly={readOnly}
      options={data?.category?.edges.map((edge) => edge.node) ?? []}
      isLoading={isLoading}
      value={value}
      getOptionLabel={(option) => `${option.categoryTitle}`}
      onChange={(option) =>
        onChange(option, option ? `${option.categoryTitle}` : null)
      }
      filterOptions={filterOptions}
      filterSelectedOptions={filterSelectedOptions}
      onInputChange={setSearchString}
    />
  );
};

export default WalletPicker;
