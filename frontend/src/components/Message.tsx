import styled from "styled-components";

const StyledMessage = styled.p<{ $error: boolean; $visible: boolean }>`
    color: ${(props) => (props.$error ? "red" : "green")};
    border: 1px solid ${(props) => (props.$error ? "#dc2626" : "#16a34a")};
    background-color: ${(props) => (props.$error ? "#fef2f2" : "#f0fdf4")};
    display: ${(props) => (props.$visible ? "block" : "none")};
    padding: 12px;
    border-radius: 8px;
    margin: 12px;
`;

type MessageProps = {
    error: boolean;
    visible: boolean;
    children: React.ReactNode;
};

function Message({ error, visible, children }: MessageProps) {
    return (
        <StyledMessage $error={error} $visible={visible}>
            {children}
        </StyledMessage>
    );
}

export default Message;