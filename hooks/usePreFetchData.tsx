import { getAvailableExpenseMonths } from "@/repositories/ExpenseRepo";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

export default function usePreFetchData() {
    const queryClient = useQueryClient();

    useEffect(() => {
        queryClient.prefetchQuery({
            queryKey: ["expenses", "availableExpenseMonths"],
            queryFn: getAvailableExpenseMonths,
        });
    }, []);

    return null;
}
