import Button from "react-bootstrap/Button";

export const QuantityForm = ({ value, maxValue, onChange }: { value: number; maxValue: number; onChange: Function}) => {
    return (
      <div style={{ display: "flex" }}>
        {value} / {maxValue}
        <Button onClick={(e) => onChange(Math.min(value + 1, maxValue))}>
          +
        </Button>
        <Button onClick={(e) => onChange(Math.max(value - 1, 0))}>-</Button>
      </div>
    );
};