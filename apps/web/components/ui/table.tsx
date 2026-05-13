import type { HTMLAttributes, ReactNode, TableHTMLAttributes, ThHTMLAttributes, TdHTMLAttributes } from "react";

export function Table({ children, ...props }: TableHTMLAttributes<HTMLTableElement>) {
  return (
    <div className="ui-table-wrap">
      <table className="ui-table" {...props}>
        {children}
      </table>
    </div>
  );
}

export function TableHeader({ children }: { children: ReactNode }) {
  return <thead>{children}</thead>;
}

export function TableBody({ children }: { children: ReactNode }) {
  return <tbody>{children}</tbody>;
}

export function TableRow({ children, ...props }: HTMLAttributes<HTMLTableRowElement>) {
  return <tr {...props}>{children}</tr>;
}

export function TableHead({ children, ...props }: ThHTMLAttributes<HTMLTableCellElement>) {
  return <th {...props}>{children}</th>;
}

export function TableCell({ children, ...props }: TdHTMLAttributes<HTMLTableCellElement>) {
  return <td {...props}>{children}</td>;
}
