export type TableProps = {
    headers: Array<string> | Record<string, string>;
    body: Array<Array<string>> | Record<string, Array<string>>;
    customClass?: string;
    wrapInDiv?: boolean;
};