import { CSSProperties } from 'react';
import svgsList from '../../assets/svgs';
export interface CustomSvgProps {
    type: keyof typeof svgsList;
    className?: string;
    style?: CSSProperties;
    onClick?: () => void;
}
export default function CustomSvg({ type, className, ...props }: CustomSvgProps): JSX.Element;
