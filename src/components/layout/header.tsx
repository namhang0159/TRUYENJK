"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, Menu, User, BookOpen, Star, Crown, ShieldAlert } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useSearchStories, useCategories } from "@/hooks/use-stories";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ModeToggle } from "@/components/mode-toggle";
import { buttonVariants } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { RegisterAuthorModal } from "@/components/auth/register-author-modal";
import { PenTool } from "lucide-react";
import { Logo } from "@/components/logo";

export function Header() {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedTerm, setDebouncedTerm] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isRegisterAuthorOpen, setIsRegisterAuthorOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();

  // Debounce logic
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedTerm(searchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const { data: searchResults, isLoading } = useSearchStories(debouncedTerm);
  const { data: categories } = useCategories();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4 max-w-7xl mx-auto">
        {/* Logo & Main Nav */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 text-primary">
            <Logo className="w-10 h-10" />
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link href="/" className="transition-colors hover:text-primary">Trang Chủ</Link>
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1 transition-colors hover:text-primary outline-none">
                Thể loại
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48">
                {categories?.map((cat: any) => (
                  <Link key={cat.id} href={`/categories/${cat.slug}`} className="w-full cursor-pointer">
                    <DropdownMenuItem className="cursor-pointer">{cat.name}</DropdownMenuItem>
                  </Link>
                ))}
                {!categories && <DropdownMenuItem>Đang tải...</DropdownMenuItem>}
              </DropdownMenuContent>
            </DropdownMenu>
            <Link href="/moi-cap-nhat" className="text-sm font-medium hover:text-primary transition-colors flex items-center gap-1">
              <BookOpen className="w-4 h-4" /> Mới cập nhật
            </Link>
            <Link href="/explore" className="text-sm font-medium hover:text-primary transition-colors flex items-center gap-1">
              <Star className="w-4 h-4" /> Khám phá
            </Link>
            <Link href="/rankings" className="text-sm font-medium hover:text-primary transition-colors flex items-center gap-1">
              <Crown className="w-4 h-4" /> Bảng xếp hạng
            </Link>
          </nav>
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-md px-4 relative">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Tìm kiếm truyện, tác giả..."
              className="w-full bg-muted/50 pl-9 rounded-full focus-visible:ring-1"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setIsSearchOpen(true);
              }}
              onFocus={() => setIsSearchOpen(true)}
              onBlur={() => setTimeout(() => setIsSearchOpen(false), 200)}
            />
          </div>

          {/* Search Dropdown */}
          {isSearchOpen && debouncedTerm && (
            <div className="absolute top-12 left-4 right-4 bg-background border rounded-md shadow-lg overflow-hidden z-50">
              <ScrollArea className="max-h-80">
                <div className="p-2 flex flex-col gap-1">
                  {isLoading ? (
                    Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="flex items-center gap-3 p-2">
                        <Skeleton className="h-12 w-8 rounded" />
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-32" />
                          <Skeleton className="h-3 w-24" />
                        </div>
                      </div>
                    ))
                  ) : searchResults?.length ? (
                    searchResults.map((story) => (
                      <Link
                        key={story.id}
                        href={`/truyen/${story.id}`}
                        className="flex items-center gap-3 p-2 hover:bg-muted rounded-sm transition-colors"
                      >
                        <img src={story.coverImage} alt={story.title} className="h-12 w-8 object-cover rounded" />
                        <div className="flex flex-col">
                          <span className="text-sm font-medium line-clamp-1">{story.title}</span>
                          <span className="text-xs text-muted-foreground">{story.author}</span>
                        </div>
                      </Link>
                    ))
                  ) : (
                    <div className="p-4 text-center text-sm text-muted-foreground">
                      Không tìm thấy truyện nào.
                    </div>
                  )}
                </div>
              </ScrollArea>
            </div>
          )}
        </div>

        {/* User Actions */}
        <div className="flex items-center gap-2">
          <ModeToggle />
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
          
          {isAuthenticated && user ? (
            <DropdownMenu>
              <DropdownMenuTrigger render={<Button variant="outline" size="sm" className="hidden sm:flex items-center gap-2" />}>
                  <div className="w-6 h-6 rounded-full overflow-hidden bg-muted">
                    {user.avatarUrl ? (
                      <img src={user.avatarUrl} alt={user.displayName} className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-4 h-4 m-1" />
                    )}
                  </div>
                  <span className="truncate max-w-[100px]">{user.displayName}</span>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem>
                  <Link href="/profile" className="w-full h-full flex items-center gap-2"><User className="w-4 h-4" /> Hồ sơ cá nhân</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/profile/library" className="w-full h-full flex items-center gap-2"><BookOpen className="w-4 h-4" /> Tủ sách của tôi</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/profile/wallet" className="w-full h-full">Quản lý Ví</Link>
                </DropdownMenuItem>
                {user.role === 'AUTHOR' || user.role === 'ADMIN' ? (
                  <DropdownMenuItem>
                    <Link href="/studio" className="w-full h-full">Author Studio</Link>
                  </DropdownMenuItem>
                ) : user.authorStatus === 'PENDING' ? (
                  <DropdownMenuItem disabled className="text-muted-foreground">
                    <PenTool className="w-4 h-4 mr-2" /> Đang chờ duyệt tác giả
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem onClick={() => setIsRegisterAuthorOpen(true)} className="cursor-pointer text-primary">
                    <PenTool className="w-4 h-4 mr-2" /> Đăng ký làm tác giả
                  </DropdownMenuItem>
                )}

                {user.role === 'ADMIN' || user.role === 'SUPER_ADMIN' ? (
                  <Link href="/admin/dashboard">
                    <DropdownMenuItem className="cursor-pointer font-medium text-purple-600">
                      <ShieldAlert className="mr-2 h-4 w-4" />
                      <span>Admin Dashboard</span>
                    </DropdownMenuItem>
                  </Link>
                ) : null}

                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} className="text-red-500 cursor-pointer">
                  Đăng xuất
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden sm:flex items-center gap-2">
              <Link 
                href="/login"
                className={buttonVariants({ variant: "outline", size: "sm" })}
              >
                Đăng nhập
              </Link>
              <Link 
                href="/register"
                className={buttonVariants({ variant: "default", size: "sm" })}
              >
                Đăng ký
              </Link>
            </div>
          )}
        </div>
      </div>
      
      <RegisterAuthorModal 
        isOpen={isRegisterAuthorOpen} 
        onClose={() => setIsRegisterAuthorOpen(false)} 
      />
    </header>
  );
}
