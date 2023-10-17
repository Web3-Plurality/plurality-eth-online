import { ReactNode } from 'react';
import styled from 'styled-components';
import { Checkmark } from 'react-checkmark';


type CardProps = {
  content: {
    title?: string;
    description: ReactNode;
    button?: ReactNode;
  };
  disabled?: boolean;
  fullWidth?: boolean;
  connected?: boolean; 
};

const CardWrapper = styled.div<{ fullWidth?: boolean; disabled: boolean; connected: boolean }>`
  display: flex;
  margin: 16px 0 0 16px;
  flex-direction: column;
  width: ${({ fullWidth }) => (fullWidth ? '500px' : '300px')};
  background-color: ${({ theme }) => theme.colors.card.default};
  margin-top: 2.4rem;
  margin-bottom: 2.4rem;
  padding: 2.4rem;
  border: 1px solid ${({ theme }) => theme.colors.border.default};
  border-radius: ${({ theme }) => theme.radii.default};
  box-shadow: ${({ theme, connected }) => connected ? theme.shadows.connected : theme.shadows.default};
  filter: opacity(${({ disabled, connected }) => ((disabled && !connected) ? '.4' : '1')});
  align-self: stretch;
  align-items: center;
  ${({ theme }) => theme.mediaQueries.small} {
    width: 100%;
    margin-top: 1.2rem;
    margin-bottom: 1.2rem;
    padding: 1.6rem;
  }
`;

const Title = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes.large};
  text-align: center;
  margin: 0;
  ${({ theme }) => theme.mediaQueries.small} {
    font-size: ${({ theme }) => theme.fontSizes.text};
  }
`;

const Description = styled.div`
  margin-top: 2.4rem;
  margin-bottom: 2.4rem;
  text-align: center;
`;


export const Card = ({ content, disabled = false, fullWidth, connected = false }: CardProps) => {
  const { title, description, button } = content;
  return (
    <CardWrapper fullWidth={fullWidth} disabled={disabled} connected={connected}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {title && (
          <Title>{title}</Title>
        )}
        {connected && (
          <div style={{ margin: '5px'}}>
            <Checkmark size="medium"/>
          </div>
        )}
      </div>
      <Description>{description}</Description>
      {button}
    </CardWrapper>
  );
};
