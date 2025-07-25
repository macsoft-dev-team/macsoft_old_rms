import { Search } from "lucide-react";
import Input from "./ui/input";

export default function SearchForm() {
    return (
        <section className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4" />
            <Input
                placeholder="Search devices..."
                className="pl-10 w-100 border-gray-300 dark:bg-gray-800 dark:text-white dark:border-gray-600"
            />
        </section>
    );
}