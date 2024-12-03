import { useState, useMemo, useCallback, FC } from "react";
import Select from "react-select";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter, faFilterCircleXmark } from "@fortawesome/free-solid-svg-icons";
import { FilterableTableProps, FilterOption, SelectedFilters } from "../../Types/Components/FilterableTable";
import SearchableTable from "../SearchableTable/SearchableTable";
import { StyledButton } from "../../Styles/StyledComponents";

const FilterableTable: FC<FilterableTableProps> = ({ headers, body, customClass, canDownload = true }) => {
    const [filterMode, setFilterMode] = useState(false);
    const [selectedFilters, setSelectedFilters] = useState<SelectedFilters>({});

    const columnOptions = useMemo(() => {
        if (!body) return {};
        return (headers as string[]).reduce((acc, header: string, index) => {
            const uniqueValues = [...new Set((body as string[][]).map((row) => row[index]))].map((value) => ({
                value,
                label: String(value),
            }));
            acc[header] = uniqueValues;
            return acc;
        }, {} as Record<string, FilterOption[]>);
    }, [body, headers]);

    const filteredBody = useMemo(() => {
        if (!body || Object.keys(selectedFilters).length === 0) return body;

        const allFiltersEmpty = Object.values(selectedFilters).every(
            (filter) => !filter || filter.length === 0
        );

        if (allFiltersEmpty) return body;

        const arrayHeaders = Array.isArray(headers) ? headers : Object.values(headers);
        return (body as string[][]).filter((row) =>
            row.every((cell: string, index: number) => {
                const header = arrayHeaders[index] as string;
                const selectedFilter = selectedFilters[header];
                if (!selectedFilter || !Boolean(selectedFilter.length)) return true;
                return selectedFilter.some((filter) => filter.value === cell);
            })
        );
    }, [body, headers, selectedFilters]);

    const handleFilterChange = (header: string, selectedOptions: FilterOption[]) => {
        setSelectedFilters((prev) => {
            const updatedFilters = { ...prev };

            if (!selectedOptions || selectedOptions.length === 0) {
                delete updatedFilters[header];
            } else {
                updatedFilters[header] = selectedOptions;
            }

            return updatedFilters;
        });
    };

    const handleFilterModeChange = useCallback(() => {
        setFilterMode((prev) => !prev);
        if (filterMode) {
            setSelectedFilters({});
        }
    }, [filterMode]);
    return (
        <div className="filterable-table">
            {(Boolean(headers.length) && Boolean(body.length)) && <StyledButton onClick={handleFilterModeChange} className="flex-button force-height"><FontAwesomeIcon icon={filterMode ? faFilterCircleXmark : faFilter} />{filterMode ? "Esci dalla modalità filtro" : "Filtra"}</StyledButton>}
            <SearchableTable
                headers={
                    filterMode
                        ? (Array.isArray(headers)
                            ? headers.map((header, index) =>
                                header === "Azione" ? (
                                    <span key={index}>{header}</span>
                                ) : (
                                    <Select
                                        key={index}
                                        options={columnOptions[header as string]}
                                        isMulti
                                        placeholder={`Filtra ${header}`}
                                        value={selectedFilters[header as string] || []}
                                        onChange={(selected) => handleFilterChange(String(header), (selected as FilterOption[]))}
                                        className="table-filters-select"
                                    />
                                )
                            )
                            : Object.values(headers).map((header, index) => (
                                <span key={index}>{header}</span>
                            )))
                        : Array.isArray(headers)
                            ? headers
                            : Object.values(headers)
                }
                body={filteredBody}
                customClass={customClass}
                canDownload={canDownload}
            />
        </div>
    );
};

export default FilterableTable;
