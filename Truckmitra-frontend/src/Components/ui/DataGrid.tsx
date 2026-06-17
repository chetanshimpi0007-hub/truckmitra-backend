import React from 'react';
import { HiOutlineSearch, HiChevronLeft, HiChevronRight } from 'react-icons/hi';

interface Column<T> {
  header: string;
  accessor: keyof T | ((row: T) => React.ReactNode);
  className?: string;
}

interface DataGridProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (row: T) => string | number;
  onRowClick?: (row: T) => void;
  searchable?: boolean;
  onSearch?: (term: string) => void;
  loading?: boolean;
  emptyMessage?: string;
  hidePagination?: boolean;
  emptyStateIcon?: React.ReactNode;
}

export function DataGrid<T>({ 
  columns, 
  data, 
  keyExtractor, 
  onRowClick,
  searchable,
  onSearch,
  loading,
  emptyMessage = "No records found",
  hidePagination = false,
  emptyStateIcon
}: DataGridProps<T>) {

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
      {searchable && (
        <div className="p-4 border-b border-slate-100 flex items-center bg-slate-50/50">
          <div className="relative w-full max-w-md">
            <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Search..."
              onChange={(e) => onSearch?.(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
            />
          </div>
        </div>
      )}
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              {columns.map((col, idx) => (
                <th key={idx} className={`px-6 py-4 text-[11px] font-black uppercase tracking-wider text-slate-500 ${col.className || ''}`}>
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              [...Array(5)].map((_, i) => (
                <tr key={i} className="animate-pulse">
                  {columns.map((_, j) => (
                    <td key={j} className="px-6 py-4">
                      <div className="h-4 bg-slate-100 rounded-full w-3/4"></div>
                    </td>
                  ))}
                </tr>
              ))
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="p-4">
                  <div className="flex flex-col items-center justify-center py-12 px-4 bg-slate-50/50 rounded-xl border border-slate-100 border-dashed">
                    {emptyStateIcon ? (
                      <div className="mb-4">{emptyStateIcon}</div>
                    ) : (
                      <div className="w-16 h-16 bg-slate-100 text-slate-300 rounded-full flex items-center justify-center mb-4">
                        <HiOutlineSearch className="w-8 h-8" />
                      </div>
                    )}
                    <p className="text-sm font-medium text-slate-500">{emptyMessage}</p>
                  </div>
                </td>
              </tr>
            ) : (
              data.map((row) => (
                <tr 
                  key={keyExtractor(row)} 
                  onClick={() => onRowClick?.(row)}
                  className={`group transition-colors ${onRowClick ? 'cursor-pointer hover:bg-primary-50/50' : 'hover:bg-slate-50'}`}
                >
                  {columns.map((col, idx) => (
                    <td key={idx} className={`px-6 py-4 text-sm text-slate-700 ${col.className || ''}`}>
                      {typeof col.accessor === 'function' ? col.accessor(row) : (row[col.accessor] as any)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      {/* Pagination - Simplified for now */}
      {!loading && data.length > 0 && !hidePagination && (
        <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/30">
          <span className="text-xs font-semibold text-slate-500">Showing {data.length} records</span>
          <div className="flex space-x-2">
            <button className="p-1.5 rounded-lg border border-slate-200 text-slate-400 hover:text-primary-600 hover:border-primary-200 hover:bg-primary-50 disabled:opacity-50 transition-all"><HiChevronLeft className="w-5 h-5"/></button>
            <button className="p-1.5 rounded-lg border border-slate-200 text-slate-400 hover:text-primary-600 hover:border-primary-200 hover:bg-primary-50 disabled:opacity-50 transition-all"><HiChevronRight className="w-5 h-5"/></button>
          </div>
        </div>
      )}
    </div>
  );
}
