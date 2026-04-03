import { useState } from "react";
import { Link } from "react-router-dom";
import {Menu} from "lucide-react"

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export default function Navbar(){
    const [open, setOpen] = useState(false); // Mobile-menu

    return(
        <header className="sticky top-0 z-50 w-full border-b bg-background">
            <div className="max-w-7xl mx-auto px-4 flex h-14 items-center justify-between">
                
                {/* {Logo} */}
                <Link to="/" className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary rounded-xl flex items-center justify-center text-primary-foreground font-bold text-xl">
                    L
                </div>
                <span className="font-semibold text-xl tracking-tight">MyApp</span>
                </Link>

                {/* Desktop Auth Buttons */}
                <div className="hidden md:flex items-center gap-3">
                <Button variant="outline" asChild>
                    <Link to="/login">Login</Link>
                </Button>
                <Button asChild>
                    <Link to="/signup">Sign Up</Link>
                </Button>
                </div>

                {/* Mobile Menu Trigger */}
                <Sheet open={open} onOpenChange={setOpen}>
                <SheetTrigger asChild className="md:hidden">
                    <Button variant="ghost" size="icon">
                    <Menu className="h-5 w-5" />
                    </Button>
                </SheetTrigger>
                    <SheetContent side="right" className="w-[300px]">
                    <SheetHeader>
                        <SheetTitle className="text-left">Menu</SheetTitle>
                    </SheetHeader>

                    <div className="flex flex-col gap-4 pl-5 pr-5">

                        <Button
                        variant="outline"
                        className="w-full justify-start"
                        asChild
                        onClick={() => setOpen(false)}
                        >
                        <Link to="/login">Login</Link>
                        </Button>
                        <Button
                        className="w-full justify-start"
                        asChild
                        onClick={() => setOpen(false)}
                        >
                        <Link to="/signup">Sign Up</Link>
                        </Button>
                    </div>
                    </SheetContent>
                </Sheet>

            </div>
        </header>
    )
}