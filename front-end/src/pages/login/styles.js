import styled from 'styled-components';

export const Container = styled.main`
    width: 100%;
    max-width: 80%;
    margin: 0 auto;
    margin-top: 120px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
`

export const Wrapper = styled.div`
    max-width: 300px;
`

export const Column = styled.div`
    flex: 1;
`

export const Row = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin-top: 20px;
`

export const Title = styled.h2`
    font-family: 'Open Sans';
    font-style: normal;
    font-weight: 700;
    font-size: 32px;
    max-width: 90%;
    margin-bottom: 20px;
    line-height: 44px;
    color: #FFFFFF;
`

export const TitleLogin = styled.p`
    font-family: 'Open Sans';
    font-style: normal;
    font-weight: 700;
    font-size: 32px;
    line-height: 44px;
    margin-bottom: 8px;
`

export const SubtitleLogin = styled.p`
    font-family: 'Open Sans';
    font-style: normal;
    font-weight: 400;
    font-size: 18px;
    line-height: 25px;
    margin-bottom: 10px;
`

export const EsqueciText  = styled.p`
    font-family: 'Open Sans';
    font-style: normal;
    font-weight: 700;
    font-size: 14px;
    line-height: 19px;
    color: #E5E044;
`

export const CriarText =  styled.p`
    font-family: 'Open Sans';
    font-style: normal;
    font-weight: 700;
    font-size: 14px;
    line-height: 19px;
    color: #23DD7A;
`


export const PedidoList = styled.div`
    margin-top: 20px;
    border: 1px solid #ccc;
    padding: 10px;
    border-radius: 5px;
    font-family: 'Open Sans', sans-serif; /* Aplicando a fonte Open Sans */
`

export const PedidoItem = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 5px 0;
    border-bottom: 1px solid #ddd;

    &:last-child {
        border-bottom: none;
    }
`

export const ProdutoNome = styled.span`
    font-weight: bold;
`

export const Quantidade = styled.span`
    color: #888;
`

export const InputWrapper = styled.div`
    margin-bottom: 20px;
`

export const InputLabel = styled.label`
    display: block;
    margin-bottom: 5px;
    font-weight: bold;
`

export const InputField = styled.input`
    width: 100%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    font-size: 16px;
    margin-bottom: 1rem;

    &:focus {
        outline: none;
        border-color: #23DD7A;
    }
`

export const SelectField = styled.select`
    width: 100%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    font-size: 16px;
    margin-bottom: 1rem;

    &:focus {
        outline: none;
        border-color: #23DD7A;
    }
`

export const ErrorMsg = styled.span`
    color: #ff0000;
    font-size: 14px;
    margin-top: 5px;
`
