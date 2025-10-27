import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';

export function NavMain({ items = [] }: { items: NavItem[] }) {
    const page = usePage();
    
    const isActive = (itemHref: string | { url: string }) => {
        const href = typeof itemHref === 'string' ? itemHref : itemHref.url;
        const currentUrl = page.url;
        
        // Exact match for root paths
        if (href === '/' || href === '/dashboard') {
            return currentUrl === href;
        }
        
        // For other paths, check if current URL matches exactly or is a direct child
        // But prevent parent paths from being active when child paths are active
        if (currentUrl === href) {
            return true;
        }
        
        // Check if any other menu item has a longer matching path
        const hasLongerMatch = items.some((otherItem) => {
            const otherHref = typeof otherItem.href === 'string' ? otherItem.href : otherItem.href.url;
            return otherHref !== href && 
                   otherHref.length > href.length && 
                   currentUrl.startsWith(otherHref);
        });
        
        // Only mark as active if no longer path matches
        return !hasLongerMatch && currentUrl.startsWith(href);
    };
    
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
