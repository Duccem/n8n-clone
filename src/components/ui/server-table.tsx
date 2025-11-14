import {
  ColumnDef,
  flexRender,
  Table as ReactTable,
  Row,
} from "@tanstack/react-table";
import {
  ArrowDown,
  ArrowUp,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { cn } from "@/lib/utils";
import { Button } from "./button";
import { Checkbox } from "./checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./table";

export function SortableHeader<T>({
  table,
  children,
  name,
}: {
  table: ReactTable<T>;
  name: string;
  children: React.ReactNode;
}) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const column = searchParams.get("sort");
  const order = searchParams.get("order");
  const createSortQuery = useCallback(
    (name: string) => {
      const params = new URLSearchParams(searchParams);
      const prevSort = params.get("sort");
      const prevOrder = params.get("order");

      params.set("sort", name);

      if (prevSort === name) {
        if (prevOrder === "ASC") {
          params.set("order", "DESC");
        } else if (prevOrder === "DESC") {
          params.delete("sort");
          params.delete("order");
        } else {
          params.set("order", "ASC");
        }
      } else {
        params.set("order", "ASC");
      }

      router.replace(`${pathname}?${params.toString()}`);
    },
    [searchParams, router, pathname]
  );
  const isVisible = (id: any) =>
    table
      .getAllLeafColumns()
      .find((col: any) => col.id === id)
      ?.getIsVisible() ?? false;

  if (isVisible(name)) {
    return (
      <Button
        className=" cursor-pointer"
        variant="ghost"
        onClick={() => createSortQuery(name)}
      >
        {children}
        {name === column && order === "ASC" && <ArrowUp size={16} />}
        {name === column && order === "DESC" && <ArrowDown size={16} />}
      </Button>
    );
  }
  return null;
}

export function SelectableHeader<T>({ table }: { table: ReactTable<T> }) {
  return (
    <Checkbox
      checked={
        table.getIsAllRowsSelected() ||
        (table.getIsSomeRowsSelected() && "indeterminate")
      }
      onCheckedChange={(value) => table.toggleAllRowsSelected(!!value)}
      aria-label="Select all"
    />
  );
}

export function SelectableCell<T>({ row }: { row: Row<T> }) {
  return (
    <Checkbox
      checked={row.getIsSelected()}
      onCheckedChange={(value) => row.toggleSelected(!!value)}
      aria-label="Select row"
    />
  );
}

export function ServerPagination({
  meta,
}: {
  meta: { page: number; pages: number; size: number; total: number };
}) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const pageSize = searchParams.get("pageSize") ?? 10;
  const createPageQuery = useCallback(
    (currentPage: string) => {
      const params = new URLSearchParams(searchParams);
      params.set("page", currentPage);

      router.replace(`${pathname}?${params.toString()}`);
    },
    [searchParams, router, pathname]
  );

  const createPageSizeQuery = useCallback(
    (size: string) => {
      const params = new URLSearchParams(searchParams);
      params.set("pageSize", size);

      router.replace(`${pathname}?${params.toString()}`);
    },
    [searchParams, router, pathname]
  );
  return (
    <div className="flex items-center justify-between px-2">
      <div className="flex items-center space-x-6 lg:space-x-8">
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium">Tamaño de la pagina</p>
          <Select
            value={`${pageSize}`}
            onValueChange={(value) => createPageSizeQuery(value)}
            disabled={meta.total < 10}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={pageSize} />
            </SelectTrigger>
            <SelectContent side="top" className="rounded-xl">
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <SelectItem
                  key={pageSize}
                  value={`${pageSize}`}
                  className="rounded-xl"
                >
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <div className="flex w-[100px] items-center justify-center text-sm font-medium">
          Page {meta.page} of {meta.pages}
        </div>
        <Button
          variant="ghost"
          className="hidden h-8 w-8 p-0 lg:flex"
          onClick={() => createPageQuery("1")}
          disabled={meta.page === 1}
        >
          <span className="sr-only">Go to first page</span>
          <ChevronsLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          className="h-8 w-8 p-0"
          onClick={() => createPageQuery(`${meta.page - 1}`)}
          disabled={meta.page === 1}
        >
          <span className="sr-only">Go to previous page</span>
          <ChevronLeftIcon className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          className="h-8 w-8 p-0"
          onClick={() => createPageQuery(`${meta.page + 1}`)}
          disabled={meta.page === meta.pages}
        >
          <span className="sr-only">Go to next page</span>
          <ChevronRightIcon className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          className="hidden h-8 w-8 p-0 lg:flex"
          onClick={() => createPageQuery(`${meta.pages}`)}
          disabled={meta.page == meta.pages}
        >
          <span className="sr-only">Go to last page</span>
          <ChevronsRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

export function ServerTable<T>({
  table,
  setOpen,
  columns,
}: {
  table: ReactTable<T>;
  columns: ColumnDef<T>[];
  setOpen: (id: string) => void;
}) {
  return (
    <Table>
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow
            key={headerGroup.id}
            className="h-[40px] md:h-[45px] select-text border-none hover:bg-transparent"
          >
            {headerGroup.headers.map((header) => {
              return (
                <TableHead
                  key={header.id}
                  className="px-3 md:px-4 py-2 border-none"
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </TableHead>
              );
            })}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {table.getRowModel().rows.length ? (
          table.getRowModel().rows.map((row) => (
            <TableRow
              key={row.id}
              className="h-[40px] md:h-[45px] cursor-pointer select-text hover:bg-transparent"
            >
              {row.getVisibleCells().map((cell) => (
                <TableCell
                  key={cell.id}
                  className={cn("px-3 md:px-4 py-2 border-y")}
                  onClick={() => {
                    if (
                      cell.column.id !== "select" &&
                      cell.column.id !== "actions"
                    ) {
                      setOpen(row.id);
                    }
                  }}
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))
        ) : (
          <TableRow className="hover:bg-transparent">
            <TableCell colSpan={columns.length} className=" text-center">
              No results.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}

export function ServerTableLoading({ cellNumber }: { cellNumber: number }) {
  const cells = Array.from({ length: cellNumber }, (_, i) => i);
  const data = Array.from({ length: 10 }, (_, i) => ({ id: i }));
  return (
    <div className="w-full animate-pulse">
      <Table>
        <TableHeader>
          <TableRow className="h-[40px] md:h-[45px] select-text border-none hover:bg-transparent">
            {cells.map((cell) => (
              <TableHead key={cell} className="w-[50px]">
                <div className="h-3.5 w-[15px] rounded-md bg-gray-300 dark:bg-gray-600" />
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>

        <TableBody className="w-full">
          {data?.map((row) => (
            <TableRow
              key={row.id}
              className="h-[40px] md:h-[45px] cursor-pointer select-text"
            >
              {cells.map((cell) => (
                <TableCell key={cell} className="w-[50px]">
                  <div className="h-3.5 w-[15px] rounded-md bg-gray-300 dark:bg-gray-600" />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

