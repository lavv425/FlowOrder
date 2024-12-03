import { Options } from "react-select";
import { TableProps } from "./Table";
export type FilterableTableProps = {
    headers: TableProps["headers"];
    body: TableProps["body"];
    customClass?: TableProps["customClass"];
    canDownload?: boolean;
};

export type FilterOption = { value: string; label: string };
export type SelectedFilters = Record<string, Options<FilterOption>>;