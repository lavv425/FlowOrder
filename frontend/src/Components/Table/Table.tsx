import { FC, useMemo } from "react";
import T from "../../Singletons/Typer";
import { StyledTable, StyledTableData, StyledTableHead, StyledTableHeader, StyledTableRow, StyledTableWrapper } from "../../Styles/StyledComponents";
import { TableProps } from "../../Types/Components/Table";

const Table: FC<TableProps> = ({ headers, body, customClass, wrapInDiv = true }) => {
    // If headers is an object, it converts it in an array of strings
    const processedHeaders = useMemo(() => {
        if (headers && !Array.isArray(headers)) {
            return Object.values(headers);
        }
        return T.isArrayOf("s", headers);
    }, [headers]);

    // If body is an object, it converts it in an array of arrays
    const processedBody = useMemo(() => {
        if (body && !Array.isArray(body)) {
            return Object.entries(body).map(([key, value]) => value);
        }
        return T.isArrayOf("a", body);
    }, [body]);

    const tableJSX = (
        <StyledTable className={customClass}>
            <StyledTableHead>
                <StyledTableRow>
                    {processedHeaders ? processedHeaders?.map((header: string, index: number) => {
                        return <StyledTableHeader key={index}>{header}</StyledTableHeader>
                    })
                        :
                        <StyledTableHeader>No available data!</StyledTableHeader>
                    }
                </StyledTableRow>
            </StyledTableHead>
            <tbody>
                {processedBody && processedBody.length > 0 ? processedBody.map((items, rowIndex) => (
                    <StyledTableRow key={rowIndex}>
                        {items && items?.map((item: string, index: number) => (
                            <StyledTableData key={`${index}-${item}`}>{item}</StyledTableData>
                        ))}
                    </StyledTableRow>
                )) : (
                    <StyledTableRow>
                        <StyledTableData style={{ textAlign: "center" }} colSpan={processedHeaders?.length}>
                            No available data!
                        </StyledTableData>
                    </StyledTableRow>
                )}
            </tbody>
        </StyledTable>
    );

    return wrapInDiv ? <StyledTableWrapper className="table-wrapper">{tableJSX}</StyledTableWrapper> : tableJSX;
}

export default Table;