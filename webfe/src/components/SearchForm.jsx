import { useState } from "react";
import { Search } from "lucide-react";
import Input from "./ui/input";

export default function SearchForm() {
    const [searchQuery, setSearchQuery] = useState("");

    const handleSearch = (e) => {
        e.preventDefault();
        // Add your search logic here
    };

    return (
        <div className="flex items-center relative">
            <Search className="absolute left-3 w-5 h-5 text-gray-400 dark:text-gray-500" />
            <Input
                className="pl-10 pr-3 w-full min-w-80"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search devices . . ."
            />
        </div>
    );
}