import { FC, useCallback, useEffect, useState } from "react";
import * as XLSX from 'sheetjs-style';
import Table from "../Table/Table";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileArrowDown, faXmark } from "@fortawesome/free-solid-svg-icons";
import Loader from "../Loader/Loader";
import { NO_ERROR_INPUT, NOT_FOUND_ERROR_INPUT, XLSX_DOWNLOAD_OPTIONS } from "../../Constants/Constants";
import { useAppContext, useToday } from "../../Hooks";
import { SearchableTableProps } from "../../Types/Components/SearchableTable";
import { SearchableInputWrapper, TopSearchableWrapper } from "../../Styles/StyledComponents";
import Input from "../Input/Input";

const SearchableTable: FC<SearchableTableProps> = ({ headers, body, customClass, canDownload = false, exportFilename = "" }) => {
    const { setIsLoading } = useAppContext();
    const [searchedValue, setSearchedValue] = useState(() => new URLSearchParams(window.location.search).get("q") || "");
    const [found, setFound] = useState(0);
    const [searchErr, setSearchErr] = useState(NO_ERROR_INPUT);
    const [isSearching, setIsSearching] = useState(false);
    const today = useToday();
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
    // const handleDownloadExcel = useCallback(() => {
    //     setIsLoading(true);

    //     /**
    //      * This component supports a lot of different approaches, so unfortunately, "as unknown as T" saves my life.
    //     */
    //     try {
    //         if (!Array.isArray(headers) || headers.length === 0) {
    //             console.error("Headers are invalid or empty.");
    //             setIsLoading(false);
    //             return;
    //         }

    //         const formattedHeaders = (headers as string[]).map((header, index) => ({
    //             key: `col_${index}`,
    //             header,
    //         }));

    //         console.log("Formatted headers:", formattedHeaders);
    //         const formattedBody = body.length > 0
    //             ? (body as string[][]).map(row =>
    //                 formattedHeaders.reduce<Record<string, string>>((acc, header, index) => {
    //                     acc[header.header] = row[index] || "";
    //                     return acc;
    //                 }, {})
    //             )
    //             : [formattedHeaders.reduce<Record<string, string>>((acc, header) => {
    //                 acc[header.header] = "No data available";
    //                 return acc;
    //             }, {})];

    //         const worksheet = XLSX.utils.json_to_sheet(formattedBody);

    //         XLSX.utils.sheet_add_aoa(worksheet, [(headers as unknown as string[])], { origin: "A1" });

    //         const workbook = XLSX.utils.book_new();
    //         XLSX.utils.book_append_sheet(workbook, worksheet, exportFilename);
    //         XLSX.writeFile(workbook, `${exportFilename} ${today}.xlsx`, XLSX_DOWNLOAD_OPTIONS);
    //     } catch (error) {
    //         console.error("Error while generating Excel file:", error);
    //         alert("An error occurred while generating the Excel file.");
    //     } finally {
    //         setIsLoading(false);
    //     }
    // }, [setIsLoading, headers, body, today, exportFilename]);


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
                        {/* {canDownload && <FontAwesomeIcon icon={faFileArrowDown} size="xl" onClick={handleDownloadExcel} style={{ color: "#2832bd" }} />} */}
                    </div>
                    <SearchableInputWrapper>
                        {Boolean(body.length) && <Input name="table-search-input" type="text" value={searchedValue} onChange={(e) => setSearchedValue(e.target.value)} customClass="searchable-input" triggerError={searchErr} placeholder="Search for anything inside the table" />}
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