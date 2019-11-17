import React from "react";
import { makeStyles } from "@material-ui/styles";

const colorByValue = new Map<any, string>([
  [true, "green"],
  [false, "red"],
  [undefined, "rebeccapurple"],
  [null, "blue"],
]);

interface DebugValueProps {
  name: string;
  value: React.ReactNode;
}

function DebugValue({ name, value }: DebugValueProps) {
  const wouldBeHidden = ([undefined, null, true, false] as unknown[]).includes(
    value,
  );
  const wouldThrow =
    typeof value === "object" && value !== null && !React.isValidElement(value);
  const displayValue = wouldBeHidden || wouldThrow ? String(value) : value;
  const color = colorByValue.get(value) || "black";
  return (
    <>
      <span style={{ color }}>{name}:</span>{" "}
      <span style={{ color }}>{displayValue}</span>
    </>
  );
}

const useStyles = makeStyles({
  debugInfo: {
    display: "grid",
    opacity: 0.5,
    gridTemplateColumns: "auto auto",
    gridColumnGap: "1ch",
    position: "absolute",
    top: 65,
    left: 10,
    padding: 10,
    fontFamily: "monospace",
    fontWeight: "bold",
    backgroundColor: "hsla(0, 0%, 100%, 0.8)",
    pointerEvents: "none",
  },
});

interface DebugInfoProps {
  open: boolean;
  values: {
    [k: string]: React.ReactNode;
  };
}

export default function DebugInfo({
  open,
  values,
}: DebugInfoProps): JSX.Element | null {
  const classes = useStyles();

  if (!open) {
    return null;
  }
  return (
    <div className={classes.debugInfo}>
      {Object.entries(values).map(([key, value]) => (
        <DebugValue key={key} name={key} value={value} />
      ))}
    </div>
  );
}
