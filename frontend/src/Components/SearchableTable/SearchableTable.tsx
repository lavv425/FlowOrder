import { FC, useCallback, useEffect, useState } from "react";
import * as XLSX from "xlsx";
import Loader from "../Loader/Loader";
import Table from "../Table/Table";
import Input from "../Input/Input";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileArrowDown, faXmark } from "@fortawesome/free-solid-svg-icons";
import { NO_ERROR_INPUT, NOT_FOUND_ERROR_INPUT, XLSX_DOWNLOAD_OPTIONS } from "../../Constants/Constants";
import useError, { useAppContext, useToday } from "../../Hooks";
import { SearchableTableProps } from "../../Types/Components/SearchableTable";
import { SearchableInputWrapper, TopSearchableWrapper } from "../../Styles/StyledComponents";
import { ErrorType } from "../../Types/Hooks/Hooks";

const SearchableTable: FC<SearchableTableProps> = ({ headers, body, customClass, canDownload = false, exportFilename = "" }) => {
    const { setIsLoading } = useAppContext();
    const { handleError } = useError();
    const today = useToday();

    const [searchedValue, setSearchedValue] = useState(() => new URLSearchParams(window.location.search).get("q") || "");
    const [found, setFound] = useState(0);
    const [searchErr, setSearchErr] = useState(NO_ERROR_INPUT);
    const [isSearching, setIsSearching] = useState(false);

    const customTableClass = `searchable-table ${customClass}`.trim();

    /** 
     * Updates the URL when the search value changes, so that the user can bookmark the page
     * and return to it later with the same search query
     */
    const updateURL = (search: string) => {
        const params = new URLSearchParams(window.location.search);
        if (search) {
            params.set("q", search);
        } else {
            params.delete("q");
        }

        const newUrl = params.toString() ? `${window.location.pathname}?${params.toString()}` : window.location.pathname;
        window.history.pushState({}, "", newUrl);
    };

    /** 
     * Filters the table rows based on the search value.
     */
    const handleSearch = useCallback((showAll: boolean) => {
        const rows = document.querySelectorAll<HTMLElement>(".searchable-table tbody tr");
        if (showAll) {
            rows?.forEach(row => {
                row.style.display = "";
            });
        } else {
            const searchVal = String(searchedValue.normalizeForSearch());
            let totalMatches = 0;
            rows?.forEach(row => {
                const cells = row.querySelectorAll("td");

                let matches = 0;
                cells?.forEach(cell => {
                    if (!cell.textContent) {
                        return;
                    }

                    if (cell.textContent.normalizeForSearch().includes(searchVal)) {
                        matches++;
                    }
                });

                if (matches > 0) {
                    row.style.display = "";
                    totalMatches++;
                } else {
                    row.style.display = "none";
                }
            });

            if (totalMatches === 0) {
                setSearchErr(NOT_FOUND_ERROR_INPUT);
            }

            setFound(totalMatches);
        }
    }, [searchedValue]);

    /**
     * Downloads the table data as an Excel file.
     */
    const handleDownloadExcel = useCallback(() => {
        setIsLoading(true);

        try {
            if (!Array.isArray(headers) || headers.length === 0) {
                console.error("Headers are invalid or empty.");
                setIsLoading(false);
                return;
            }

            // Filter headers to exclude those containing "Actions"
            const formattedHeaders = (headers as string[]).map((header, index) => ({
                key: `col_${index}`,
                header,
            })).filter(header => !header.header.trim().includes("Actions"));

            // Find indices of headers to exclude
            const excludedIndices = (headers as string[])
                .map((header, index) => (header.includes("Actions") ? index : -1))
                .filter(index => index !== -1);

            // Filter body to remove columns corresponding to excluded indices
            const formattedBody = (body as string[][]).map(row =>
                formattedHeaders.reduce<Record<string, string>>((acc, header, index) => {
                    // Add only the columns that are not excluded
                    if (!excludedIndices.includes(index)) {
                        acc[header.header] = row[index] || "";
                    }
                    return acc;
                }, {})
            );

            const headerRow = formattedHeaders.map(header => header.header);
            // Create the worksheet with filtered headers and body
            const worksheet = XLSX.utils.json_to_sheet(formattedBody);

            XLSX.utils.sheet_add_aoa(worksheet, [headerRow], { origin: "A1" });

            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, exportFilename);
            XLSX.writeFile(workbook, `${exportFilename} ${today}.xlsx`, XLSX_DOWNLOAD_OPTIONS);
        } catch (error) {
            handleError(error as ErrorType);
            console.error("Error while generating Excel file:", error);
        } finally {
            setIsLoading(false);
        }
    }, [setIsLoading, headers, body, today, exportFilename]);


    useEffect(() => {
        setIsSearching(true);
        setFound(0)
        setSearchErr(NO_ERROR_INPUT);
        if (searchedValue.length > 0) {
            handleSearch(false);
            updateURL(searchedValue);
        } else {
            handleSearch(true);
            updateURL("");
        }
        setIsSearching(false);
    }, [searchedValue, handleSearch, body]);

    /**
     * Effect to monito URL changes 
     */
    useEffect(() => {
        const checkForUrlChange = () => {
            const newSearchValue = new URLSearchParams(window.location.search).get("q") || "";
            setSearchedValue(newSearchValue);
        };

        const observer = new MutationObserver(() => {
            checkForUrlChange();
        });

        // Checks for url change event
        observer.observe(document, { subtree: true, childList: true });

        // At component mount
        checkForUrlChange();

        // Cleanup
        return () => {
            observer.disconnect();
        };
    }, []);

    return (
        <>
            <div className="searchable-wrapper">
                <TopSearchableWrapper $canDownload={canDownload}>
                    <div>
                        {found > 0 || searchedValue.length > 0 ?
                            <span><b>{found}</b> results found</span>
                            :
                            <span><b>{body.length}</b> results</span>
                        }
                        {canDownload && <FontAwesomeIcon icon={faFileArrowDown} size="xl" onClick={handleDownloadExcel} data-tooltip-id="helper-tooltip" data-tooltip-content="Click to download the table in Excel format" style={{ color: "#2832bd" }} />}
                    </div>
                    <SearchableInputWrapper>
                        {!!body.length && <Input customContainerClass="searchable-input-wrapper" name="table-search-input" type="text" value={searchedValue} onChange={(e) => setSearchedValue(e.target.value)} customClass="searchable-input" triggerError={searchErr} placeholder="Search for anything inside the table" />}
                        {searchedValue && <FontAwesomeIcon icon={faXmark} size="lg" onClick={() => setSearchedValue("")} />}
                    </SearchableInputWrapper>
                </TopSearchableWrapper>
                <Table headers={headers as unknown as string[]} body={body} customClass={customTableClass} />
            </div>
            {isSearching && <Loader />}
        </>
    )
}

export default SearchableTable;