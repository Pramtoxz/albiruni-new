import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { type NavItem, type NavGroup } from '@/types';
import { Link, usePage } from '@inertiajs/react';

export function NavMain({ items = [], groups = [] }: { items?: NavItem[]; groups?: NavGroup[] }) {
    const page = usePage();
    
    const isActive = (itemHref: string | { url: string }) => {
        const href = typeof itemHref === 'string' ? itemHref : itemHref.url;
        const currentUrl = page.url;
        
        if (href === '/' || href === '/dashboard') {
            return currentUrl === href;
        }
        
        if (currentUrl === href) {
            return true;
        }
        
        const allItems = [...items, ...groups.flatMap(g => g.items)];
        const hasLongerMatch = allItems.some((otherItem) => {
            const otherHref = typeof otherItem.href === 'string' ? otherItem.href : otherItem.href.url;
            return otherHref !== href && 
                   otherHref.length > href.length && 
                   currentUrl.startsWith(otherHref);
        });
        
        return !hasLongerMatch && currentUrl.startsWith(href);
    };
    
    if (groups.length > 0) {
        return (
            <>
                {groups.map((group) => (
                    <SidebarGroup key={group.title} className="px-2 py-0">
                        <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
                        <SidebarMenu>
                            {group.items.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton
                                        asChild
                                        isActive={isActive(item.href)}
                                        tooltip={{ children: item.title }}
                                    >
                                        <Link href={item.href} prefetch>
                                            {item.icon && <item.icon />}
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroup>
                ))}
            </>
        );
    }
    
    return (
        <SidebarGroup className="px-2 py-0">
            <SidebarGroupLabel>Platform</SidebarGroupLabel>
            <SidebarMenu>
                {items.map((item) => (
                    <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton
                            asChild
                            isActive={isActive(item.href)}
                            tooltip={{ children: item.title }}
                        >
                            <Link href={item.href} prefetch>
                                {item.icon && <item.icon />}
                                <span>{item.title}</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                ))}
            </SidebarMenu>
        </SidebarGroup>
    );
}
