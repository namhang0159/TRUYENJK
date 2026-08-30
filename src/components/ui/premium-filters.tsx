"use client";

import { motion } from "framer-motion";
import { Filter, ChevronDown, Check } from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface PremiumFiltersProps {
  categories: any[];
  filters: {
    category_slug: string;
    status: string;
    sort_by: string;
    page: number;
  };
  onFilterChange: (key: string, value: string) => void;
  hideCategory?: boolean;
}

const statusOptions = [
  { value: "all", label: "Mọi trạng thái" },
  { value: "ONGOING", label: "Đang ra" },
  { value: "COMPLETED", label: "Hoàn thành" },
];

const sortOptions = [
  { value: "updated_at", label: "Mới cập nhật" },
  { value: "created_at", label: "Mới đăng" },
  { value: "views", label: "Lượt xem" },
  { value: "rating", label: "Đánh giá cao" },
];

export function PremiumFilters({ categories, filters, onFilterChange, hideCategory }: PremiumFiltersProps) {
  return (
    <div className="w-full space-y-4">
      {/* Categories Horizontal Scroll */}
      {!hideCategory && (
        <div className="relative flex items-center">
          <ScrollArea className="w-full whitespace-nowrap pb-4">
            <div className="flex w-max space-x-2 px-1">
              <button
                onClick={() => onFilterChange("category_slug", "all")}
                className={cn(
                  "relative px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 outline-none",
                  filters.category_slug === "all" 
                    ? "text-white" 
                    : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                )}
              >
                {filters.category_slug === "all" && (
                  <motion.div
                    layoutId="activeCategory"
                    className="absolute inset-0 bg-indigo-600 dark:bg-indigo-500 rounded-full -z-10 shadow-lg shadow-indigo-500/30"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                Tất cả
              </button>
              
              {categories?.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => onFilterChange("category_slug", cat.slug)}
                  className={cn(
                    "relative px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 outline-none",
                    filters.category_slug === cat.slug
                      ? "text-white" 
                      : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  )}
                >
                  {filters.category_slug === cat.slug && (
                    <motion.div
                      layoutId="activeCategory"
                      className="absolute inset-0 bg-indigo-600 dark:bg-indigo-500 rounded-full -z-10 shadow-lg shadow-indigo-500/30"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                  {cat.name}
                </button>
              ))}
            </div>
            <ScrollBar orientation="horizontal" className="invisible" />
          </ScrollArea>
        </div>
      )}

      {/* Secondary Filters (Status & Sort) */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400 mr-2">
          <Filter className="w-4 h-4" /> Lọc theo:
        </div>

        {/* Status Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 hover:border-indigo-500/50 transition-all outline-none group shadow-sm">
            {statusOptions.find(o => o.value === filters.status)?.label || "Trạng thái"}
            <ChevronDown className="w-4 h-4 text-zinc-400 group-hover:text-indigo-500 transition-colors" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-48 rounded-xl border-zinc-200 dark:border-zinc-800 shadow-xl p-1 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl">
            {statusOptions.map(option => (
              <DropdownMenuItem 
                key={option.value}
                onClick={() => onFilterChange("status", option.value)}
                className="rounded-lg cursor-pointer flex items-center justify-between py-2.5 px-3 focus:bg-indigo-50 dark:focus:bg-indigo-500/10 focus:text-indigo-600 dark:focus:text-indigo-400"
              >
                {option.label}
                {filters.status === option.value && <Check className="w-4 h-4" />}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Sort Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 hover:border-indigo-500/50 transition-all outline-none group shadow-sm">
            {sortOptions.find(o => o.value === filters.sort_by)?.label || "Sắp xếp"}
            <ChevronDown className="w-4 h-4 text-zinc-400 group-hover:text-indigo-500 transition-colors" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-48 rounded-xl border-zinc-200 dark:border-zinc-800 shadow-xl p-1 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl">
            {sortOptions.map(option => (
              <DropdownMenuItem 
                key={option.value}
                onClick={() => onFilterChange("sort_by", option.value)}
                className="rounded-lg cursor-pointer flex items-center justify-between py-2.5 px-3 focus:bg-indigo-50 dark:focus:bg-indigo-500/10 focus:text-indigo-600 dark:focus:text-indigo-400"
              >
                {option.label}
                {filters.sort_by === option.value && <Check className="w-4 h-4" />}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
