import styled, { css } from 'styled-components';

export const ButtonContainer = styled.button`
    background: #1852CC;
    border: none;
    margin-bottom: 2rem;
    border-radius: 22px;
    position: relative;
    color: #FFFFFF;
    padding: 10px 20px;
    min-width: 120px;
    width: 100%;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
        background: #153C99;
        box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.2);
        transform: translateY(-2px);
    }

    ${({ variant }) => variant === "secondary" && css`
        min-width: 167px;
        height: 45px;

        &::after {
            content: '';
            position: absolute;
            top: -5px;
            left: -6px;
            width: calc(100% + 10px);
            height: calc(100% + 10px);
            border-radius: 22px;
            background: rgba(24, 82, 204, 0.1);
            z-index: -1;
        }

        &:hover {
            background: #153C99;
            box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.2);
            transform: translateY(-2px);
        }
    `}
`;
