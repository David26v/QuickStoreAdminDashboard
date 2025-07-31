"use client"

import React from "react"
import { Command, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Check, ChevronDown } from "lucide-react"

export const MultiSelect = ({ options, selected = [], onChange, placeholder = "Select..." }) => {
  const [open, setOpen] = React.useState(false)

  const handleSelect = (value) => {
    if (selected.includes(value)) {
      onChange(selected.filter((val) => val !== value))
    } else {
      onChange([...selected, value])
    }
  }

  const getLabel = (value) => options.find((opt) => opt.value === value)?.label || value

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {selected.length > 0
            ? selected.map(getLabel).join(", ")
            : placeholder}
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Search..." />
          <CommandList>
            {options.map((opt) => (
              <CommandItem
                key={opt.value}
                onSelect={() => handleSelect(opt.value)}
                className="flex justify-between"
              >
                <span>{opt.label}</span>
                {selected.includes(opt.value) && <Check className="w-4 h-4 text-primary" />}
              </CommandItem>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
