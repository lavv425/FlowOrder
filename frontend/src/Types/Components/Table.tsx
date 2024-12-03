export type TableHeaders = string[] | Record<string, string> | React.ReactNode[];
export type TableBody = string[][] | Record<string, string[]>;

export type TableProps = {
    headers: TableHeaders;
    body: TableBody;
    customClass?: string;
    wrapInDiv?: boolean;
};