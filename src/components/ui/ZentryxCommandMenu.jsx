
"use client";
import React from "react";
import {
  LayoutDashboard,
  ClipboardCheck,
  Briefcase,
  Users2,
  CalendarDays,
  FileClock,
  Wallet,
  Bell,
  HelpCircle,
  Settings,
} from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { useRouter } from "next/navigation";
import { useLoading } from "../providers/LoadingProvider";

const MENU_ITEMS = [
  {
    type: "single",
    label: "Dashboard",
    icon: LayoutDashboard,
    path: "/users/dashboard",
  },
  {
    type: "group",
    heading: "Project Management",
    items: [
      { label: "My Tasks", icon: ClipboardCheck, path: "/users/task" },
      { label: "Projects", icon: Briefcase, path: "/users/project" },
      { label: "My Team", icon: Users2, path: "/users/teams" },
    ],
  },
  {
    type: "group",
    heading: "Personal",
    items: [
      { label: "Attendance", icon: CalendarDays, path: "/users/attendance" },
      { label: "Leave Requests", icon: FileClock, path: "/users/leave-requests" },
      { label: "My Payroll", icon: Wallet, path: "/users/payroll" },
    ],
  },
  {
    type: "single",
    label: "Notifications",
    icon: Bell,
    path: "/users/notifications",
  },
  {
    type: "single",
    label: "Help & Support",
    icon: HelpCircle,
    path: "/users/support",
  },
  {
    type: "single",
    label: "Settings",
    icon: Settings,
    path: "/users/settings", 
  },
];

export function ZentryxCommandMenu({ open, onOpenChange, onClose }) {
  const router = useRouter();
  // 2. Use the loading hook
  const { show, hide } = useLoading();


  const handleSelect = async (path) => {
    let itemLabel = "Loading module...";
    for (const item of MENU_ITEMS) {
      if (item.type === "single" && item.path === path) {
        itemLabel = item.label;
        break;
      } 
      else if (item.type === "group") {
        const found = item.items.find(subItem => subItem.path === path);
        if (found) {
          itemLabel = found.label;
          break;
        }
      }
    }


    show(`Loading ${itemLabel}...`);


    await new Promise(res => setTimeout(res, 300));

    router.push(path);

    onClose();

    setTimeout(() => {
      hide();
    }, 300);
  };

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>

        {MENU_ITEMS.map((item, index) => {
          if (item.type === "single") {
            return (
              <CommandItem
                key={item.label}
                // 4. Pass the path to handleSelect
                onSelect={() => handleSelect(item.path)}
              >
                <item.icon className="mr-2 h-4 w-4" />
                <span>{item.label}</span>
              </CommandItem>
            );
          }

          if (item.type === "group") {
            return (
              <React.Fragment key={item.heading}>
                {/* Separator before first group */}
                {index > 0 && <CommandSeparator />}
                <CommandGroup heading={item.heading}>
                  {item.items.map((subItem) => (
                    <CommandItem
                      key={subItem.label}
                      // 5. Pass the path to handleSelect
                      onSelect={() => handleSelect(subItem.path)}
                    >
                      <subItem.icon className="mr-2 h-4 w-4" />
                      <span>{subItem.label}</span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </React.Fragment>
            );
          }

          return null;
        })}
      </CommandList>
    </CommandDialog>
  );
}