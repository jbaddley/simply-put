"use client";

import { Sidebar } from "flowbite-react";

interface SideMenuProps {
  items: { label: string; slug: string }[];
  label: string;
}

export default function SideMenu({ items, label }: SideMenuProps) {
  return (
    <Sidebar aria-label={label}>
      <Sidebar.Items>
        <Sidebar.ItemGroup>
          {items.map(({ label, slug }) => (
            <Sidebar.Item href={slug}>
              <p>{label}</p>
            </Sidebar.Item>
          ))}
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
}
