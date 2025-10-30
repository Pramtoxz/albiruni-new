import React, { useState } from "react"
import { Link, usePage } from "@inertiajs/react"
import { Star, User, LogOut, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { type SharedData } from '@/types'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import AlbiLogo from '@/assets/home/albi.svg'

export function Header() {
  const { auth } = usePage<SharedData>().props
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="relative z-50 px-6 py-4 bg-blue-900 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="flex items-center gap-3">
          <div className="relative">
            <img src={AlbiLogo} alt="Albiruni Logo" className="w-12 h-12 object-contain" />
            <div className="absolute -top-1 -right-1">
              <Star className="text-yellow-300 w-4 h-4 animate-twinkle" />
            </div>
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white">
              <span className="text-blue-300">A</span>
              <span className="text-white">lbiruni</span>
            </h1>
            <p className="text-xs text-blue-200">PRESCHOOL & DAY CARE</p>
          </div>
        </Link>

        <nav className="hidden md:flex gap-8">
          <NavLink href="#home">Home</NavLink>
          <NavLink href="#features">Features</NavLink>
          <NavLink href="#activities">Kegiatan</NavLink>
          <NavLink href="#facilities">Fasilitas</NavLink>
          <NavLink href="#teachers">Guru</NavLink>
          <NavLink href="#about">About</NavLink>
          <NavLink href="#contact">Contact</NavLink>
        </nav>

        {/* Mobile menu button */}
        <div className="md:hidden">
          <Button
            variant="ghost"
            size="icon"
            className="text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>
        </div>

        {auth.user ? (
          <div className="hidden md:block">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="bg-yellow-500 hover:bg-yellow-600 text-blue-900 font-bold px-5 py-1.5 rounded-sm flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>Profil</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem asChild>
                  <Link href="/dashboard" className="cursor-pointer w-full">
                    Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings/profile" className="cursor-pointer w-full">
                    Pengaturan
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    href="/logout"
                    method="post"
                    as="button"
                    className="cursor-pointer w-full flex items-center text-red-600 gap-2"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ) : (
          <Link
            href="/login"
            className="hidden md:flex bg-yellow-500 hover:bg-yellow-600 text-blue-900 font-bold px-5 py-1.5 rounded-sm"
          >
            Login
          </Link>
        )}
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 top-[72px] z-40 bg-blue-900 md:hidden">
          <div className="container p-6 h-full flex flex-col overflow-y-auto">
            <nav className="flex flex-col gap-4 pt-6 pb-8 border-b border-blue-800">
              <MobileNavLink href="#home" onClick={() => setMobileMenuOpen(false)}>Home</MobileNavLink>
              <MobileNavLink href="#features" onClick={() => setMobileMenuOpen(false)}>Features</MobileNavLink>
              <MobileNavLink href="#activities" onClick={() => setMobileMenuOpen(false)}>Kegiatan</MobileNavLink>
              <MobileNavLink href="#facilities" onClick={() => setMobileMenuOpen(false)}>Fasilitas</MobileNavLink>
              <MobileNavLink href="#teachers" onClick={() => setMobileMenuOpen(false)}>Guru</MobileNavLink>
              <MobileNavLink href="#about" onClick={() => setMobileMenuOpen(false)}>About</MobileNavLink>
              <MobileNavLink href="#contact" onClick={() => setMobileMenuOpen(false)}>Contact</MobileNavLink>
            </nav>

            <div className="pt-6">
              {auth.user ? (
                <div className="flex flex-col gap-4">
                  <Link
                    href="/dashboard"
                    className="flex items-center gap-2 text-blue-200 font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span className="bg-blue-800 p-2 rounded-full">
                      <User className="h-5 w-5" />
                    </span>
                    Dashboard
                  </Link>
                  <Link
                    href="/settings/profile"
                    className="flex items-center gap-2 text-blue-200 font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span className="bg-blue-800 p-2 rounded-full">
                      <User className="h-5 w-5" />
                    </span>
                    Pengaturan Profil
                  </Link>
                  <Link
                    href="/logout"
                    method="post"
                    as="button"
                    className="flex items-center gap-2 text-red-400 font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span className="bg-red-900/50 p-2 rounded-full">
                      <LogOut className="h-5 w-5" />
                    </span>
                    Keluar
                  </Link>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="flex items-center justify-center bg-yellow-500 hover:bg-yellow-600 text-blue-900 font-bold px-5 py-3 rounded-md w-full"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

interface NavLinkProps {
  href: string
  children: React.ReactNode
}

function NavLink({ href, children }: NavLinkProps) {
  return (
    <Link href={href} className="text-blue-200 hover:text-yellow-300 transition-colors relative group">
      {children}
      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-yellow-300 transition-all group-hover:w-full"></span>
    </Link>
  )
}

interface MobileNavLinkProps {
  href: string
  children: React.ReactNode
  onClick?: () => void
}

function MobileNavLink({ href, children, onClick }: MobileNavLinkProps) {
  return (
    <Link
      href={href}
      className="text-white hover:text-yellow-300 transition-colors text-xl font-medium py-2"
      onClick={onClick}
    >
      {children}
    </Link>
  )
} 
