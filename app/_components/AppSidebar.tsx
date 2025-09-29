import React from 'react'
import "@/public/logo.png" 
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import {  AudioLines, CalendarDays , ChartNoAxesCombined, GalleryThumbnails, Gauge, Home, ImageIcon, Inbox, Lightbulb, ScrollText, Search, Settings, Settings2, User2 } from "lucide-react"
import Image from 'next/image'
import { usePathname } from 'next/navigation'

const items = [
    {
        title: "Home",
        url: "/dashboard",
        icon: Home,
    },
    {
        title: "Thumbnail Generator",
        url: "/ai-thumbnail-generator",
        icon: ImageIcon,
    },
    {
        title: "Thumbnail Search",
        url: "/thumbnail-search",
        icon: GalleryThumbnails,
    },
    {
        title: "Content Calender",
        url: "/content-calender",
        icon: CalendarDays ,
    },
    {
        title: "Trend Analyzer",
        url: "#",
        icon: ChartNoAxesCombined,
    },
    {
        title: "AI Script Generator",
        url:"/script-generator",
        icon:ScrollText 
    },
    {
        title: "AI Voice Over",
        url: "/ai-voice-over",
        icon: AudioLines ,
    },
    {
        title: "AI Content Generator",
        url: "/ai-content-generator",
        icon: Lightbulb,
    },
    {
        title: "Billing",
        url: "#",
        icon: Settings2,
    },
    {
        title: "Profile",
        url: "#",
        icon: User2,
    },
]

export function AppSidebar() {
    const path = usePathname();
    return (
        <Sidebar>
            <SidebarHeader>
                <div className='p-4'>
                    <Image src={'/logo.png'} alt='logo' width={1024} height={1024}
                        className='w-full h-full rounded-full' 
                        
                        />
                    <h2 className='text-sm text-gray-400 text-center'></h2>
                </div>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>

                    <SidebarGroupContent>
                        <SidebarMenu className='mt-5'>
                            {items.map((item, index) => (
                                // <SidebarMenuItem key={item.title} className='p-2'>
                                //     <SidebarMenuButton asChild className=''>
                                <a href={item.url} key={index} className={`p-2 text-lg flex gap-2 items-center
                                 hover:bg-gray-100 rounded-lg ${path.includes(item.url) && 'bg-gray-200ß'}`}>
                                    <item.icon className='h-5 w-5' />
                                    <span>{item.title}</span>
                                </a>
                                //     </SidebarMenuButton>
                                // </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
                <h2 className='p-2 text-gray-400 text-sm'></h2>
            </SidebarFooter>
        </Sidebar>
    )
}