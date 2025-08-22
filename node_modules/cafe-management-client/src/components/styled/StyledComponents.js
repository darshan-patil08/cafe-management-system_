// client/src/components/styled/StyledComponents.js
import styled from 'styled-components';
import { motion } from 'framer-motion';

export const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
`;

export const Card = styled(motion.div)`
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  padding: 24px;
  margin: 16px 0;
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
    transform: translateY(-2px);
  }
`;

export const Button = styled(motion.button)`
  background: ${props => props.variant === 'primary' ? '#8B4513' : '#f5f5f5'};
  color: ${props => props.variant === 'primary' ? 'white' : '#333'};
  border: none;
  border-radius: 8px;
  padding: 12px 24px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: ${props => props.variant === 'primary' ? '#7A3E0F' : '#e0e0e0'};
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const FormGroup = styled.div`
  margin-bottom: 20px;
`;

export const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #333;
`;

export const Input = styled.input`
  width: 100%;
  padding: 12px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.3s ease;

  &:focus {
    outline: none;
    border-color: #8B4513;
  }

  &:invalid {
    border-color: #ff6b6b;
  }
`;
