import styled from "styled-components";

export const Container = styled.main`
    width: 100%;
    max-width: 80%;
    margin: 0 auto;
    margin-top: 50px;
    display: flex;
    flex-direction: column; /* Mudança aqui para empilhar os elementos verticalmente */
    align-items: center;
`;

export const Title = styled.h2`
    font-family: 'Open Sans';
    font-style: normal;
    font-weight: 700;
    font-size: 32px;
    margin-bottom: 20px;
    line-height: 44px;
    color: #FFFFFF;
`;

export const Table = styled.table`
    width: 100%;
    border-collapse: collapse;
    margin-top: 5px;
    margin-bottom: 5rem;
`;

export const TableHeader = styled.thead`
    background-color: #1852CC;
    color: #FFFFFF;
`;

export const TableBody = styled.tbody`
    background-color: #F3F4F6;
    color: black;
`;

export const TableRow = styled.tr`
    &:nth-child(even) {
        background-color: #EDF2F7;
    }
`;

export const TableCell = styled.td`
    padding: 12px;
    border: 1px solid #D1D5DB;
    font-family: 'Open Sans';
    font-size: 16px;
`;

export const TableHeaderCell = styled.th`
    padding: 12px;
    border: 1px solid #D1D5DB;
    font-family: 'Open Sans';
    font-weight: bold;
    font-size: 16px;
    text-align: left;
`;
