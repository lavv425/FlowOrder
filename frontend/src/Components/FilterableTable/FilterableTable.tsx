import { useState, useMemo, useCallback } from "react";
import Select from "react-select";
import SearchableTable from "./SearchableTable";
import { FilterableTableWrapper, StyledButton } from "../StyledComponents";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter, faFilterCircleXmark } from "@fortawesome/free-solid-svg-icons";

const FilterableTable = ({ headers, body, customClass }) => {
    const [filterMode, setFilterMode] = useState(false);
    const [selectedFilters, setSelectedFilters] = useState({});

    const columnOptions = useMemo(() => {
        if (!body) return {};
        return headers.reduce((acc, header, index) => {
            const uniqueValues = [...new Set(body.map((row) => row[index]))].map((value) => ({
                value,
                label: String(value),
            }));
            acc[header] = uniqueValues;
            return acc;
        }, {});
    }, [body, headers]);

    const filteredBody = useMemo(() => {
        if (!body || Object.keys(selectedFilters).length === 0) return body;

        const allFiltersEmpty = Object.values(selectedFilters).every(
            (filter) => !filter || filter.length === 0
        );

        if (allFiltersEmpty) return body;
        return body.filter((row) =>
            row.every((cell, index) => {
                const header = headers[index];
                const selectedFilter = selectedFilters[header];
                if (!selectedFilter || !Boolean(selectedFilter.length)) return true;
                return selectedFilter.some((filter) => filter.value === cell);
            })
        );
    }, [body, headers, selectedFilters]);

    const handleFilterChange = (header, selectedOptions) => {
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
                        ? headers.map((header, index) => (
                            header === "Azione" ? (
                                <span key={index}>{header}</span>
                            ) : (
                                <Select
                                    key={index}
                                    options={columnOptions[header]}
                                    isMulti
                                    placeholder={`Filtra ${header}`}
                                    value={selectedFilters[header] || []}
                                    onChange={(selected) => handleFilterChange(header, selected)}
                                    className="table-filters-select"
                                />
                            )
                        ))
                        : headers
                }
                body={filteredBody}
                customClass={customClass}
            />
        </div>
    );
};

export default FilterableTable;
