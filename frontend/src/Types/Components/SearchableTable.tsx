import { TableProps } from "./Table";

type SearchableTableHeaders = (TableProps["headers"] | React.ReactNode)[];

export type SearchableTableProps = {
    headers: SearchableTableHeaders;
    body: TableProps["body"];
    customClass?: TableProps["customClass"];
    canDownload?: boolean;
    exportFilename?: string;
};