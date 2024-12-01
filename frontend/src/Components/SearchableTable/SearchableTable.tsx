import { useCallback, useContext, useEffect, useState } from "react";
import * as XLSX from 'sheetjs-style';
import Input from "./Input";
import Table from "../Table/Table";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileArrowDown, faXmark } from "@fortawesome/free-solid-svg-icons";
import { SearchableInputWrapper, TopSearchableWrapper } from "../StyledComponents";
import { NO_ERR, NOT_FOUND_ERR } from "../../Constants/DefaultStates";
import Loader from "../Loader/Loader";
import { AppContext } from "../../Contexts/AppProvider";
import { useToday } from "../../Hooks/useToday";
import { XLSX_DOWNLOAD_OPTIONS } from "../../Constants/Constants";

const SearchableTable = ({ headers, body, canDownload = false, exportFilename = "" }) => {
    const { setIsLoading } = useContext(AppContext);
    const [searchedValue, setSearchedValue] = useState(() => new URLSearchParams(window.location.search).get("q") || "");
    const [found, setFound] = useState(0);
    const [searchErr, setSearchErr] = useState(NO_ERR);
    const [isSearching, setIsSearching] = useState(false);
    const today = useToday();
    const customTableClass = "searchable-table";

    const updateURL = (search) => {
        const params = new URLSearchParams(window.location.search);
        if (search) {
            params.set("q", search);
        } else {
            params.delete("q");
        }

        const newUrl = params.toString() ? `${window.location.pathname}?${params.toString()}` : window.location.pathname;
        window.history.pushState({}, "", newUrl);
    };

    const handleSearch = useCallback((showAll) => {
        const rows = document.querySelectorAll(".searchable-table tbody tr");
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
                setSearchErr(NOT_FOUND_ERR);
            }

            setFound(totalMatches);
        }
    }, [searchedValue]);

    const handleDownloadExcel = useCallback(() => {
        setIsLoading(true);

        const formattedHeaders = headers.map((header, index) => ({
            key: `col_${index}`,
            header,
        }));

        const formattedBody = body.map(row =>
            formattedHeaders.reduce((acc, header, index) => {
                acc[header.header] = row[index] || "";
                return acc;
            }, {})
        );

        const worksheet = XLSX.utils.json_to_sheet(formattedBody);

        XLSX.utils.sheet_add_aoa(worksheet, [headers], { origin: "A1" });

        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, exportFilename);

        XLSX.writeFile(workbook, `${exportFilename} ${today}.xlsx`, XLSX_DOWNLOAD_OPTIONS);

        setIsLoading(false);
    }, [setIsLoading, headers, body, today, exportFilename]);


    useEffect(() => {
        setIsSearching(true);
        setFound(0)
        setSearchErr(NO_ERR);
        if (searchedValue.length > 0) {
            handleSearch(false);
            updateURL(searchedValue);
        } else {
            handleSearch(true);
            updateURL("");
        }
        setIsSearching(false);
    }, [searchedValue, handleSearch, body]);

    // effect per monitorare i cambiamenti nell'URL della query string (perchè da notifica possono andare diretti anche una volta nella pagina)
    useEffect(() => {
        const checkForUrlChange = () => {
            const newSearchValue = new URLSearchParams(window.location.search).get("q") || "";
            setSearchedValue(newSearchValue);
        };

        const observer = new MutationObserver(() => {
            checkForUrlChange();
        });

        // controlla le modifiche alla barra degli indirizzi
        observer.observe(document, { subtree: true, childList: true });

        // subito al montaggio del componente
        checkForUrlChange();

        // Cleanup: interrompe l'observer quando il componente viene smontato (se no leaka l'anima)
        return () => {
            observer.disconnect();
        };
    }, []);

    return (
        <>
            <div className="searchable-wrapper">
                <TopSearchableWrapper $canDownload={canDownload}>
                    <div>
                        {found > 0 ?? searchedValue.length > 0 ?
                            <span><b>{found}</b> risultati trovati</span>
                            :
                            <span><b>{body.length}</b> risultati</span>
                        }
                        {canDownload && <FontAwesomeIcon icon={faFileArrowDown} size="xl" onClick={handleDownloadExcel} data-tooltip-id="helper-tooltip" style={{ color: "#2832bd" }} />}
                    </div>
                    <SearchableInputWrapper>
                        {Boolean(body.length) && <Input value={searchedValue} onChange={(e) => setSearchedValue(e.target.value)} customClass="searchable-input" triggerError={searchErr} placeholder="Cerca all'interno della tabella" type="text" />}
                        {searchedValue && <FontAwesomeIcon icon={faXmark} size="lg" onClick={() => setSearchedValue("")} />}
                    </SearchableInputWrapper>
                </TopSearchableWrapper>
                <Table headers={headers} body={body} customClass={customTableClass} />
            </div>
            {isSearching && <Loader />}
        </>
    )
}

export default SearchableTable;