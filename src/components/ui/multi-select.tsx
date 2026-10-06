import * as React from "react"
import { Check, ChevronsUpDown, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"

export type Option = {
  label: string
  value: string
}

interface MultiSelectProps {
  options: Option[]
  selected: string[]
  onChange: (selected: string[]) => void
  placeholder?: string
}

export function MultiSelect({
  options,
  selected,
  onChange,
  placeholder = "Select items...",
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false)

  const handleUnselect = (item: string) => {
    onChange(selected.filter((i) => i !== item))
  }

  const handleSelect = (item: string) => {
    if (selected.includes(item)) {
      onChange(selected.filter((i) => i !== item))
    } else {
      onChange([...selected, item])
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger render={
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between h-auto min-h-10 px-3 py-2 text-white bg-zinc-950 border-zinc-800 hover:bg-zinc-900 hover:text-white"
        />
      }>
        <div className="flex flex-wrap gap-1">
          {selected.length > 0 ? (
            selected.map((item) => {
              const option = options.find((o) => o.value === item)
              if (!option) return null
              return (
                <Badge
                  variant="secondary"
                  key={item}
                  className="mr-1 mb-1 bg-zinc-800 text-white border-zinc-700 hover:bg-zinc-700 font-mono text-xs"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleUnselect(item)
                  }}
                >
                  {option.label}
                  <X className="ml-1 h-3 w-3 hover:text-red-400 cursor-pointer" />
                </Badge>
              )
            })
          ) : (
            <span className="text-zinc-500 font-normal">{placeholder}</span>
          )}
        </div>
        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50 text-zinc-400" />
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0 bg-black border border-zinc-800 text-white shadow-xl" align="start">
        <ScrollArea className="h-64 p-1">
          <div className="flex flex-col gap-1 p-2">
            {options.map((option) => (
              <div
                key={option.value}
                className={cn(
                  "relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors",
                  selected.includes(option.value) ? "bg-zinc-800/80 font-medium text-white" : ""
                )}
                onClick={() => handleSelect(option.value)}
              >
                <div className={cn(
                  "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-zinc-700",
                  selected.includes(option.value) ? "bg-white text-black" : "opacity-50"
                )}>
                  {selected.includes(option.value) && (
                    <Check className="h-3 w-3 text-black" />
                  )}
                </div>
                {option.label}
              </div>
            ))}
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  )
}
