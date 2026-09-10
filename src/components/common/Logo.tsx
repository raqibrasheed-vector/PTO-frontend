import type { ImgHTMLAttributes } from "react";

import LogoImage from "@/assets/logo.svg";
import { cn } from "@/lib/utils";
import { Link } from "react-router";

type LogoProps = Omit<ImgHTMLAttributes<HTMLImageElement>, "src" | "alt"> & {
    alt?: string;
};

const Logo = ({ className, alt = "Your Brand Name", ...props }: LogoProps) => {
    return (
        <Link
            to="/home"
            aria-label="Go to homepage"
            className="inline-flex items-center"
        >
            <img
                src={LogoImage}
                alt={alt}
                className={cn("h-auto w-36", className)}
                {...props}
            />
        </Link>
    );
};

export default Logo;
